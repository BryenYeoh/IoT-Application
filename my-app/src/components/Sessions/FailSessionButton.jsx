import React from 'react';

const FailSessionButton = ({ text, onClick, disabled }) => {
  return (
    <button
      className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded w-80"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default FailSessionButton;
