import React from "react";
import SessionButton from "./SessionButton";

const StartSession = ({ handleClick }) => {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-full w-auto ">
        <img
          src="/sleeping.gif"
          alt="Animated GIF Description"
          className="w-1/2 mb-5 h-60" // Add margin to the bottom
        />
        <SessionButton
          onClick={handleClick}
          text={"Start Session"}
          disabled={false}
        />
        <p className="font-dm-sans font-medium text-center text-black text-base leading-5 mt-5">
          Are you tired? Let's test it out! During the face scanning, please
          keep your hand still and look directly into the camera lens.
        </p>
      </div>
    </>
  );
};

export default StartSession;
