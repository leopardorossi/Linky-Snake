import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  board = [];
  BOARD_SIZE = 10;

  // Define a set that will conatin the ids of the cells that are part of the snake body
  snakeCells: Set<number>;

  constructor() {
    this.snakeCells = new Set();
  }

  ngOnInit() {
    // Create the board for the game
    this.createBoard();
    // Pick the cell at which the snake start
    this.snakeCells.add(40);
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

  getCellClass(idx: number) {
    return this.snakeCells.has(idx) ? 'snake-cell' : '';
  }

}
