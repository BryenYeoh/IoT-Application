import React, { useState, useEffect } from 'react';
// import { useHistory } from "react-router-dom";
import FailSessionButton from '../Sessions/FailSessionButton';
import { usePERCLOSScore } from '../CV/PerclosScoreContext';
import { useNavigate } from 'react-router-dom';

const FailSession = ({ handleClick }) => {
  const { updateFinalScore } = usePERCLOSScore();
  // const history = useHistory();
  const navigate = useNavigate();
  const [redirectTimer, setRedirectTimer] = useState(10); // Set the timer duration in seconds

  // Function to decrement the timer
  const decrementTimer = () => {
    if (redirectTimer > 0) {
      setRedirectTimer(redirectTimer - 1);
    }
  };

  useEffect(() => {
    if (redirectTimer == 0) {
      updateFinalScore(null);

      navigate('/session');
    } else {
      const timerInterval = setInterval(decrementTimer, 1000);

      return () => {
        clearInterval(timerInterval);
      };
    }
  }, [redirectTimer]);

  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col justify-center items-center h-full w-auto">
        <img
          src="/sleeping.gif"
          alt="Animated GIF Description"
          className="w-1/2 mb-5 h-60"
        />
        <FailSessionButton
          onClick={handleClick}
          text={'Failed Session'}
          disabled={true}
        />
        <p className="font-dm-sans font-medium text-center text-black text-base leading-5 mt-5">
          You are deemed unsafe to ride further. Please take a break and come
          back later!
        </p>
        <p className="text-center text-red-500">
          Redirecting in {redirectTimer} seconds...
        </p>
      </div>
    </div>
  );
};

export default FailSession;
