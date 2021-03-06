// @flow

// not using these atm
const nineDirections = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
]

const directions = [[0, -1], [-1, 0], [1, 0], [0, 1]]

const diagonals = [[-1, -1], [1, -1], [-1, 1], [1, 1]]

type LPath = [[number, number], ?LPath]

const next = (board, letters, i, x, y): ?LPath => {
  if (i >= letters.length) return null
  const dirsLeft = directions.filter(d => !board[`${x + d[0]},${y + d[1]}`])
  while (dirsLeft.length) {
    const d = dirsLeft.splice(parseInt(Math.random() * dirsLeft.length), 1)[0]
    const ax = x + d[0]
    const ay = y + d[1]
    board[`${ax},${ay}`] = letters[i]
    const tail = next(board, letters, i + 1, ax, ay)
    if (tail) {
      return [[ax, ay], tail]
    }
    board[`${ax},${ay}`] = null
  }
  return null
}

const letters = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase()
const randLetter = () => {
  return letters[parseInt(Math.random() * letters.length)]
}

const allowedRandomLetter = (x, y, board) => {
  const disallowed = []
  diagonals.forEach(([dx, dy]) => {
    const pos = `${x + dx},${y + dy}`
    if (board[pos]) disallowed.push(board[pos])
  })
  let letter = randLetter()
  while (disallowed.indexOf(letter) !== -1) {
    letter = randLetter()
  }
  return letter
}

const toMatrix = (board, llpath) => {
  const path = [[0, 0]]
  let minx = 0
  let miny = 0
  let maxx = 0
  let maxy = 0
  while (llpath && llpath.length) {
    const [x, y] = llpath[0]
    path.push([x, y])
    if (x < minx) minx = x
    if (x > maxx) maxx = x
    if (y < miny) miny = y
    if (y > maxy) maxy = y
    llpath = llpath[1]
  }
  let matrix = []
  for (let x = minx; x < maxx + 1; x++) {
    const row = []
    matrix.push(row)
    for (let y = miny; y < maxy + 1; y++) {
      const pos = `${x},${y}`
      if (board[pos]) row.push(board[pos])
      else {
        row.push(allowedRandomLetter(x, y, board))
      }
    }
  }
  return {matrix, path: path.map(([x, y]) => [x - minx, y - miny])}
}

export default (letters: string[]) => {
  let x = 0
  let y = 0
  const board: {[pos: string]: ?string} = {'0,0': letters[0]}
  const path = next(board, letters, 1, 0, 0)
  return toMatrix(board, path)
}
