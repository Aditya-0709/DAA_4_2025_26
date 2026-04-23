/* ============================================
   MAZE SOLVER VISUALIZER — SCRIPT
   DFS & BFS pathfinding with animation
   ============================================ */

// ─── State ───────────────────────────────────
const state = {
    rows: 25,
    cols: 25,
    grid: [],           // 2D array: 0=empty, 1=wall, 2=start, 3=end
    start: null,        // {row, col}
    end: null,          // {row, col}
    isDrawing: false,
    drawMode: null,     // 'wall' | 'erase' | 'moveStart' | 'moveEnd'
    isSolving: false,
    isSolved: false,
    speed: 80,
    stepCount: 0,
    startTime: 0,
};

// ─── DOM References ──────────────────────────
const gridEl = document.getElementById('grid');
const btnSolve = document.getElementById('btn-solve');
const btnReset = document.getElementById('btn-reset');
const btnGenerate = document.getElementById('btn-generate');
const algoSelect = document.getElementById('algorithm');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speed-value');
const gridSizeSlider = document.getElementById('grid-size');
const gridSizeValue = document.getElementById('grid-size-value');
const stepsCount = document.getElementById('steps-count');
const pathLength = document.getElementById('path-length');
const timeTaken = document.getElementById('time-taken');
const statusText = document.getElementById('status-text');
const noPathMsg = document.getElementById('no-path-msg');

// ─── Initialization ─────────────────────────
function init() {
    buildGrid();
    attachEventListeners();
    updateSpeedLabel();
}

// ─── Grid Construction ───────────────────────
function buildGrid() {
    const { rows, cols } = state;
    state.grid = [];
    gridEl.innerHTML = '';

    // Calculate cell size to fit the available space
    const maxSize = Math.min(600, window.innerWidth - 400);
    const cellSize = Math.max(12, Math.floor(maxSize / cols));

    gridEl.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
    gridEl.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

    for (let r = 0; r < rows; r++) {
        state.grid[r] = [];
        for (let c = 0; c < cols; c++) {
            state.grid[r][c] = 0;
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.id = `cell-${r}-${c}`;
            gridEl.appendChild(cell);
        }
    }

    // Set default start & end positions
    const startRow = Math.floor(rows / 2);
    const startCol = 2;
    const endRow = Math.floor(rows / 2);
    const endCol = cols - 3;

    state.start = { row: startRow, col: startCol };
    state.end = { row: endRow, col: endCol };
    state.grid[startRow][startCol] = 2;
    state.grid[endRow][endCol] = 3;

    getCellEl(startRow, startCol).classList.add('start');
    getCellEl(endRow, endCol).classList.add('end');

    resetStats();
    hideNoPath();
}

function getCellEl(r, c) {
    return document.getElementById(`cell-${r}-${c}`);
}

// ─── Event Listeners ─────────────────────────
function attachEventListeners() {
    // Grid mouse interactions
    gridEl.addEventListener('mousedown', onMouseDown);
    gridEl.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    gridEl.addEventListener('contextmenu', e => e.preventDefault());

    // Touch support
    gridEl.addEventListener('touchstart', onTouchStart, { passive: false });
    gridEl.addEventListener('touchmove', onTouchMove, { passive: false });
    gridEl.addEventListener('touchend', onTouchEnd);

    // Buttons
    btnSolve.addEventListener('click', solveMaze);
    btnReset.addEventListener('click', resetGrid);
    btnGenerate.addEventListener('click', generateMaze);

    // Speed slider
    speedSlider.addEventListener('input', () => {
        state.speed = parseInt(speedSlider.value);
        updateSpeedLabel();
    });

    // Grid size slider
    gridSizeSlider.addEventListener('input', () => {
        const size = parseInt(gridSizeSlider.value);
        state.rows = size;
        state.cols = size;
        gridSizeValue.textContent = `${size} × ${size}`;
    });

    gridSizeSlider.addEventListener('change', () => {
        buildGrid();
    });
}

