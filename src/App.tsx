import { useState, useEffect, useCallback } from "react";
import GameBoard from "./components/GameBoard";
import { Direction, Coordinate } from "./types";
import "./App.css";

function App() {
  const BOARD_SIZE = 15;
  const INITIAL_SNAKE = [{ x: 7, y: 7 }];
  const INITIAL_FOOD = { x: 5, y: 5 };
  const GAME_SPEED = 170; // milliseconds between moves

  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Coordinate>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Generate new food at a random position not occupied by the snake
  const generateFood = useCallback(() => {
    let newFood: Coordinate;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (
      snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
    );
    return newFood;
  }, [snake, BOARD_SIZE]);

  // Handle keyboard input for changing direction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;

      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        case " ": // Space bar to pause/resume
          setIsPaused((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, isGameOver, isPaused]);

  // Main game loop
  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        // Move head in current direction
        switch (direction) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
        }

        // Check for collisions with walls
        if (
          head.x < 0 ||
          head.x >= BOARD_SIZE ||
          head.y < 0 ||
          head.y >= BOARD_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check for collisions with self (except the tail which will move)
        if (
          prevSnake.slice(0, -1).some(
            (segment) => segment.x === head.x && segment.y === head.y
          )
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Create new snake body
        const newSnake = [head, ...prevSnake];

        // If the head is on food, generate new food
        // Otherwise, remove the tail
        if (head.x === food.x && head.y === food.y) {
          setFood(generateFood());
          setScore((prev) => prev + 1);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [food, direction, isGameOver, generateFood, isPaused, BOARD_SIZE, GAME_SPEED]);

  // Reset game
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection("RIGHT");
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>Snake Game</h1>
        <div className="author-info">
          <p>Made by Sarthak | <a href="https://github.com/sarthakology" target="_blank" rel="noopener noreferrer">GitHub</a></p>
        </div>
      </header>
      <div className="score">Score: {score}</div>
      <GameBoard
        snake={snake}
        food={food}
        boardSize={BOARD_SIZE}
      />
      {isGameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
      {!isGameOver && (
        <button onClick={() => setIsPaused(!isPaused)} className="pause-button">
          {isPaused ? "Resume" : "Pause"}
        </button>
      )}
      <div className="instructions">
        <p>Use arrow keys to control the snake.</p>
        <p>Press space to pause/resume.</p>
      </div>
    </div>
  );
}

export default App;
