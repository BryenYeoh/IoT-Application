import { usePERCLOSScore } from './PerclosScoreContext';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VideoStream = () => {
  const [perclosScore, setPerclosScore] = useState(null);
  const [finalScoreReceived, setFinalScoreReceived] = useState(false);
  const { updateFinalScore } = usePERCLOSScore(); // Use the context here

  // Fetch the PERCLOS score every 5 seconds, until the final score is received
  useEffect(() => {
    const perclosScoreTimer = setInterval(() => {
      axios
        .get('http://127.0.0.1:3500/perclos_score')
        .then((response) => {
          setPerclosScore(response.data);
        })
        .catch((error) => {
          console.error('Error fetching PERCLOS score:', error);
        });
    }, 5000);

    // Request the final PERCLOS score after 20 seconds
    setTimeout(() => {
      requestFinalPerclosScore(updateFinalScore);
    }, 22000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(perclosScoreTimer);
    };
  }, []);

  // Request the final PERCLOS score
  const requestFinalPerclosScore = async (updateFinalScore) => {
    const { data: finalPerclosScore } = await axios.get(
      'http://127.0.0.1:3500/perclos_score'
    );

    if (finalPerclosScore) {
      updateFinalScore(finalPerclosScore);
      console.log('hello');
    }

    setFinalScoreReceived(true);
  };
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  };
  const imageStyle = {
    // transform: 'rotate(90deg)',
    width: '400px',
    height: '50%',
    display: 'block',
    margin: '0 auto',
  };
  const textStyle = {
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <img src="http://127.0.0.1:3500/video_feed" style={imageStyle}></img>
      <div style={textStyle}>
        <p>
          hello PERCLOS Score:{' '}
          {perclosScore !== null ? perclosScore : 'Loading...'}
        </p>
      </div>
    </div>
  );
};

export default VideoStream;
