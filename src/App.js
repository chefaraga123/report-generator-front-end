import React, { useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import './App.css';

function App() {
  const [matchId, setMatchId] = useState('');

  const navigate = useNavigate();

  const handleGetMatchReport = () => {
    if (matchId) {
      navigate(`/match-report/${matchId}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Match Report Generator</h1>
        <Routes>
          <Route path="/" element={
            <div className="description-box">
              <h2>How It Works</h2>
              <p>
                This tool allows you to generate match reports by entering a Match ID. 
                Once you enter the ID and click "Get Match Report," the app <b>redirects you to a new page</b> & then fetches the 
                report from the server and displays it below. The report provides insights 
                into the match, including key events and statistics.
              </p>
              <p>
                You can download the report as a .txt file by clicking "Download Report".
              </p>
              <p>
                It may take as long as 30 seconds to generate the report.
              </p>
              <p>
                Enter Match ID to get the report:
              </p>
              <p>
                This is shown in the URL of the match page: 
                <a href="https://footium.club/game/fixtures/live/yourMatchId" target="_blank" rel="noopener noreferrer">
                  https://footium.club/game/fixtures/live/yourMatchId
                </a>
              </p>
              <input 
                type="text" 
                value={matchId} 
                onChange={(e) => setMatchId(e.target.value)} 
                placeholder="Match ID" 
              />
              <button onClick={handleGetMatchReport}>Get Match Report</button>
            </div>
          } />
          <Route path="/match-report/:id" element={<MatchReport />} />
        </Routes>
      </header>
    </div>
  );
}

function MatchReport() {
  const { id } = useParams();
  const [report, setReport] = useState('');
  const [goals, setGoals] = useState([]);
  const [cards, setCards] = useState([]);
  const [homeTeamGoals, setHomeTeamGoals] = useState('');
  const [awayTeamGoals, setAwayTeamGoals] = useState('');
  const [homeTeamName, setHomeTeamName] = useState('');
  const [awayTeamName, setAwayTeamName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5004';

  React.useEffect(() => {
    const cachedData = localStorage.getItem(`matchReport-${id}`);
    if (cachedData) {
      const data = JSON.parse(cachedData);
      setReport(data.digest);
      setGoals(data.goals || []);
      setCards(data.cards || []);
      setHomeTeamGoals(data.homeTeamGoals);
      setAwayTeamGoals(data.awayTeamGoals);
      setHomeTeamName(data.homeTeamName);
      setAwayTeamName(data.awayTeamName);
      setImageUrl(data.imageUrl);
      setLoading(false);
    } else {
      const fetchMatchReport = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${backendUrl}/api/sse?fixtureId=${id}`);
          
          // Check if the response is a CORS response
          if (response.type === 'cors' && response.ok) {
            console.log('CORS response received');
            // Handle CORS response differently if needed
          }

          if (response.ok) {
            const data = await response.json();
            console.log("data", data)
            localStorage.setItem(`matchReport-${id}`, JSON.stringify(data));
            setReport(data.digest);
            setGoals(data.goals || []);
            setCards(data.cards || []);
            setHomeTeamGoals(data.homeTeamGoals);
            setAwayTeamGoals(data.awayTeamGoals);
            setHomeTeamName(data.homeTeamName);
            setAwayTeamName(data.awayTeamName);
            setImageUrl(data.imageUrl);
          } else {
            const errorData = await response.json();
            setReport('Error fetching report: ' + errorData.error);
          }
        } catch (error) {
          setReport('Error: ' + error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchMatchReport();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderGoals = (goals) => {
    if (!Array.isArray(goals)) return null;
    return goals.map((goal, index) => (
      <p key={index}>
        {goal.team} - <a href={`https://footium.club/game/players/${goal.goal_scorer_id}`} target="_blank" rel="noopener noreferrer">{goal.goal_scorer}</a>
      </p>
    ));
  };

  return (
    <div className="match-report">
      <div className="report-container">
        <button className="download-button">Download Report</button>
        {imageUrl && <img src={imageUrl} alt="Generated Match Scene" />}
      </div>
      <h2>Score: {homeTeamName} {homeTeamGoals} - {awayTeamGoals} {awayTeamName}</h2>
      <h2>Match Report:</h2>
      <p>{report}</p>
      <h2>Goals:</h2>
      {renderGoals(goals)}
      <h2>Cards:</h2>
      {/* Render cards similarly */}
    </div>
  );
}

export default App;
