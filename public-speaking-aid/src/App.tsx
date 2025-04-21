import React, { useState, useEffect } from 'react';
import { FiVolumeX, FiVolume2, FiMic, FiMicOff } from 'react-icons/fi';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import PositionSlider from './PositionSlider';
import { useWebSocket } from './WebSocketProvider';
import './App.css';

type Persona = {
  id: number;
  name: string;
  position: number; // -10 to 10
  quote: string;
  experience: string;
  muted: boolean;
};

const App: React.FC = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [topic, setTopic] = useState<string>("Is this class useful?");

  const [mutedState, setMutedState] = useState<Record<number, boolean>>(
    personas.reduce((acc, p) => ({ ...acc, [p.id]: p.id !== 0 && p.id !== 1 }), {})
  );
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  const toggleMute = (id: number) => {
    setMutedState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    SpeechRecognition.stopListening();
  }, []);

  const { sendMessage, on, off } = useWebSocket();

  const [isUserMuted, setIsUserMuted] = useState(true);
  const toggleUserMute = () => {
    if (isUserMuted) {
      // Start listening
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      setIsUserMuted(false);
    } else {
      // Stop listening and send the message
      SpeechRecognition.stopListening();
      setIsUserMuted(true);
  
      const message = transcript.trim();
      const unmutedCharacterIds = Object.entries(mutedState)
        .filter(([_, muted]) => !muted)
        .map(([id]) => parseInt(id));
  
      if (message && unmutedCharacterIds.length > 0) {
        console.log({
          message,
          character_ids: unmutedCharacterIds,
        });
        sendMessage('user_response', {
          message,
          character_ids: unmutedCharacterIds,
        });
      }
    }
  };

  const positionToColor = (position: number) : string => {
    if (position < -3) {
      return '#a80000';
    } else if (position > 3) {
      return '#048000';
    } else {
      return '#807900';
    }
  }

  useEffect(() => {
    interface CharacterResponse {
      character_id: number;
      response: string;
      position_update: number;
      history: any;
    }

    const handler = (data: CharacterResponse) => {
      console.log('Got character response', data, personas);
      setPersonas(oldPersonas =>
        oldPersonas.map(persona =>
          persona.id === data.character_id
            ? {
                ...persona,
                position: data.position_update,
                quote: data.response,
              }
            : persona
        )
      );      
    };

    on('character_response', handler);
    return () => off('character_response', handler);
  }, [on, off]);

  useEffect(() => {
    interface Character {
      id: number;
      name: string;
      age: number;
      position: number;
      experience: string;
    }

    interface Topic {
      topic: string;
      contention_yes: string;
      contention_no: string;
    }

    interface Initialization {
      topic: Topic;
      characters: Character[];
    }

    const handler = (data: Initialization) => {
      setPersonas(
        data.characters.map(character => ({
          id: character.id,
          name: character.name,
          position: character.position,
          quote: '',
          experience: character.experience,
          muted: true,
        } as Persona)
      ));
      setMutedState(data.characters.reduce((acc, c) => ({ ...acc, [c.id]: true }), {}));
      setTopic(data.topic.topic);
    };

    on('initialize', handler);
    return () => off('initialize', handler);
  }, [on, off]);

  return (
    <div className="app-container">
      <h1>{topic}</h1>

      <div className="personas-container">
        {personas.map(p => (
          <div 
            className="character" 
            key={p.id} 
            onClick={() => setSelectedPersona(p)}
          >
            <div className='character-header'>
              <p 
                className="character-name"
                style={{color: positionToColor(p.position)}}
              >
                {p.name}
              </p>
              <button
                className="mute-button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute(p.id);
                }}
              >
                {mutedState[p.id] ? <FiVolumeX size={20} color='red' /> : <FiVolume2 size={20} />}
              </button>
            </div>
            <div>
              <PositionSlider position={p.position} />
            </div>
            <p className="quote">{p.quote}</p>
          </div>
        ))}
      </div>

      <div className="you-section">
        <h2>You:</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="mute-button"
            onClick={toggleUserMute}
            title={isUserMuted ? "Unmute mic" : "Mute mic"}
          >
            {isUserMuted ? <FiMicOff size={20} color='red' /> : <FiMic size={20} />}
          </button>
          <p>{transcript || 'Say something...'}</p>
        </div>
      </div>

      {selectedPersona && (
        <div className="modal">
          <h2 
            style={{color: positionToColor(selectedPersona.position)}}
          >{selectedPersona.name}</h2>
          <p>{selectedPersona.experience}</p>
          <button onClick={() => setSelectedPersona(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default App;
