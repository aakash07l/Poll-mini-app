import React, { useState } from "react";
import "./style.css";

// Poll type
type Poll = {
  question: string;
  options: { text: string; votes: number }[];
};

function Navbar({ page, setPage }: { page: string; setPage: (v: string) => void }) {
  return (
    <nav className="navbar">
      <button className={page === "create" ? "active" : ""} onClick={() => setPage("create")}>
        Create Poll
      </button>
      <button className={page === "all" ? "active" : ""} onClick={() => setPage("all")}>
        All Polls
      </button>
    </nav>
  );
}

function CreatePoll({ onAddPoll }: { onAddPoll: (poll: Poll) => void }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ text: "", votes: 0 }, { text: "", votes: 0 }]);

  const handleOptionChange = (i: number, value: string) => {
    const temp = [...options];
    temp[i].text = value;
    setOptions(temp);
  };
  const addOption = () => setOptions([...options, { text: "", votes: 0 }]);
  const submit = () => {
    if (question.trim() && options.every((opt) => opt.text.trim())) {
      onAddPoll({ question, options });
      setQuestion("");
      setOptions([{ text: "", votes: 0 }, { text: "", votes: 0 }]);
      alert("Poll created!");
    } else {
      alert("सवाल और सभी options भरो!");
    }
  };

  return (
    <div className="poll-container">
      <h2>Create Poll</h2>
      <input className="question-input" placeholder="Question" value={question} onChange={e => setQuestion(e.target.value)} />
      {options.map((opt, i) => (
        <input
          key={i}
          className="option-input"
          placeholder={`Option ${i + 1}`}
          value={opt.text}
          onChange={e => handleOptionChange(i, e.target.value)}
        />
      ))}
      <button className="add-btn" onClick={addOption}>Add Option</button>
      <button className="submit-btn" onClick={submit}>Create Poll</button>
    </div>
  );
}

function AllPolls({ polls, onVote }: { polls: Poll[]; onVote: (pollIdx: number, optIdx: number) => void }) {
  // Store pollIndex=>optionIndex mapping in local state to allow only 1 vote per poll
  const [voted, setVoted] = useState<{ [pollIdx: number]: number }>({});

  const vote = (pollIdx: number, optIdx: number) => {
    if (voted[pollIdx] == null) {
      onVote(pollIdx, optIdx);
      setVoted({ ...voted, [pollIdx]: optIdx });
    }
  };

  return (
    <div className="poll-list">
      <h2>All Polls</h2>
      {polls.length === 0 && <p>No polls yet.</p>}
      {polls.map((poll, pi) => (
        <div key={pi} className="poll-container">
          <h3>{poll.question}</h3>
          {poll.options.map((opt, oi) => (
            <button
              key={oi}
              className="vote-btn"
              onClick={() => vote(pi, oi)}
              disabled={voted[pi] !== undefined}
              style={{ opacity: voted[pi] !== undefined ? 0.7 : 1 }}
            >
              {opt.text} <span className="vote-count">{opt.votes} vote</span>
            </button>
          ))}
          {voted[pi] !== undefined && <div style={{ color: "#16a34a", marginTop: 4 }}>Aapne vote kar diya</div>}
          <ul className="results-list">
            {poll.options.map((opt, oi) => (
              <li key={oi}>{opt.text}: <strong>{opt.votes}</strong></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const App: React.FC = () => {
  const [page, setPage] = useState("create");
  const [polls, setPolls] = useState<Poll[]>([]);

  const addPoll = (poll: Poll) => setPolls([poll, ...polls]);
  const vote = (pollIdx: number, optIdx: number) => {
    setPolls(prev => {
      const updated = [...prev];
      updated[pollIdx] = {
        ...updated[pollIdx],
        options: updated[pollIdx].options.map((opt, oi) =>
          oi === optIdx ? { ...opt, votes: opt.votes + 1 } : opt
        ),
      };
      return updated;
    });
  };

  return (
    <div>
      <Navbar page={page} setPage={setPage} />
      {page === "create" && <CreatePoll onAddPoll={addPoll} />}
      {page === "all" && <AllPolls polls={polls} onVote={vote} />}
    </div>
  );
};

export default App;
