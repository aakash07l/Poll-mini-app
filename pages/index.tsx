
import React, { useState } from "react";
import "../style.css"; // Agar aapki style.css project root me hai

type Option = { text: string; votes: number };

export default function Home() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<Option[]>([{ text: "", votes: 0 }]);
  const [submitted, setSubmitted] = useState(false);

  const addOption = () => setOptions([...options, { text: "", votes: 0 }]);
  const handleOptionChange = (i: number, value: string) => {
    const temp = [...options];
    temp[i].text = value;
    setOptions(temp);
  };
  const submitPoll = () => {
    if (question.trim() && options.every((opt) => opt.text.trim())) {
      setSubmitted(true);
    } else {
      alert("Sawal aur saari options likho!");
    }
  };
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
          <button className="add-btn" onClick={addOption}>
            Option aur jodo
          </button>
          <button className="submit-btn" onClick={submitPoll}>
            Poll create karo
          </button>
        </div>
      ) : (
        <div className="poll-area">
          <h2>{question}</h2>
          {options.map((opt, i) => (
            <button key={i} className="vote-btn" onClick={() => vote(i)}>
              {opt.text} <span className="vote-count">{opt.votes} vote</span>
            </button>
          ))}
          <h3>Results:</h3>
          <ul className="results-list">
            {options.map((opt, i) => (
              <li key={i}>
                {opt.text}: <strong>{opt.votes}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
