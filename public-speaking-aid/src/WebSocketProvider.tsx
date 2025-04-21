import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

type WebSocketEnvelope = {
  type: string;
  data: any;
};

type WebSocketContextType = {
  sendMessage: (type: string, data: any) => void;
  on: (type: string, handler: (data: any) => void) => void;
  off: (type: string, handler: (data: any) => void) => void;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Record<string, Set<(data: any) => void>>>({});

  const sendMessage = useCallback((type: string, data: any) => {
    const envelope: WebSocketEnvelope = { type, data };
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(envelope));
    } else {
      console.warn('WebSocket is not open. Cannot send message.');
    }
  }, []);

  const on = useCallback((type: string, handler: (data: any) => void) => {
    if (!handlersRef.current[type]) {
      handlersRef.current[type] = new Set();
    }
    handlersRef.current[type].add(handler);
  }, []);

  const off = useCallback((type: string, handler: (data: any) => void) => {
    handlersRef.current[type]?.delete(handler);
  }, []);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8765');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      try {
        const envelope: WebSocketEnvelope = JSON.parse(event.data);
        console.log('received', envelope);
        const { type, data } = envelope;
        const handlers = handlersRef.current[type];
        if (handlers) {
          handlers.forEach((handler) => handler(data));
        }
      } catch (e) {
        console.error('Invalid WebSocket message format:', event.data);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.warn('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ sendMessage, on, off }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
