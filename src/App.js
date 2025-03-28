import React, { useState } from 'react';
import './App.css';

function App() {
  const [matchId, setMatchId] = useState(''); // State to hold the match ID
  const [report, setReport] = useState(''); // State to hold the match report
  const [goals, setGoals] = useState(''); // State to hold the goals
  const [cards, setCards] = useState(''); // State to hold the cards
  const [homeTeamGoals, setHomeTeamGoals] = useState(''); // State to hold the home team goals
  const [awayTeamGoals, setAwayTeamGoals] = useState(''); // State to hold the away team goals
  const [homeTeamName, setHomeTeamName] = useState(''); // State to hold the home team name
  const [awayTeamName, setAwayTeamName] = useState(''); // State to hold the away team name
  const [imageUrl, setImageUrl] = useState(''); // State to hold the image URL

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5004';
  console.log("backendUrl", backendUrl)
  
  const fetchMatchReport = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/sse?fixtureId=${matchId}`);
      const data = await response.json();
      if (response.ok) {
        setReport(data.digest); // Assuming the response contains matchDigest
        setGoals(data.goals);
        setCards(data.cards);
        setHomeTeamGoals(data.homeTeamGoals);
        setAwayTeamGoals(data.awayTeamGoals);
        setHomeTeamName(data.homeTeamName);
        setAwayTeamName(data.awayTeamName);
        setImageUrl(data.imageUrl); // Set the image URL
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
      <p key={index}>{goal.team} - <a href={`https://footium.club/game/players/${goal.goal_scorer_id}`} target="_blank" rel="noopener noreferrer">{goal.goal_scorer}</a></p>
    ));
  };

  const renderScore = () => {
    console.log("homeTeamGoals", homeTeamGoals, "awayTeamGoals", awayTeamGoals)
    return `${homeTeamName} ${homeTeamGoals} - ${awayTeamGoals} ${awayTeamName}`;
  };


  const renderCards = (cards) => {
    return cards.map((card, index) => (
      <p key={index}>{card.team} - <a href={`https://footium.club/game/players/${card.card_receiver_id}`} target="_blank" rel="noopener noreferrer">{card.card_receiver}</a></p>
    ));
  };

  const downloadReport = () => {
    const reportContent = `
      Score: 
      ${renderScore()}
    
      Match Report:
      ${report}

      Goals:
      ${goals.map(goal => `${goal.team} - ${goal.goal_scorer}`).join('\n')}

      Cards:
      ${cards.map(card => `${card.team} - ${card.card_receiver}`).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `match_report_${matchId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <p>
            You can download the report as a .txt file by clicking "Download Report". 
          </p>
          <p>
            It may take a few seconds to generate the report.
          </p>
        </div>
        <p>Enter Match ID to get the report:</p>
        <p>This is shown in the URL of the match page: https://footium.club/game/fixtures/live/***yourMatchId***</p>
        <input 
          type="text" 
          value={matchId} 
          onChange={(e) => setMatchId(e.target.value)} 
          placeholder="Match ID" 
        />
        <button onClick={fetchMatchReport}>Get Match Report</button>
        {matchId && (
          <a 
            href={`https://footium.club/game/fixtures/live/${matchId}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View Match
          </a>
        )}
        {report && (
          <div className="match-report">
            <div className="report-container">
              <button className="download-button" onClick={downloadReport}>Download Report</button>
              {imageUrl && <img src={imageUrl} alt="Generated Match Scene" />}
            </div>
            <h2>Score: {renderScore()}</h2>
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
