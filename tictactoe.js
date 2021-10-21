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
        rows: []
    },
    resetbtn: document.createElement('btn')
}

// inject rows and cells into board
for (let y = 0; y < 3; y++) {
    let row = document.createElement('row')
    UI.board.rows.push({
        el: row,
        cells: []
    })
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
        row.append(cell)
        UI.board.rows[y].cells.push(cell)
    }
    UI.board.el.append(row)
}

// style reset button
UI.resetbtn.innerText = 'reset'

// inject UI
container.append(UI.state, UI.board.el, UI.resetbtn)

// get value of a cell
function cell_value(x, y) { return UI.board.rows[y].cells[x].getAttribute('value') }

// check if row matches value
function row_match(y, val) { return cell_value(0, y) === cell_value(1, y) === cell_value(2, y) === val }

// check if column matches value
function col_match(x, val) { return cell_value(x, 0) == cell_value(x, 1) == cell_value(x, 2) == val }

// check if diagonals match value
function diagonal_match(val) {
    return (cell_value(0, 0) == cell_value(1, 1) == cell_value(2, 2) == val) ||
        (cell_value(0, 2) == cell_value(1, 1) == cell_value(2, 0) == val)
}

// update status message
function update_msg() { UI.state.innerText = state < 2 ? `Player ${state + 1}'s turn` : `Player ${((state + 1) % 2) + 1} won` }

// on cell click
function on_move(cell) {
    if (state < 2 && cell.getAttribute('value') == 0) {
        cell.setAttribute('value', state + 1)

        // check if row, column or diagonals match
        let won = row_match(cell.getAttribute('y'), state + 1) || col_match(cell.getAttribute('x'), state + 1) || diagonal_match(state + 1)

        state = ((state + 1) % 2) + (won ? 2 : 0)
        update_msg()
    }
}

// reset function 
UI.resetbtn.addEventListener('click', () => {
    for (let row of UI.board.rows) for (let cell of row.cells) cell.setAttribute('value', 0)
    state = 0
    update_msg()
})

// start
update_msg()