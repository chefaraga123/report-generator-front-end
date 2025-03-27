import React, { useState } from 'react';
import './App.css';

function App() {
  const [matchId, setMatchId] = useState(''); // State to hold the match ID
  const [report, setReport] = useState(''); // State to hold the match report
  const [goals, setGoals] = useState(''); // State to hold the goals
  const [cards, setCards] = useState(''); // State to hold the cards

  const fetchMatchReport = async () => {
    try {
      const response = await fetch(`http://localhost:5004/api/sse?fixtureId=${matchId}`);
      const data = await response.json();
      if (response.ok) {
        setReport(data.digest); // Assuming the response contains matchDigest
        setGoals(data.goals);
        setCards(data.cards);
      } else {
        setReport('Error fetching report: ' + data.error);
      }
    } catch (error) {
      setReport('Error: ' + error.message);
    }
  };

  // Function to split the report into paragraphs
  const renderReport = (reportText) => {
    return reportText.split('. ').map((paragraph, index) => (
      <p key={index}>{paragraph.trim() + (index < reportText.split('. ').length - 1 ? '.' : '')}</p>
    ));
  };

  const renderGoals = (goals) => {
    return goals.map((goal, index) => (
      <p key={index}>{goal.team} - {goal.goal_scorer} - {goal.goal_time}</p>
    ));
  };

  const renderCards = (cards) => {
    return cards.map((card, index) => (
      <p key={index}>{card.team} - {card.card_receiver} - {card.card_time}</p>
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Match Report Generator</h1>
        <div className="description-box">
          <h2>How It Works</h2>
          <p>
            This tool allows you to generate match reports by entering a Match ID. 
            Once you enter the ID and click "Get Match Report," the app fetches the report 
            from the server and displays it below. The report provides insights into the 
            match, including key events and statistics.
          </p>
        </div>
        <p>Enter Match ID to get the report:</p>
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
            {renderReport(report)}
            <h2>Goals:</h2>
            {renderGoals(goals)}
            <h2>Cards:</h2>
            {renderCards(cards)}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
