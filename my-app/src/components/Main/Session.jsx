import GPSAndSpeedTracker from '../Sessions/GPSAndSpeedTracker'; // Import the GPSAndSpeedTracker component
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import React, { useEffect } from 'react';
import StartSession from '../Sessions/StartSession';
import EndSession from '../Sessions/EndSession';
import { useState } from 'react';
import VideoPopup from '../CV/VideoPopUp';
import { usePERCLOSScore } from '../CV/PerclosScoreContext';
import { alerts, icons, title } from '../../utils/alerts';
import { useNavigate } from 'react-router-dom';

const supabaseUrl = 'https://slgvzdffablpziwwlvkv.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZ3Z6ZGZmYWJscHppd3dsdmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgxNDc2NTcsImV4cCI6MjAxMzcyMzY1N30.xWYI8u8Gg7qLQfAyP-L8M7h00jyA4MPngvYOTx-YJXE';
const supabase = createClient(supabaseUrl, supabaseKey);
var counter = 0;
const limit = 1.42;
const Session = () => {
  const navigate = useNavigate();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [shouldRenderEnd, setShouldRenderEnd] = useState(false);
  const { finalScore, updateFinalScore } = usePERCLOSScore();
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    let intervalId;
    const fetchData = async () => {
      console.log('fetching ddata...');
      const { data, error } = await supabase
        .from('All')
        .select('*')
        .eq('id', sessionId)
        .not('speed_infraction', 'is', null)
        .not('perclos_score', 'is', null)
        .not('hard_brake', 'is', null)
        .order('interval', { ascending: false })
        .limit(3);
      if (data) {
        console.log(data);
        const safetyData = data.map((item) => {
          // Define weights for each factor (you can adjust these weights as needed)
          const speedWeight = 0.4;
          const hardBrakeWeight = 0.4;
          const perclosWeight = 0.3;

          // Normalize each factor to a scale of 0 to 1 (if not already)
          const normalizedSpeed = item.speed_infraction / 5; // Normalize to 0-1
          const normalizedHardBrake = item.hard_brake / 5; // Normalize to 0-1
          const normalizedPerclos = item.perclos_score; // Already in the 0-1 range

          // Calculate the safety index using the weighted formula
          const safetyIndex =
            speedWeight * normalizedSpeed +
            hardBrakeWeight * normalizedHardBrake +
            perclosWeight * normalizedPerclos;

          return {
            interval: item.interval,
            safety_index: safetyIndex,
          };
        });
        console.log(safetyData);

        const averageSafetyScore =
          safetyData.reduce(
            (acc, item) => acc + parseFloat(item.safety_index),
            0
          ) / safetyData.length;

        console.log('safetyscore: ', averageSafetyScore.toFixed(2));
        if (averageSafetyScore.toFixed(2) > limit) {
          if (counter > 1) {
            //end session and redirect to
            console.log('navigate to fail');
            clearInterval(intervalId);
            sessionStorage.removeItem('isSession');
            setShouldRenderEnd(false);
            setShowVideoPopup(false);
            updateFinalScore(null);
            setSessionId(null);

            setTimeout(() => {
              navigate('/fail');
              window.location.reload();
            }, 2000);

            counter = 0;
          } else {
            const html =
              'Your driving behavior is concerning and potentially hazardous. Please prioritize safety on the road :)';
            alerts(title.error, html, icons.error);
            counter += 1;
          }
        }
      } else if (error) {
        console.error('Error fetching speed data:', error);
      }
    };
    const isSession = sessionStorage.getItem('isSession');
    if (isSession !== null && !showVideoPopup) {
      fetchData();
      intervalId = setInterval(fetchData, 10000);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isPopupOpen, showVideoPopup]);

  useEffect(() => {
    console.log(finalScore);
    if (finalScore !== null) {
      setShowVideoPopup(false); // Close the modal
      if (finalScore > 0.15) {
        sessionStorage.removeItem('isSession');
        setShouldRenderEnd(false);
        setShowVideoPopup(false);
        updateFinalScore(null);
        setSessionId(null);
        const html = 'Too Drowsy! Please rest!';
        alerts(title.error, html, icons.error);
        setTimeout(() => {
          navigate('/fail');
          window.location.reload();
        }, 2000);
      } else {
        const html =
          'Drowsy processing complete! Please proceed with your job!';
        alerts(title.success, html, icons.success);
        const newId = uuidv4();
        setSessionId(newId);
        console.log('ID: ', newId);
      }
    }
  }, [finalScore]);

  useEffect(() => {
    const isSession = sessionStorage.getItem('isSession');

    if (isSession === 'true') {
      setShouldRenderEnd(true);
    } else {
      setShouldRenderEnd(false);
    }
  }, []); // Empty dependency array to run the effect on initial render

  const handleClickEvent = () => {
    const isSession = sessionStorage.getItem('isSession'); // Try to get the variable from session storage

    if (isSession === null) {
      const newIsSession = true; // Declare 'newIsSession' with 'const'
      sessionStorage.setItem('isSession', newIsSession);
      setPopupOpen(true);
      setShowVideoPopup(true);
      setShouldRenderEnd(true);
    } else {
      sessionStorage.removeItem('isSession');
      setShouldRenderEnd(false);
      setShowVideoPopup(false);
      updateFinalScore(null);

      setSessionId(null);

      window.location.reload();
    }
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setShowVideoPopup(false);
  };

  return (
    <div className="flex justify-center items-center w-full">
      {!shouldRenderEnd && <StartSession handleClick={handleClickEvent} />}
      {shouldRenderEnd && <EndSession handleClick={handleClickEvent} />}
      {showVideoPopup && (
        <VideoPopup open={isPopupOpen} handleClose={handleClosePopup} />
      )}

      {/* <Gforce currentId={sessionId} /> */}
      <GPSAndSpeedTracker currentId={sessionId} />
    </div>
  );
};

export default Session;
