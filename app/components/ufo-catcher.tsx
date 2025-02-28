import React, { useState, useEffect, useRef } from 'react';

const UFOCatcher = () => {
  const [clawPosition, setClawPosition] = useState({ x: 50, y: 0 });
  const [isDropping, setIsDropping] = useState(false);
  const [prize, setPrize] = useState(null);
  const gameAreaRef = useRef(null);

  const handleKeyPress = (e) => {
    if (isDropping) return;

    switch (e.key) {
      case 'ArrowLeft':
        setClawPosition((prev) => ({ ...prev, x: Math.max(prev.x - 5, 0) }));
        break;
      case 'ArrowRight':
        setClawPosition((prev) => ({ ...prev, x: Math.min(prev.x + 5, 100) }));
        break;
      case 'ArrowDown':
        setIsDropping(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isDropping) {
      const dropInterval = setInterval(() => {
        setClawPosition((prev) => {
          if (prev.y >= 100) {
            clearInterval(dropInterval);
            setIsDropping(false);
            checkForPrize();
            return { ...prev, y: 0 };
          }
          return { ...prev, y: prev.y + 5 };
        });
      }, 100);
    }
  }, [isDropping]);

  const checkForPrize = () => {
    const gameArea = gameAreaRef.current;
    const claw = gameArea.querySelector('.claw');
    const prizes = gameArea.querySelectorAll('.prize');

    prizes.forEach((prize) => {
      const prizeRect = prize.getBoundingClientRect();
      const clawRect = claw.getBoundingClientRect();

      if (
        clawRect.x < prizeRect.x + prizeRect.width &&
        clawRect.x + clawRect.width > prizeRect.x &&
        clawRect.y < prizeRect.y + prizeRect.height &&
        clawRect.y + clawRect.height > prizeRect.y
      ) {
        setPrize(prize.dataset.name);
      }
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isDropping]);

  return (
    <div ref={gameAreaRef} className="game-area">
      <div
        className="claw"
        style={{ left: `${clawPosition.x}%`, top: `${clawPosition.y}%` }}
      />
      <div className="prize" data-name="Teddy Bear" style={{ left: '30%', top: '80%' }} />
      <div className="prize" data-name="Toy Car" style={{ left: '70%', top: '80%' }} />
      {prize && <div className="prize-message">You won a {prize}!</div>}
    </div>
  );
};

export default UFOCatcher;
