import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import TopicSelector from "./components/TopicSelector";
import PresentationRoom from "./components/PresentationRoom";

const App = () => {
  const [view, setView] = useState("landing"); // "landing", "topic", "presentation"
  const [topic, setTopic] = useState("");

  const handleTopicChosen = (chosenTopic) => {
    setTopic(chosenTopic);
    setView("presentation");
  };

  return (
    <div className="font-sans">
      {view === "landing" && (
        <LandingPage onStart={() => setView("topic")} />
      )}
      {view === "topic" && (
        <TopicSelector onTopicChosen={handleTopicChosen} />
      )}
      {view === "presentation" && (
        <PresentationRoom topic={topic} />
      )}
    </div>
  );
};

export default App;
