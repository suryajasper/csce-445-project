import React from "react";

const LandingPage = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-100 to-blue-300 p-4 text-center">
      <h1 className="text-4xl font-extrabold mb-4 text-blue-800">
        🎤 Practice Public Speaking
      </h1>
      <p className="text-lg text-gray-700 mb-8 max-w-md">
        Choose or generate a topic and practice speaking with a responsive virtual audience. Select who you want to interact with during your presentation.
      </p>
      <button
        onClick={onStart}
        className="bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-800"
      >
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;

