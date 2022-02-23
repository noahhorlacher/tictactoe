// container for the game
const container = document.querySelector('main')

/*
0: 1 player
1: 2 players
*/
let gamemode = 0

/*
cpu strategy
0: random
*/
let cpumode = 0

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
    resetbtn: document.createElement('btn'),
    switch: {
        el: document.createElement('switch'),
        p_vs_p: document.createElement('mode'),
        p_vs_cpu: document.createElement('mode')
    },
    cpumode: {
        label: document.createElement('label'),
        select: document.createElement('select'),
        options: {
            hard: document.createElement('option'),
            random: document.createElement('option')
        }
    }
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
UI.resetbtn.textContent = 'reset'

// setup switch
UI.switch.p_vs_cpu.className = 'active'

UI.switch.p_vs_cpu.textContent = '1 player'
UI.switch.p_vs_p.textContent = '2 players'

UI.switch.p_vs_cpu.addEventListener('click', e => switch_mode(0))
UI.switch.p_vs_p.addEventListener('click', e => switch_mode(1))

UI.switch.el.append(UI.switch.p_vs_cpu, UI.switch.p_vs_p)

// setup cpu mode selection
UI.cpumode.label.textContent = 'CPU strategy'
UI.cpumode.label.className = 'visible'
UI.cpumode.label.setAttribute('for', 'cpumode')

UI.cpumode.select.className = 'visible'
UI.cpumode.select.id = 'cpumode'

// cpu mode options
UI.cpumode.options.hard.textContent = 'Hard'
UI.cpumode.options.hard.value = 0

UI.cpumode.options.random.textContent = 'Random'
UI.cpumode.options.random.value = 1

UI.cpumode.select.append(UI.cpumode.options.hard, UI.cpumode.options.random)

// inject UI
container.append(UI.state, UI.switch.el, UI.cpumode.label, UI.cpumode.select, UI.board.el, UI.resetbtn)

// switch gamemode
function switch_mode(new_mode) {
    if (gamemode != new_mode) {
        gamemode = new_mode
        if (new_mode === 0) {
            // switch to one player
            UI.switch.p_vs_cpu.className = 'active'
            UI.switch.p_vs_p.className = ''

            // show cpu mode select
            UI.cpumode.select.className = 'visible'
            UI.cpumode.label.className = 'visible'
        } else {
            // switch to two players
            UI.switch.p_vs_cpu.className = ''
            UI.switch.p_vs_p.className = 'active'

            // hide cpu mode select
            UI.cpumode.select.className = ''
            UI.cpumode.label.className = ''
        }
        reset()
    }
}

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
    if (gamemode == 1) {
        if (state < 2) UI.state.textContent = `Player ${state + 1}'s turn`
        else if (state === 4) UI.state.textContent = `Draw`
        else UI.state.textContent = `Player ${(state % 2) + 1} won`
    } else {
        if (state < 2) UI.state.textContent = `${state === 0 ? 'Your' : 'Bots'} turn`
        else if (state === 4) UI.state.textContent = `Draw`
        else UI.state.textContent = `${state % 2 === 0 ? 'You' : 'Bot'} won`
    }
}

// on cell click
function on_move(cell) {
    if (gamemode === 1) {
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
    } else {
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

            if (state == 1) bot_move(cell)
            else update_msg()
        }
    }
}

// make a move
function bot_move(player_cell) {
    // cell to set
    let cell
    if (cpumode === 0) {
        // hard strategy
        let player_coords = {
            x: player_cell.getAttribute('x'),
            y: player_cell.getAttribute('y')
        }

        if (cell_value(1, 1) == 0) {
            // if center is empty, set center
            cell = UI.board.cells[1][1]
        } else {
            // strategy
            // get cell values as string
            let boardstate = UI.board.cells.reduce((a, b) => a + `${b.reduce((c, d) => c + `${d.getAttribute('value')}`, '')}`, '')

            // get boardstate rotated (so cols = rows)
            let boardstate_rot = ''
            for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) boardstate_rot += cell_value(x, y)

            // check for almost complete enemy rows
            let almost_complete_row = ['011', '101', '110']

            if (cell_value(0, 0) == 1 && cell_value(1, 1) == 1 && cell_value(2, 2) == 0) {
                // block diagonal
                cell = UI.board.cells[2][2]
            } else if (cell_value(0, 0) == 0 && cell_value(1, 1) == 1 && cell_value(2, 2) == 1) {
                // block diagonal
                cell = UI.board.cells[0][0]
            } else if (cell_value(2, 0) == 1 && cell_value(1, 1) == 1 && cell_value(0, 2) == 0) {
                // block diagonal
                cell = UI.board.cells[2][0]
            } else if (cell_value(2, 0) == 0 && cell_value(1, 1) == 1 && cell_value(0, 2) == 1) {
                // block diagonal
                cell = UI.board.cells[0][2]
            } else if (almost_complete_row.includes(boardstate.substring(6))) {
                // block low row
                let pattern = boardstate.substring(6)
                let idx = pattern.split('').findIndex(l => l == '0')
                cell = UI.board.cells[2][idx]
            } else if (almost_complete_row.includes(boardstate.substring(3, 6))) {
                // block middle row
                let pattern = boardstate.substring(3, 6)
                let idx = pattern.split('').findIndex(l => l == '0')
                cell = UI.board.cells[1][idx]
            } else if (almost_complete_row.includes(boardstate.substring(0, 3))) {
                // block upper row
                let pattern = boardstate.substring(0, 3)
                let idx = pattern.split('').findIndex(l => l == '0')
                cell = UI.board.cells[0][idx]
            } else if (almost_complete_row.includes(boardstate_rot.substring(6))) {
                // block right col
                let pattern = boardstate_rot.substring(6)
                let idx = pattern.split('').findIndex(l => l == '0')
                cell = UI.board.cells[idx][2]
            } else if (almost_complete_row.includes(boardstate_rot.substring(3, 6))) {
                // block middle col
                let pattern = boardstate_rot.substring(3, 6)
                let idx = pattern.split('').findIndex(l => l == '0')
                cell = UI.board.cells[idx][1]
            } else if (almost_complete_row.includes(boardstate_rot.substring(0, 3))) {
                // block left col
                let pattern = boardstate_rot.substring(0, 3)
                let idx = pattern.split('').findIndex(l => l == '0')
                cell = UI.board.cells[idx][0]
            }
        }

        // else random cell
        if (!cell) {
            // choose random cell
            let empty_cells = document.querySelectorAll('cell[value="0"]')
            cell = empty_cells[Math.floor(Math.random() * empty_cells.length)]
        }
    } else if (cpumode === 1) {
        // choose random cell
        let empty_cells = document.querySelectorAll('cell[value="0"]')
        cell = empty_cells[Math.floor(Math.random() * empty_cells.length)]
    }

    // commence turn
    on_move(cell)
}

UI.cpumode.select.addEventListener('change', () => cpumode = parseInt(UI.cpumode.select.value))

// reset game
function reset() {
    // reset cells
    for (let row of UI.board.cells) for (let cell of row) cell.setAttribute('value', 0)

    // reset game state
    state = 0

    // reset status message
    update_msg()
}

// reset button
UI.resetbtn.addEventListener('click', reset)

// start
update_msg()