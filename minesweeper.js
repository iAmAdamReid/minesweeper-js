
class Cell{
    constructor(column, row, mined = false, flagged = false, selected = false, neighborMines){
        this.id = column + "" + row; // e.g. x2y5 or x7y3
        this.column = column;
        this.row = row;
        this.mined = mined;
        this.flagged = flagged;
        this.selected = selected;
        this.neighborMines = neighborMines;
    }
}

class Board{
    constructor(size, mineCount){
        if(size > 10){
            // only allow boards that can span the 0 - 9
            throw error;
        }

        this.board = {};
        this.size = size;
        this.mineCount = mineCount;
    }

    initialize(){
        this.generateTiles();
    }

    generateTiles(){
        for(let column = 0; column < this.size; column++){
            for(let row = 0; row < this.size; row++){
                let newCell = new Cell(column, row, false, false, false, 0);
                this.board[column + "" + row] = newCell;
            }
        }
        // populate with mines
        this.populateMines();
    }

    populateMines(){
        let mineCoords = [];
        let cellId = '';
        
        for(let i = 0; i < this.mineCount; i++){
            let colCoords = this.getRandomInteger(0, this.size);
            let rowCoords = this.getRandomInteger(0, this.size);
           

            cellId = colCoords + "" + rowCoords;

            // if cell is already mined, get coords again
            while(mineCoords.includes(cellId)){
                let colCoords = this.getRandomInteger(0, this.size);
                let rowCoords = this.getRandomInteger(0, this.size);
                cellId = colCoords + "" + rowCoords;
            }

            mineCoords.push(cellId);

            this.board[cellId].mined = true;
        }
        this.calculateNeighbors(board);
    }

    calculateNeighbors(){
        let cell;
        let neighborMines = 0;
        for(let row = 0; row < this.size; row++){
            for(let col = 0; col < this.size; col++){
                let id = col + "" + row;
                cell = this.board[id];
                if(!cell.mined){
                    let neighbors = this.getNeighbors(id);
                    neighborMines = 0;
                    for(let i = 0; i < neighbors.length; i++){
                        neighborMines += this.isMined(this.board, neighbors[i]);
                    }
                    cell.neighborMines = neighborMines;
                }
            }
        }
        return;
    }

    getNeighbors(id){
        let row = parseInt(id[0]);
        let column = parseInt(id[1]);
        let neighbors = [];

        neighbors.push((row - 1) + "" + (column - 1));
        neighbors.push( (row - 1) + "" + column);
        neighbors.push( (row - 1) + "" + (column + 1))
        neighbors.push(row + "" + (column - 1));
        neighbors.push(row + "" + (column + 1));
        neighbors.push( (row + 1) + "" + (column - 1));
        neighbors.push( (row + 1) + "" + column);
        neighbors.push( (row + 1) + "" + (column + 1));

        for(let i = 0; i < neighbors.length; i++){
            if(neighbors[i].length > 2){
                neighbors.splice(i, 1);
                i--;
            }
        }

        return neighbors;
    }

    isMined(board, row, column){
        let cell = board[row + "" + column];
        let mined = 0;
        if(typeof cell !== 'undefined'){
            mined = cell.mined ? 1 : 0;
        }
        return mined;
    }

    getRandomInteger(min, max){
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

class Game{
    constructor(board, status = 0){
        this.board = board.board;
        this.size = board.size;
        this.status = status;

        // status: 0 = playing, 1 = win, 2 = loss
    }

    displayBoard(){
        // show X axis
        let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        for(let i = 0; i < this.size; i++){
            // space on first
            if(i === 0){
                process.stdout.write(`  `);
            }
            // newline on last letter
            if(i === (this.size - 1)){
                process.stdout.write(`${alphabet[i]}\n`)
            }

            if(i < this.size - 1){
                process.stdout.write(`${alphabet[i]} `);
            }
        }

        // display board with Y axis
        for(let row = 0; row < this.size; row++){
            for(let col = 0; col < this.size; col++){
                if(col === 0){
                    process.stdout.write(`${row} `);
                }

                // newline at end of row
                if(col === this.size - 1){
                    let tile = this.displayTile(this.board[col + "" + row]);
                    process.stdout.write(`${tile}\n`)
                }

                if(col < this.size - 1){
                    let tile = this.displayTile(this.board[col + "" + row]);
                    process.stdout.write(`${tile}`);
                }
            }
        }
    }

    displayTile(cell){
        if(cell.selected){
            return `O `;
        }  else if(cell.flagged){
            return `^ `
        } else {
            return `_ `
        }
    }
}

let board = new Board(8, 2);
board.initialize();
let game = new Game(board);

game.displayBoard();