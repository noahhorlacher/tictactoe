// container for the game
const container = document.querySelector('main')

/*
game state
0: p1 turn
1: p2 turn
2: p1 win
3: p2 win
*/
let state = 0

// create UI
let UI = {
    state: document.createElement('h1'),
    board: {
        el: document.createElement('board'),
        cells: []
    },
    resetbtn: document.createElement('btn')
}

// inject rows and cells into board
for (let y = 0; y < 3; y++) {
    let el_row = document.createElement('row')
    UI.board.cells.push([])
    for (let x = 0; x < 3; x++) {
        let cell = document.createElement('cell')

        // click handler
        cell.addEventListener('click', e => on_move(e.target))

        // start with empty cells
        cell.setAttribute('value', 0)

        // set x and y coords on cell
        cell.setAttribute('x', x)
        cell.setAttribute('y', y)

        // inject
        el_row.append(cell)
        UI.board.cells[y].push(cell)
    }
    UI.board.el.append(el_row)
}

// style reset button
UI.resetbtn.innerText = 'reset'

// inject UI
container.append(UI.state, UI.board.el, UI.resetbtn)

// get value of a cell
function cell_value(x, y) { return UI.board.cells[y][x].getAttribute('value') }

// check if row matches value
function row_match(y, val) {
    return val.toString() === cell_value(0, y) &&
        val.toString() === cell_value(1, y) &&
        val.toString() === cell_value(2, y)
}

// check if column matches value
function col_match(x, val) {
    return val.toString() === cell_value(x, 0) &&
        val.toString() === cell_value(x, 1) &&
        val.toString() === cell_value(x, 2)
}

// check if diagonals match value
function diagonal_match(val) {
    return (val.toString() === cell_value(0, 0) &&
        val.toString() === cell_value(1, 1) &&
        val.toString() === cell_value(2, 2)) ||
        (val.toString() === cell_value(0, 2) &&
            val.toString() === cell_value(1, 1) &&
            val.toString() === cell_value(2, 0))
}

// update status message
function update_msg() {
    if (state < 2) UI.state.innerText = `Player ${state + 1}'s turn`
    else if (state === 4) UI.state.innerText = `Draw`
    else UI.state.innerText = `Player ${(state % 2) + 1} won`
}

// on cell click
function on_move(cell) {
    if (state < 2 && cell.getAttribute('value') == 0) {
        cell.setAttribute('value', state + 1)

        // check if row, column or diagonals match
        let matched_row = row_match(cell.getAttribute('y'), state + 1)
        let matched_col = col_match(cell.getAttribute('x'), state + 1)
        let matched_dia = diagonal_match(state + 1)
        let won = matched_row || matched_col || matched_dia

        // determine state
        if (won) state += 2
        else if (document.querySelectorAll('cell[value="0"]').length === 0) state = 4
        else state = (state + 1) % 2

        // update status message
        update_msg()
    }
}

// reset function 
UI.resetbtn.addEventListener('click', () => {
    // reset cells
    for (let row of UI.board.cells) for (let cell of row) cell.setAttribute('value', 0)
    // reset game state
    state = 0
    // reset status message
    update_msg()
})

// start
update_msg()