// src/components/Chatbot.js
import React from "react";

const Chatbot = () => {
  return (
    <div style={{ width: "350px", height: "500px", position: "fixed", bottom: "20px", right: "20px", zIndex: 1000, border: "1px solid #ccc", borderRadius: "10px", overflow: "hidden" }}>
      <iframe
        src="https://intern-mentor-bot.vercel.app/"
        style={{ width: "100%", height: "100%", border: "none" }}
        title="Intern Mentor Bot"
      ></iframe>
    </div>
  );
};

export default Chatbot;
