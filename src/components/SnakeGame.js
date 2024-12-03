import React, { useState, useEffect } from 'react';
import './SnakeGame.css';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [[0, 0]];
const INITIAL_FOOD = [10, 10];

function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(200);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': 
          if (direction !== 'DOWN') setDirection('UP'); 
          break;
        case 'ArrowDown': 
          if (direction !== 'UP') setDirection('DOWN'); 
          break;
        case 'ArrowLeft': 
          if (direction !== 'RIGHT') setDirection('LEFT'); 
          break;
        case 'ArrowRight': 
          if (direction !== 'LEFT') setDirection('RIGHT'); 
          break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = [...newSnake[0]];

      switch (direction) {
        case 'UP': head[1] -= 1; break;
        case 'DOWN': head[1] += 1; break;
        case 'LEFT': head[0] -= 1; break;
        case 'RIGHT': head[0] += 1; break;
        default: break;
      }

      // Check collision with walls
      if (
        head[0] < 0 || head[0] >= GRID_SIZE ||
        head[1] < 0 || head[1] >= GRID_SIZE
      ) {
        setGameOver(true);
        return;
      }

      // Check self collision
      if (newSnake.some(segment => 
        segment[0] === head[0] && segment[1] === head[1]
      )) {
        setGameOver(true);
        return;
      }

      // Check food consumption
      if (head[0] === food[0] && head[1] === food[1]) {
        setScore(score + 1);
        generateFood();
      } else {
        newSnake.pop();
      }

      newSnake.unshift(head);
      setSnake(newSnake);
    };

    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [snake, direction, food, speed, gameOver]);

  const generateFood = () => {
    const newFood = [
      Math.floor(Math.random() * GRID_SIZE),
      Math.floor(Math.random() * GRID_SIZE)
    ];
    setFood(newFood);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="snake-game">
      <h1>Snake Game</h1>
      {gameOver ? (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your Score: {score}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        <div>
          <div className="score">Score: {score}</div>
          <div 
            className="game-board" 
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`
            }}
          >
            {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              
              const isSnake = snake.some(
                segment => segment[0] === x && segment[1] === y
              );
              const isFood = food[0] === x && food[1] === y;

              return (
                <div 
                  key={index} 
                  className={`grid-cell 
                    ${isSnake ? 'snake' : ''} 
                    ${isFood ? 'food' : ''}
                  `}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default SnakeGame;
