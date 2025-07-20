import React, { useState } from "react";
import "./style.css";

type Option = { text: string; votes: number };

const App = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<Option[]>([{ text: "", votes: 0 }]);
  const [submitted, setSubmitted] = useState(false);

  // Add new option field
  const addOption = () => setOptions([...options, { text: "", votes: 0 }]);

  // Change option text
  const handleOptionChange = (i: number, value: string) => {
    const temp = [...options];
    temp[i].text = value;
    setOptions(temp);
  };

  // Submit poll setup
  const submitPoll = () => {
    if (question.trim() && options.every((opt) => opt.text.trim())) {
      setSubmitted(true);
    } else {
      alert("Sawal aur saari options likho!");
    }
  };

  // Vote for option
  const vote = (i: number) => {
    const temp = [...options];
    temp[i].votes += 1;
    setOptions(temp);
  };

  return (
    <div className="poll-container">
      <h1>Poll Mini App</h1>
      {!submitted ? (
        <div className="setup-form">
          <input
            className="question-input"
            placeholder="Sawal likho..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          {options.map((opt, i) => (
            <input
              key={i}
              className="option-input"
              placeholder={`Option ${i + 1}`}
              value={opt.text}
              onChange={(e) => handleOptionChange(i, e.target.value)}
            />
          ))}
          <button className="add-btn" onClick={addOption}>Option aur jodo</button>
          <button className="submit-btn" onClick={submitPoll}>Poll create karo</button>
        </div>
      ) : (
        <div className="poll-area">
          <h2>{question}</h2>
          {options.map((opt, i) => (
            <button key={i} className="vote-btn" onClick={() => vote(i)}>
              {opt.text} <span className="vote-count">{opt.votes} vote</span>
            </button>
          ))}
          
