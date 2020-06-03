import { chunk, union, uniq, intersection } from 'lodash';

class Cell {
	constructor(public value: number | null) {}

	getValue() {
		return this.value;
	}
}

class Board {
	private size: number;
	cells: Array<{ cell: Cell; row: number; column: number }> = [];

	constructor(board: Array<number | null>) {
		this.size = Math.sqrt(board.length);

		const rows = chunk(board, this.size);

		this.cells = rows.flatMap((cols, rowIndex) => {
			return cols.map((value, colIndex) => ({
				cell: new Cell(value),
				row: rowIndex + 1,
				column: colIndex + 1,
			}));
		});
	}

	getRow(rowIndex: number) {
		return this.cells.filter((cell) => cell.row === rowIndex);
	}

	getColumn(colIndex: number) {
		return this.cells.filter((cell) => cell.column === colIndex);
	}

	printBoard() {
		const divider = new Array(this.size * 3 + 1).fill('_').join('') + '\n';
		let toPrint = divider;

		for (let row = 1; row <= this.getSize(); row++) {
			toPrint +=
				this.getRow(row)
					.map((item) => item.cell.getValue() || ' ')
					.join(' | ') + '\n';
		}

		toPrint += divider;

		console.log(toPrint);
	}

	getCell(rowIndex: number, colIndex: number) {
		return this.cells.find(
			(cellItem) => cellItem.column === colIndex && cellItem.row === rowIndex,
		)!;
	}

	getSize() {
		return this.size;
	}

	fill(row: number, column: number, value: number) {
		this.getCell(row, column).cell.value = value;
	}
}

type PossibilitiesDict = { [key: string]: boolean };

class PossibilitiesChecker {
	constructor(private board: Board) {}

	private createPossibilitiesDict() {
		let possibilites: PossibilitiesDict = {};

		for (let i = 1; i <= this.board.getSize(); i++) {
			possibilites[i] = true;
		}

		return possibilites;
	}

	private getPossibleValuesFromPossibilities(possibilities: PossibilitiesDict): number[] {
		return Object.entries(possibilities)
			.filter(([value, possible]) => possible)
			.map(([value]) => parseInt(value, 10));
	}

	private getAvailableValuesInRow(rowIndex: number): PossibilitiesDict {
		const row = this.board.getRow(rowIndex);
		const valuesInRow = row.map((item) => item.cell.getValue());

		let possibilities = this.createPossibilitiesDict();

		valuesInRow.forEach((value) => {
			if (value) {
				possibilities[value] = false;
			}
		});

		return possibilities;
	}

	private getAvailableValuesInColumn(colIndex: number): PossibilitiesDict {
		const col = this.board.getColumn(colIndex);
		const valuesInCol = col.map((item) => item.cell.getValue());

		let possibilities = this.createPossibilitiesDict();

		valuesInCol.forEach((value) => {
			if (value) {
				possibilities[value] = false;
			}
		});

		return possibilities;
	}

	uniqueInSquareStrategy(): PossibilitiesDict {
		let possibilities = this.createPossibilitiesDict();

		return possibilities;
	}

	checkPossibilities(x: number, y: number): number[] | null {
		const cell = this.board.getCell(x, y);
		const cellValue = cell.cell.getValue();

		if (cellValue) {
			return null;
		}

		let possibilites = this.createPossibilitiesDict();

		if (cellValue) {
			possibilites[cellValue] = false;
		}

		const rowPossibilites = this.getAvailableValuesInRow(cell.row);
		const columnPossibilities = this.getAvailableValuesInColumn(cell.column);

		const result = intersection(
			this.getPossibleValuesFromPossibilities(rowPossibilites),
			this.getPossibleValuesFromPossibilities(columnPossibilities),
			this.getPossibleValuesFromPossibilities(possibilites),
		);

		return result;
	}
}

const board = new Board([3, 2, 1, null, 1, 3, null, 3, null]);

const possibilitiesChecker = new PossibilitiesChecker(board);