function updateSpeedLabel() {
    const v = state.speed;
    let label = 'Medium';
    if (v <= 30) label = 'Very Fast';
    else if (v <= 60) label = 'Fast';
    else if (v <= 120) label = 'Medium';
    else if (v <= 160) label = 'Slow';
    else label = 'Very Slow';
    speedValue.textContent = label;
}

// ─── Mouse Handlers ──────────────────────────
function onMouseDown(e) {
    if (state.isSolving) return;
    const cell = e.target.closest('.cell');
    if (!cell) return;

    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);

    if (state.isSolved) clearVisualization();

    if (cell.classList.contains('start')) {
        state.drawMode = 'moveStart';
    } else if (cell.classList.contains('end')) {
        state.drawMode = 'moveEnd';
    } else if (e.button === 2) {
        // Right-click: erase
        state.drawMode = 'erase';
        eraseWall(r, c);
    } else {
        state.drawMode = 'wall';
        toggleWall(r, c);
    }

    state.isDrawing = true;
}

function onMouseMove(e) {
    if (!state.isDrawing || state.isSolving) return;
    const cell = e.target.closest('.cell');
    if (!cell) return;

    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);

    if (state.drawMode === 'wall') {
        setWall(r, c);
    } else if (state.drawMode === 'erase') {
        eraseWall(r, c);
    } else if (state.drawMode === 'moveStart') {
        moveNode('start', r, c);
    } else if (state.drawMode === 'moveEnd') {
        moveNode('end', r, c);
    }
}

function onMouseUp() {
    state.isDrawing = false;
    state.drawMode = null;
}

// ─── Touch Handlers ──────────────────────────
function onTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!cell || !cell.classList.contains('cell')) return;

    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);

    if (state.isSolved) clearVisualization();

    if (cell.classList.contains('start')) {
        state.drawMode = 'moveStart';
    } else if (cell.classList.contains('end')) {
        state.drawMode = 'moveEnd';
    } else {
        state.drawMode = 'wall';
        toggleWall(r, c);
    }
    state.isDrawing = true;
}

function onTouchMove(e) {
    e.preventDefault();
    if (!state.isDrawing || state.isSolving) return;
    const touch = e.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!cell || !cell.classList.contains('cell')) return;

    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);

    if (state.drawMode === 'wall') {
        setWall(r, c);
    } else if (state.drawMode === 'moveStart') {
        moveNode('start', r, c);
    } else if (state.drawMode === 'moveEnd') {
        moveNode('end', r, c);
    }
}

function onTouchEnd() {
    state.isDrawing = false;
    state.drawMode = null;
}

// ─── Wall Operations ─────────────────────────
function toggleWall(r, c) {
    if (isStartOrEnd(r, c)) return;
    if (state.grid[r][c] === 1) {
        state.grid[r][c] = 0;
        getCellEl(r, c).classList.remove('wall');
    } else {
        state.grid[r][c] = 1;
        getCellEl(r, c).classList.add('wall');
    }
}

function setWall(r, c) {
    if (isStartOrEnd(r, c) || state.grid[r][c] === 1) return;
    state.grid[r][c] = 1;
    getCellEl(r, c).classList.add('wall');
}

function eraseWall(r, c) {
    if (isStartOrEnd(r, c)) return;
    state.grid[r][c] = 0;
    getCellEl(r, c).classList.remove('wall');
}

function isStartOrEnd(r, c) {
    return (state.start.row === r && state.start.col === c) ||
           (state.end.row === r && state.end.col === c);
}

// ─── Move Start / End Nodes ──────────────────
function moveNode(type, r, c) {
    // Can't move onto a wall or onto the other node
    if (state.grid[r][c] === 1) return;
    if (type === 'start' && state.end.row === r && state.end.col === c) return;
    if (type === 'end' && state.start.row === r && state.start.col === c) return;

    const prev = state[type];
    if (prev.row === r && prev.col === c) return;

    // Clear old position
    getCellEl(prev.row, prev.col).classList.remove(type);
    state.grid[prev.row][prev.col] = 0;

    // Set new position
    state[type] = { row: r, col: c };
    state.grid[r][c] = type === 'start' ? 2 : 3;
    getCellEl(r, c).classList.add(type);
}

