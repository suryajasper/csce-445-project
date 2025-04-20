import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './App.css';

const personas = [
  {
    id: 'emma',
    name: 'Emma',
    color: 'green',
    stance: 'positive',
    quote: "It’s important to learn about physics",
    description: `Emma is a dedicated student who values traditional learning. She believes in attending lectures and engaging with the curriculum to grasp complex subjects.`,
  },
  {
    id: 'james',
    name: 'James',
    color: 'red',
    stance: 'neutral',
    quote: '',
    description: `James is a junior Computer Science major at Texas A&M. While he's technically enrolled in all the right courses, he’s not exactly a fan of sitting through lectures...`,
  },
  {
    id: 'sarah',
    name: 'Sarah',
    color: 'red',
    stance: 'negative',
    quote: "I don’t learn anything",
    description: `Sarah finds the class structure unengaging and struggles to stay motivated...`,
  },
  {
    id: 'michael',
    name: 'Michael',
    color: 'red',
    stance: 'neutral',
    quote: '',
    description: `Michael is still forming an opinion and prefers to hear more perspectives...`,
  }
];

const App = () => {
  const [mutedState, setMutedState] = useState(
    personas.reduce((acc, p) => ({ ...acc, [p.id]: p.id !== 'emma' && p.id !== 'michael' }), {})
  );
  const [selectedPersona, setSelectedPersona] = useState(null);

  const toggleMute = (id: string) => {
    setMutedState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const { transcript } = useSpeechRecognition();

  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true });
  }, []);

  return (
    <div className="app-container">
      <h1>Topic: Is this class useful?</h1>

      <div className="personas-container">
        {personas.map(p => (
          <div className="character" key={p.id}>
            <div className="character-avatar" style={{ backgroundColor: mutedState[p.id] ? '#e74c3c' : '#2ecc71' }} onClick={() => setSelectedPersona(p)}></div>
            <p className="character-name" style={{ color: mutedState[p.id] ? '#e74c3c' : '#2ecc71' }}> {p.name}</p>
            <button className="mute-button" onClick={() => toggleMute(p.id)}>
              {mutedState[p.id] ? 'Unmute' : 'Mute'}
            </button>
            <p className="quote">{!mutedState[p.id] && p.quote}</p>
          </div>
        ))}
      </div>

      <div className="you-section">
        <h2>You:</h2>
        <p>{transcript || 'Say something...'}</p>
      </div>

      {selectedPersona && (
        <div className="modal">
          <h2>{selectedPersona.name}</h2>
          <p>{selectedPersona.description}</p>
          <button onClick={() => setSelectedPersona(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default App;