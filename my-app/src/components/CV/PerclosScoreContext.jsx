import { createContext, useContext, useState } from "react";

export const PerclosScoreContext = createContext();

export const usePERCLOSScore = () => {
  return useContext(PerclosScoreContext);
};

export const PerclosScoreProvider = ({ children }) => {
  const [finalScore, setFinalScore] = useState(null);

  const updateFinalScore = (score) => {
    setFinalScore(score);
  };

  return (
    <PerclosScoreContext.Provider value={{ finalScore, updateFinalScore }}>
      {children}
    </PerclosScoreContext.Provider>
  );
};
