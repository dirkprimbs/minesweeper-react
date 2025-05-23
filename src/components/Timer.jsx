import React, { useState, useEffect } from 'react';

const Timer = ({ running, onReset }) => {
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    let interval = null;
    
    if (running) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (!running && time !== 0) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [running, time]);
  
  useEffect(() => {
    if (onReset) {
      setTime(0);
    }
  }, [onReset]);
  
  // Format time as minutes:seconds
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  return (
    <div className="timer" style={{ 
      fontSize: '18px', 
      fontWeight: 'bold',
      padding: '5px 10px',
      backgroundColor: '#000',
      color: '#f00',
      borderRadius: '3px',
      fontFamily: 'monospace'
    }}>
      {formattedTime}
    </div>
  );
};

export default Timer; 