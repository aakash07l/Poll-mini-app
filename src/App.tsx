import React, { useState } from "react";
import "./style.css";

type Poll = { question: string; options: { text: string; votes: number }[] };

function PollMiniApp() {
  // All polls in state (client-side only)
  const [polls, setPolls] = useState<Poll[]>([]);

  // Current page (menu/nav state)
  const [page, setPage] = useState<"create" | "all">("create");

  // Global app poll ID (used to show a specific poll, Farcaster/Farcastle style)
  const [activePollId, setActivePollId] = useState<number | null>(null);

  // Create a new poll
  const createPoll = (question: string, options: string[]) => {
    if (!question.trim() || options.length < 2) {
      alert("Please enter a question and at least 2 options.");
      return;
    }
    setPolls((prev) => [
      {
        question,
        options: options.map((opt) => ({ text: opt, votes: 0 })),
      },
      ...prev,
    ]);
    setPage("all"); // Switch to all polls view after creation
    setActivePollId(0); // Show the latest poll
  };

  // Vote on a poll (local state)
  const onVote = (pollIdx: number, optionIdx: number) => {
    setPolls((prev) => {
      const updated = [...prev];
      updated[pollIdx].options[optionIdx].votes += 1;
      return updated;
    });
    window.parent?.postMessage?.({ type: "poll_voted", result: "success" }, "*"); // Optional: Farcaster embed can listen for this
  };

  // Active poll component (for embeds, shows one poll)
  const ActivePoll = ({ poll }: { poll: Poll }) => {
    const [votedOption, setVotedOption] = useState<number | null>(null);
    return (
      <div className="poll-container">
        <h2>{poll.question}</h2>
        {poll.options.map((opt, i) => (
          <button
            key={i}
            className="option-button"
            onClick={() => {
              if (votedOption === null) {
                setVotedOption(i);
                onVote(0, i); // For simplicity, assumes 0 is the current poll
              }
            }}
            disabled={votedOption !== null}
            style={{ opacity: votedOption !== null ? 0.6 : 1 }}
          >
            {opt.text} <span className="vote-count">{opt.votes} votes</span>
          </button>
        ))}
        {votedOption !== null && (
          <div style={{ color: "#16a34a", marginTop: 8, fontWeight: 500 }}>
            You voted! ✅
          </div>
        )}
      </div>
    );
  };

  // All polls list component
  const AllPolls = ({ polls }: { polls: Poll[] }) => {
    return (
      <div className="poll-list">
        {polls.length === 0 && <p className="muted">No polls yet.</p>}
        {polls.map((poll, i) => (
          <div
            key={i}
            className="poll-card"
            onClick={() => {
              setActivePollId(i);
              // Optional: Try to shrink the embed if in Farcaster, notify parent frame
              window.parent?.postMessage?.({ type: "select_poll", pollId: i }, "*");
            }}
            style={{ cursor: "pointer" }}
          >
            <h3>{poll.question}</h3>
            <p className="muted">{poll.options.length} options</p>
          </div>
        ))}
      </div>
    );
  };

  // Create poll form component
  const CreatePoll = ({ onSubmit }: { onSubmit: (q: string, opts: string[]) => void }) => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const handleOption = (i: number, v: string) => {
      const temp = [...options];
      temp[i] = v;
      setOptions(temp);
    };
    const addOption = () => setOptions([...options, ""]);
    return (
      <div className="form-container">
        <h2>Create Poll</h2>
        <input
          type="text"
          placeholder="Poll question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        {options.map((opt, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => handleOption(i, e.target.value)}
          />
        ))}
        <button onClick={addOption}>Add Option</button>
        <button
          onClick={() => onSubmit(question, options.filter((x) => x.trim()))}
        >
          Create Poll
        </button>
      </div>
    );
  };

  // Main app layout
  return (
    <div className="app">
      <div className="header">
        <button
          className={page === "create" ? "active" : ""}
          onClick={() => setPage("create")}
        >
          Create Poll
        </button>
        <button
          className={page === "all" ? "active" : ""}
          onClick={() => setPage("all")}
        >
          All Polls
        </button>
      </div>
      <div className="content">
        {page === "create" && <CreatePoll onSubmit={createPoll} />}
        {page === "all" && (
          <>
            {activePollId !== null ? (
              <ActivePoll poll={polls[activePollId]} />
            ) : (
              <AllPolls polls={polls} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PollMiniApp;
