import { LinkedList, LinkedListNode, Snake } from './../../../models/LinkedList';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  board = [];
  BOARD_SIZE = 10;

  // Define a number that represents the food cell value
  foodCell: number;
  // Define a set that will conatin the ids of the cells that are part of the snake body
  snakeCells: Set<number>;
  // Define the datastructure that will keep the snake body
  snake: Snake;
  // Define a variable that will contain the current snake's movement direction
  dir: string;
  oldDir: string;

  // Define the possible movement directions
  Direction = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
  } 

  constructor() {
    this.snakeCells = new Set();
    this.oldDir = '';
  }

  ngOnInit() {
    // Create the board for the game
    this.createBoard();
    // Set the initial direction
    this.dir = this.Direction.DOWN;
    // Initialize the snake body
    this.snake = new Snake(this.getInitialSnakePosition());
    // Pick the cell at which the snake start
    this.snakeCells.add(this.snake.head.value.cell);
    // Decide the initial position of the food
    this.foodCell = this.generateFoodPosition();

    // setInterval(() => {
    //   this.moveSnake();
    // }, 1000);
  }

  getCellClass(idx: number) {    
    if (this.snakeCells.has(idx))
      return 'snake-cell'
    if (this.foodCell == idx)
      return 'food-cell';
    return '';
  }

  @HostListener('window:keydown', ['$event'])
  getDirection(event: KeyboardEvent) {
    this.oldDir = this.dir;
    if (event.code === "ArrowUp") {
      this.dir = this.Direction.UP;
    } else if (event.code === "ArrowDown") {
      this.dir = this.Direction.DOWN;
    } else if (event.code === "ArrowLeft") {
      this.dir = this.Direction.LEFT;
    } else if (event.code === "ArrowRight") {
      this.dir = this.Direction.RIGHT;
    }
  }

  private createBoard() {
    // Define a counter that will play the role of unique identifier for the cells
    let counter = 1;
    // Initialize the game board
    for (var i = 0; i < this.BOARD_SIZE; i++) {
      const currentRow = [];
      for (var j = 0; j < this.BOARD_SIZE; j++) {
        currentRow.push(counter++);
      }
      this.board.push(currentRow);
    }
  }

  public moveSnake() {
    
    const isOppositeDir = this.dir === this.getOppositeDirection(this.oldDir);
    if (isOppositeDir) {
      this.snake.reverse(); 
    }

    // First of all determine the current position of snake head
    const currPos = {
      row: this.snake.head.value.row,
      col: this.snake.head.value.col,
      cell: this.snake.head.value.cell
    };

    // Calculate the new position base on current one and the direction
    const newPosition = this.getNewPosition(currPos, this.dir);
    const newCellVal = this.board[newPosition.row][newPosition.col];

    // Check if the snake touches the boundaries
    if (this.isOutOfBoundaries(newPosition)) { this.gameOver(); return; }
    // Check if the snake eats its own tail
    if (!isOppositeDir && this.snakeCells.has(newCellVal)) { this.gameOver(); return; }

    const {row, col} = newPosition;
    const oldTail = this.snake.move({ row: row, col: col, cell: newCellVal });
    console.log("Old tail", oldTail.value.cell);

    this.snakeCells.delete(oldTail.value.cell);
    this.snakeCells.add(this.snake.head.value.cell);

    // Check if on food
    if (newCellVal == this.foodCell) {    
      // Increase the snake size
      this.growSnake();
      // Rigenerate the food
      this.foodCell = this.generateFoodPosition();
    }
  }

  private getInitialSnakePosition(): any {
    // The initial value for the snake linked list is an object
    // that contains the initial row, column and value. Row and
    // column are decided arbitrary.
    const startingRow = Math.round(this.BOARD_SIZE / 3);
    const startingCol = Math.round(this.BOARD_SIZE / 3);

    return {
      row: startingRow,
      col: startingCol,
      cell: this.board[startingRow][startingCol]
    };
  }

  private getNewPosition(currentPos: any, dir: string): any {
    if (dir === this.Direction.UP) {
      return { 
        row: currentPos.row - 1,
        col: currentPos.col
      };
    }
    
    if (dir === this.Direction.DOWN) {
      return { 
        row: currentPos.row + 1,
        col: currentPos.col
      };
    }
    
    if (dir === this.Direction.LEFT) {
      return { 
        row: currentPos.row,
        col: currentPos.col - 1
      };
    }

    if (dir === this.Direction.RIGHT) {
      return { 
        row: currentPos.row,
        col: currentPos.col + 1
      };
    }
  }

  private gameOver() { console.log("Game over!"); }

  private isOutOfBoundaries(pos: any): boolean {
    const {row, col} = pos;
    if (row < 0 || row >= this.BOARD_SIZE)
      return true;
    if (col < 0 || col >= this.BOARD_SIZE)
      return true;

    return false;
  }

  private generateFoodPosition(): number {
    // Define the max value for the random extraction
    const maxValue = this.BOARD_SIZE * this.BOARD_SIZE;
    // Extract a random number to define the food position
    while (true) {
      let val = this.randomInInterval(1, maxValue);
      if (!this.snakeCells.has(val))
        return val;
    }
  }

  private growSnake() {
    const newPos = this.getNewPosition(this.snake.tail.value, this.getOppositeDirection(this.dir)); 
    const cellVal = this.board[newPos.row][newPos.col];
    
    const {row, col} = newPos;
    this.snake.grow({ row: row, col: col, cell: cellVal });

    this.snakeCells.add(cellVal);
  }

  private getOppositeDirection(dir: string): string {
    if (dir === this.Direction.UP) return this.Direction.DOWN;
    if (dir === this.Direction.DOWN) return this.Direction.UP;
    if (dir === this.Direction.LEFT) return this.Direction.RIGHT;
    if (dir === this.Direction.RIGHT) return this.Direction.LEFT;
  }

  private randomInInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
