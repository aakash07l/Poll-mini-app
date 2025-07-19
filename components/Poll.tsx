import React, { useState } from 'react';

type Option = { text: string; votes: number; };

const Poll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<Option[]>([{ text: '', votes: 0 }]);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionChange = (i: number, value: string) => {
    const temp = [...options];
    temp[i].text = value;
    setOptions(temp);
  };

  const addOption = () => setOptions([...options, { text: '', votes: 0 }]);

  const submitPoll = () => setSubmitted(true);

  const vote = (i: number) => {
    const temp = [...options];
    temp[i].votes += 1;
    setOptions(temp);
  };

  return (
    <div>
      {!submitted ? (
        <>
          <input placeholder="Poll Question" value={question} onChange={e => setQuestion(e.target.value)} />
          {options.map((opt, i) => (
            <div key={i}>
              <input value={opt.text} onChange={e => handleOptionChange(i, e.target.value)} />
            </div>
          ))}
          <button onClick={addOption}>Add Option</button>
          <button onClick={submitPoll}>Create Poll</button>
        </>
      ) : (
        <>
          <h3>{question}</h3>
          {options.map((opt, i) => (
            <div key={i}>
              <button onClick={() => vote(i)}>{opt.text} ({opt.votes} votes)</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Poll;
