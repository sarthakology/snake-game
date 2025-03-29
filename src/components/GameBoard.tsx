import { Coordinate } from "../types";

interface GameBoardProps {
  snake: Coordinate[];
  food: Coordinate;
  boardSize: number;
}

const GameBoard = ({ snake, food, boardSize }: GameBoardProps) => {
  // Create a 2D grid of cells representing the game board
  const renderBoard = () => {
    const cells = [];

    for (let y = 0; y < boardSize; y++) {
      const row = [];
      for (let x = 0; x < boardSize; x++) {
        // Determine if this cell is part of the snake
        const isSnakeHead = snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);

        // Determine if this cell is the food
        const isFood = food.x === x && food.y === y;

        // Set the cell class based on its content
        let cellClass = "cell";
        if (isSnakeHead) cellClass += " snake-head";
        if (isSnakeBody) cellClass += " snake-body";
        if (isFood) cellClass += " food";

        row.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
            style={{
              gridRow: y + 1,
              gridColumn: x + 1
            }}
          />
        );
      }
      cells.push(...row);
    }

    return cells;
  };

  return (
    <div
      className="game-board"
      style={{
        gridTemplateRows: `repeat(${boardSize}, 1fr)`,
        gridTemplateColumns: `repeat(${boardSize}, 1fr)`
      }}
    >
      {renderBoard()}
    </div>
  );
};

export default GameBoard;