// ─── Solve Maze ──────────────────────────────
async function solveMaze() {
    if (state.isSolving) return;

    clearVisualization();
    hideNoPath();

    state.isSolving = true;
    state.isSolved = false;
    state.stepCount = 0;
    state.startTime = performance.now();

    setUILocked(true);
    setStatus('Running...', 'status-running');

    const algo = algoSelect.value;
    let result;

    if (algo === 'dfs') {
        result = await solveDFS();
    } else {
        result = await solveBFS();
    }

    const elapsed = (performance.now() - state.startTime).toFixed(1);
    timeTaken.textContent = `${elapsed} ms`;

    if (result && result.length > 0) {
        await animatePath(result);
        pathLength.textContent = result.length;
        setStatus('Solved ✓', 'status-done');
    } else {
        showNoPath();
        setStatus('No Path', 'status-failed');
    }

    state.isSolving = false;
    state.isSolved = true;
    setUILocked(false);
}

// ─── DFS Algorithm ───────────────────────────
async function solveDFS() {
    const { rows, cols, start, end, grid } = state;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const stack = [start];
    visited[start.row][start.col] = true;
    let found = false;

    while (stack.length > 0) {
        const current = stack.pop();
        const { row, col } = current;

        state.stepCount++;
        stepsCount.textContent = state.stepCount;

        // Visualize visited
        if (!(row === start.row && col === start.col) &&
            !(row === end.row && col === end.col)) {
            getCellEl(row, col).classList.add('visited');
        }

        if (row === end.row && col === end.col) {
            found = true;
            break;
        }

        await sleep(state.speed);

        // Shuffle directions for more interesting paths
        const shuffled = [...directions].sort(() => Math.random() - 0.5);

        for (const [dr, dc] of shuffled) {
            const nr = row + dr;
            const nc = col + dc;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                !visited[nr][nc] && grid[nr][nc] !== 1) {
                visited[nr][nc] = true;
                parent[nr][nc] = { row, col };
                stack.push({ row: nr, col: nc });
            }
        }
    }

    if (!found) return null;

    // Reconstruct path
    return reconstructPath(parent, start, end);
}

// ─── BFS Algorithm ───────────────────────────
async function solveBFS() {
    const { rows, cols, start, end, grid } = state;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const queue = [start];
    visited[start.row][start.col] = true;
    let found = false;

    while (queue.length > 0) {
        const current = queue.shift();
        const { row, col } = current;

        state.stepCount++;
        stepsCount.textContent = state.stepCount;

        // Visualize visited
        if (!(row === start.row && col === start.col) &&
            !(row === end.row && col === end.col)) {
            getCellEl(row, col).classList.add('visited');
        }

        if (row === end.row && col === end.col) {
            found = true;
            break;
        }

        await sleep(state.speed);

        for (const [dr, dc] of directions) {
            const nr = row + dr;
            const nc = col + dc;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                !visited[nr][nc] && grid[nr][nc] !== 1) {
                visited[nr][nc] = true;
                parent[nr][nc] = { row, col };
                queue.push({ row: nr, col: nc });
            }
        }
    }

    if (!found) return null;

    return reconstructPath(parent, start, end);
}

// ─── Path Reconstruction ─────────────────────
function reconstructPath(parent, start, end) {
    const path = [];
    let curr = end;

    while (curr && !(curr.row === start.row && curr.col === start.col)) {
        path.push(curr);
        curr = parent[curr.row][curr.col];
    }

    if (!curr) return null;
    path.push(start);
    return path.reverse();
}

// ─── Path Animation ──────────────────────────
async function animatePath(path) {
    for (let i = 0; i < path.length; i++) {
        const { row, col } = path[i];
        if (!isStartOrEnd(row, col)) {
            const el = getCellEl(row, col);
            el.classList.remove('visited');
            el.classList.add('path');
        }
        await sleep(Math.max(20, state.speed / 2));
    }
}

