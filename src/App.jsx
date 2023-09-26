import { useState } from "react";
import {WinnerModal} from "./components/WinnerModal"
import confetti from 'canvas-confetti'
import { Square } from "./components/Square";
import { TURNS } from "./constants";
import {checkWinnerFrom, checkEndGame, resetGameStorage, saveGameToStorage} from "./logic/board"
import "./App.css";


//const board = Array(9).fill(null)

function App() {
  console.log('render')
  //ESTADOS: un estado es un valor que se actualizará/rederizará cuando se detecten cambios
  //en nuestro componente, en este caso, el tablero.
  /*LOS UseState SIEMPRE DEBEN IR FUERA DE ESTRUCTURAS IF's YA QUE REACT 
  GUARDA EN MEMORIA INTERNA EL ORDEN DE EJECUCIÓN DE LOS USE STATE, Y POR LO
  TANTO SI PONEMOS UN USESTATE DENTRO DE UN IF, REACT PODRÍA TENER PROBLEMAS.
  LOS useState deben ir SIEMPRE EN EL CUERPO DEL COMPONENTE, NUNCA DENTRO DE UN
  IF, WHILE, LOOP...SIEMPRE EN EL CUERPO DE LA FUNCION.
  */

  /* CALLBACK dentro de useState(): es una función que tiene que devolver
  el valor con el que quieres inicializar el estado*/
  const [board, setBoard] = useState(()=>{
    //console.log('inicializar estado del board')
    const boardFromStorage = window.localStorage.getItem('board')
    if(boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null);
  })

  const [turn, setTurn] = useState(()=>{
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X    
  })

  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()
  }

  const updateBoard = (index) => {
    // no actualizamos esta posición
    // si ya tiene algo
    if (board[index] || winner) return
    // actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    // cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    //guardar partida
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })
  
    
    // revisar si hay ganador
    //la actualización de los estados en React SON ASÍNCRONOS
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false) // empate
    }
  }
  return (
    <main className='board'>
      <h1>Tres en raya</h1>
      <button onClick={resetGame}>Resetear juego</button>
      <section className='game'>
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />

      <h3>V1.0</h3>
    </main>
  );
}

export default App;
