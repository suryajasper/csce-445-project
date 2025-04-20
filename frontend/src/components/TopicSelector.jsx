import React, { useState } from "react";

const TopicSelector = ({ onTopicChosen }) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim() !== "") {
      onTopicChosen(input.trim());
    }
  };

  const generateRandomTopic = () => {
    const examples = [
      "Is AI taking over creative jobs?",
      "The ethics of space colonization",
      "Should college be free?",
      "Does social media harm mental health?",
    ];
    const random = examples[Math.floor(Math.random() * examples.length)];
    setInput(random);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-green-100 to-green-300 p-4">
      <h1 className="text-3xl font-bold mb-6">🎯 Choose Your Topic</h1>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your topic..."
        className="w-full max-w-md px-4 py-2 mb-4 border rounded shadow text-center"
      />

      <div className="flex gap-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleSubmit}
        >
          Use This Topic
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={generateRandomTopic}
        >
          Generate Random Topic
        </button>
      </div>

      {input && (
        <p className="mt-6 text-lg font-semibold text-gray-800">
          Selected Topic: <span className="italic">{input}</span>
        </p>
      )}
    </div>
  );
};

export default TopicSelector;
