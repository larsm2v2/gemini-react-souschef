import { useState } from "react";
import "./App.css";

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOptions = [
    "Show me a Latin recipe",
    "Show me an Italian recipe",
    "Show me a Haitian recipe",
    "Show me a Greek recipe",
    "Show me a Welsh recipe",
    "Show me a Latin dinner recipe",
    "Show me an Italian dinner recipe",
    "Show me a Haitian dinner recipe",
    "Show me a Greek dinner recipe",
    "Show me a Welsh dinner recipe",
    "Show me a Latin dinner recipe",
    "Show me an Italian dessert recipe",
    "Show me a Haitian dessert recipe",
    "Show me a Greek dessert recipe",
    "Show me a Welsh dessert recipe",
  ];

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Let's try that again. Please ask a question.");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      console.log(data);
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: [value],
        },
        {
          role: "model",
          parts: [data],
        },
      ]);
      setValue("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong! Please try again later.");
    }
  };

  const clear = () => {
    setValue("");
    setError("");
  };
  return (
    <div className="App">
      <p>
        What do you want to know?
        <button
          className="surprise"
          onClick={surprise}
          disabled={chatHistory.length}
        >
          Surprise Me!
        </button>
      </p>
      <div className="input-container">
        <input
          value={value}
          placeholder="When is Christmas...?"
          onChange={(e) => setValue(e.target.value)}
        />
        {!error && <button onClick={getResponse}>Ask me</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      <div className="search-result">
        {chatHistory.map((chatItem, _index) => (
          <div key={_index}>
            <p className="answer">
              {chatItem.role} : {chatItem.parts}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
