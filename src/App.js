import React, { useState } from 'react';
import './App.css';

function App() {
  const [matchId, setMatchId] = useState(''); // State to hold the match ID
  const [report, setReport] = useState(''); // State to hold the match report

  const fetchMatchReport = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/sse?fixtureId=${matchId}`);
      const data = await response.json();
      if (response.ok) {
        setReport(data.digest); // Assuming the response contains matchDigest
      } else {
        setReport('Error fetching report: ' + data.error);
      }
    } catch (error) {
      setReport('Error: ' + error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Enter Match ID to get the report:
        </p>
        <input 
          type="text" 
          value={matchId} 
          onChange={(e) => setMatchId(e.target.value)} 
          placeholder="Match ID" 
        />
        <button onClick={fetchMatchReport}>Get Match Report</button>
        {report && (
          <div className="match-report">
            <h2>Match Report:</h2>
            <p>{report}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
