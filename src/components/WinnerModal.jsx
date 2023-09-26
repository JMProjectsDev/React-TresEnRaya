import { Square } from "./Square"
import PropTypes from 'prop-types';

WinnerModal.propTypes = {
  winner: PropTypes.oneOfType([
    PropTypes.bool,          // Para el valor 'false'
    PropTypes.string,        // Si 'winner' es una cadena cuando hay un ganador
    PropTypes.number,        // Si 'winner' es un número    
  ]),
  resetGame: PropTypes.func.isRequired
};

export function WinnerModal ({ winner, resetGame }) {
    if (winner === null) return null
  
    const winnerText = winner === false ? 'Empate' : 'Ganó:'
  
    return (
      <section className='winner'>
        <div className='text'>
          <h2>{winnerText}</h2>
  
          <header className='win'>
            {winner && <Square>{winner}</Square>}
          </header>
  
          <footer>
            <button className="newGame" onClick={resetGame}>Empezar de nuevo</button>
          </footer>
        </div>
      </section>
    )
  }