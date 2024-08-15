import React from 'react';
import SessionButton from './SessionButton';

const EndSession = ({ handleClick }) => {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-full w-auto ">
        <img
          src="/pusheen-running.gif"
          alt="Animated GIF Description"
          className="w-1/2 mb-5 h-60" // Add margin to the bottom
        />
        <SessionButton
          onClick={handleClick}
          text={'End Session'}
          disabled={false}
        />
        <p className="font-dm-sans font-medium text-center text-black text-base leading-5 mt-5">
          Session ongoing....
          <br />
          Ready to end? Click End Session to tabulate your scores!
        </p>
      </div>
    </>
  );
};

export default EndSession;
