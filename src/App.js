import { useState } from "react";
/*
function SquareOld({ value, onSquareClick }) {
  // const [value, setValue] = useState(null);
  function handleClick() {
    console.log("hai cliccato");
    setValue("X");
  }

  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
  */
function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{ backgroundColor: highlight ? "lightgreen" : "white" }}//colore quadrato
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  // squares=variabile di stato --- un array con 9 elementi inizializzati a null
  // const [squares, setSquares] = useState(Array(9).fill(null));
  //const [xIsNext, setXisNext] = useState(true);
  // controllo se il giocatore ha vinto altrimenti prossima mossa avversario
  //const winnerOld = calculateWinner(squares);
  const { winner, line } = calculateWinner(squares);
  let status;
  let winnerImg = null;
  if (winner) {
    status = "Winner: " + winner;
    winnerImg = (
    <img
      src="/nelson.png"
      alt="Hai perso!"
      style={{ width: "150px", marginTop: "20px" }}
    />
  ); //se tutti i quadrati sono diversi da null ce stato un pareggio
  }  else if (!squares.includes(null)) {
  status = "Pareggio!";
} else {
  status = "Next player: " + (xIsNext ? "X" : "O");
}

  function handleClick(i) {
   // if (squares[i] || calculateWinner(squares)) {
      if (squares[i] || winner) {
      console.log("posizione già giocata oppure hai vinto");
      return;
    }
    // copia dell'array con metodo .slice
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "0";
    }
    //react con setSquares cambia lo stato del componente Board poiche handleClick è all'interno di Board
    // aggiorno il board principale con il nuovo stato
    // setSquares(nextSquares);
    // setXisNext(!xIsNext);
    onPlay(nextSquares); // invia il tabellone al genitore (Game); è Game che aggiorna lo stato non board
  }
  /* 
  () => handleClick(0)una funzione freccia, che rappresenta un modo più breve per definire le funzioni.
   Quando si clicca sul quadrato, il codice dopo la =>"freccia" verrà eseguito, chiamando handleClick(0).
   */
  return (
    <>
      <div className="status">{status}</div>
      {winnerImg}
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}  highlight={line.includes(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}  highlight={line.includes(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}  highlight={line.includes(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} highlight={line.includes(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} highlight={line.includes(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} highlight={line.includes(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} highlight={line.includes(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} highlight={line.includes(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} highlight={line.includes(8)}/>
      </div>
    </>
  );
}
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],[3, 4, 5],[6, 7, 8],
    [0, 3, 6],[1, 4, 7],[2, 5, 8],
    [0, 4, 8],[2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c]   // <-- quadrati che si vogliono colorare 
      };
    }
  }

  return { winner: null, line: [] };
}
/*
function calculateWinnerOld(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
*/
//nuova componente come root principale: si elimina export default nel componet di Board
//Questo indica al index.jsfile di utilizzare il Gamecomponente come componente di primo livello anziché il Boardcomponente stesso.
export default function Game() {
  // hostory: variabile di stato per tenere traccia delle mosse
  // const [xIsNext, setXIsNext] = useState(true);

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    // setXIsNext(!xIsNext);
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    // setXIsNext(nextMove % 2 === 0);
  }
  //In JavaScript, per trasformare un array in un altro, puoi usare il metodo array map:
  //[1, 2, 3].map((x) => x * 2) // [2, 4, 6]

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
