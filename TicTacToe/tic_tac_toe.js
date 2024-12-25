class Game {
  #players;
  #board;
  #current_turn = 0;
  #markers;
  #game_finished = false;
  #markers_placed = 0;

  constructor({
    players = ["player1", "player2"],
    board_size = 3,
    markers = ["x", "y"],
  }) {
    this.#players = players;
    this.#markers = markers;
    if (players.length != 2 || markers.length != 2)
      throw new Error("Invalid number of players or markers");
    this.#board = new Board(board_size, markers);
  }

  mark(x, y) {
    if (this.#game_finished) throw new Error("Game is already finished");

    const board_size = this.#board.get_board_size();
    let mark_result = this.#board.mark(this.#markers[this.#current_turn], x, y);

    if (mark_result) {
      console.log(this.#players[this.#current_turn], "won");
      this.#game_finished = true;
    } else {
      this.#markers_placed++;
      this.#current_turn = (this.#current_turn + 1) % this.#markers.length;
    }
    if (this.#markers_placed == (board_size * board_size)) {
        console.log("It's a draw");
        this.#game_finished = true;
    }
  }
}

class Board {
  #board_state = [];
  #board_size;
  #row_count;
  #column_count;
  #diagonal_count;

  constructor(size, markers = []) {
    let counts = {};
    for (let i = 0; i < markers.length; i++) {
      counts[markers[i]] = 0;
    }

    this.#board_size = size;
    this.#row_count = [];
    this.#column_count = [];
    this.#diagonal_count = [{ ...counts }, { ...counts }];
    this.#board_state = [];

    for (let i = 0; i < size; i++) {
      let row = [];
      this.#row_count.push({ ...counts });
      this.#column_count.push({ ...counts });
      for (let j = 0; j < size; j++) {
        row.push("");
      }
      this.#board_state.push(row);
    }
  }

  mark(marker, x, y) {
    if (x >= this.#board_size || y >= this.#board_size) throw new Error("Cordinates out of bound");
    if (this.#board_state[x][y] != "") throw new Error("Square already marked");

    this.#board_state[x][y] = marker;

    this.#row_count[x][marker]++;
    this.#column_count[y][marker]++;

    if (x == y) this.#diagonal_count[0][marker]++;
    if (x + y == this.#board_size - 1) this.#diagonal_count[1][marker]++;

    if (
      this.#row_count[x][marker] == this.#board_size ||
      this.#column_count[y][marker] == this.#board_size ||
      this.#diagonal_count[0][marker] == this.#board_size ||
      this.#diagonal_count[1][marker] == this.#board_size
    )
      return true;

    return false;
  }

  get_board_state() {
    return this.#board_state;
  }

  get_board_size() {
    return this.#board_size;
  }
}

const g = new Game({ players: ["Kashif", "Mahmood"], board_size: 3 });
g.mark(0, 0);
g.mark(1, 1);
g.mark(1, 0);
g.mark(2, 0);
g.mark(0, 2);
g.mark(0, 1);
g.mark(2, 1);
g.mark(1, 2);
g.mark(2, 2);
