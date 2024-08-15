import { LinearProgress } from "@material-ui/core";
import React, { useState, useEffect } from "react";

const ConstantProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(progress + 1);
      if (progress >= 100) {
        setProgress(0);
      }
    }, 1000 / 22);

    return () => clearInterval(interval);
  }, []);

  return (
    <LinearProgress variant="determinate" value={progress} color="primary" />
  );
};

export default ConstantProgressBar;