// ─── Maze Generation (Recursive Backtracker) ─
async function generateMaze() {
    if (state.isSolving) return;

    setUILocked(true);
    setStatus('Generating...', 'status-running');
    clearVisualization();
    hideNoPath();

    const { rows, cols } = state;

    // Fill everything with walls
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!isStartOrEnd(r, c)) {
                state.grid[r][c] = 1;
                getCellEl(r, c).classList.add('wall');
            }
        }
    }

    // Recursive backtracker on odd-indexed cells
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const directions = [[-2, 0], [2, 0], [0, -2], [0, 2]];

    // Start carving from (1,1)
    const startR = 1;
    const startC = 1;

    function isValid(r, c) {
        return r > 0 && r < rows - 1 && c > 0 && c < cols - 1;
    }

    function carve(r, c) {
        state.grid[r][c] = 0;
        getCellEl(r, c).classList.remove('wall');
    }

    // Iterative DFS for maze generation to avoid stack overflow
    const stack = [{ row: startR, col: startC }];
    visited[startR][startC] = true;
    carve(startR, startC);

    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        const { row, col } = current;

        // Find unvisited neighbors
        const neighbors = [];
        for (const [dr, dc] of directions) {
            const nr = row + dr;
            const nc = col + dc;
            if (isValid(nr, nc) && !visited[nr][nc]) {
                neighbors.push({ row: nr, col: nc, wallRow: row + dr / 2, wallCol: col + dc / 2 });
            }
        }

        if (neighbors.length === 0) {
            stack.pop();
            continue;
        }

        // Pick random neighbor
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        visited[next.row][next.col] = true;

        // Carve passage
        carve(next.wallRow, next.wallCol);
        carve(next.row, next.col);

        stack.push({ row: next.row, col: next.col });
    }

    // Ensure start and end are on open cells
    ensureNodeAccessible('start');
    ensureNodeAccessible('end');

    resetStats();
    setStatus('Idle', 'status-idle');
    setUILocked(false);
}

function ensureNodeAccessible(type) {
    const node = state[type];
    // Clear the node cell and adjacent cells
    state.grid[node.row][node.col] = type === 'start' ? 2 : 3;
    getCellEl(node.row, node.col).classList.remove('wall');

    const { rows, cols } = state;
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    // Ensure at least one adjacent cell is open
    let hasOpen = false;
    for (const [dr, dc] of dirs) {
        const nr = node.row + dr;
        const nc = node.col + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && state.grid[nr][nc] !== 1) {
            hasOpen = true;
            break;
        }
    }
    if (!hasOpen) {
        // Open a random adjacent cell
        const valid = dirs.filter(([dr, dc]) => {
            const nr = node.row + dr;
            const nc = node.col + dc;
            return nr >= 0 && nr < rows && nc >= 0 && nc < cols;
        });
        if (valid.length > 0) {
            const [dr, dc] = valid[Math.floor(Math.random() * valid.length)];
            const nr = node.row + dr;
            const nc = node.col + dc;
            state.grid[nr][nc] = 0;
            getCellEl(nr, nc).classList.remove('wall');
        }
    }
}

// ─── Clear & Reset ───────────────────────────
function clearVisualization() {
    const { rows, cols } = state;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const el = getCellEl(r, c);
            el.classList.remove('visited', 'path', 'current');
        }
    }
    state.isSolved = false;
    hideNoPath();
}

function resetGrid() {
    if (state.isSolving) return;
    buildGrid();
    setStatus('Idle', 'status-idle');
}

function resetStats() {
    stepsCount.textContent = '0';
    pathLength.textContent = '0';
    timeTaken.textContent = '0 ms';
    state.stepCount = 0;
}

// ─── UI Helpers ──────────────────────────────
function setUILocked(locked) {
    btnSolve.disabled = locked;
    btnReset.disabled = locked;
    btnGenerate.disabled = locked;
    algoSelect.disabled = locked;
    gridSizeSlider.disabled = locked;
}

function setStatus(text, className) {
    statusText.textContent = text;
    statusText.className = 'stat-value ' + className;
}

function showNoPath() {
    noPathMsg.classList.remove('hidden');
}

function hideNoPath() {
    noPathMsg.classList.add('hidden');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Start ───────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
