import React from 'react'
import './GameResults.css'


const GameResults = () => {
  return (
    <div className="gameResults">
        <div className="gameResults__main">
            <div className="gameResults__main__leftTable">
                <h1>Scoreboard</h1>
                <div className="gameResults__main__leftTable__header">
                    <p>#</p>
                    <p>Name</p>
                    <p>Score</p>
                    <p>Ratio</p>
                    <p>Avg. Answer Time</p>
                </div>
                <div className="gameResults__main__leftTable__rowContainer">
                    <div className="gameResults__main__leftTable__rowContainer__row">
                        <p>1</p>
                        <p>Arman</p>
                        <p>1200</p>
                        <p>%90</p>
                        <p>6.8 sec</p>
                    </div>
                    <div className="gameResults__main__leftTable__rowContainer__row">
                        <p>2</p>
                        <p>Berat</p>
                        <p>900</p>
                        <p>%70</p>
                        <p>3.8 sec</p>
                    </div>
                    <div className="gameResults__main__leftTable__rowContainer__row">
                        <p>2</p>
                        <p>Berat</p>
                        <p>900</p>
                        <p>%70</p>
                        <p>3.8 sec</p>
                    </div>
                    <div className="gameResults__main__leftTable__rowContainer__row">
                        <p>2</p>
                        <p>Berat</p>
                        <p>900</p>
                        <p>%70</p>
                        <p>3.8 sec</p>
                    </div>
                    <div className="gameResults__main__leftTable__rowContainer__row">
                        <p>2</p>
                        <p>Berat</p>
                        <p>900</p>
                        <p>%70</p>
                        <p>3.8 sec</p>
                    </div>
                    <div className="gameResults__main__leftTable__rowContainer__row">
                        <p>2</p>
                        <p>Berat</p>
                        <p>900</p>
                        <p>%70</p>
                        <p>3.8 sec</p>
                    </div>
                    <div className="gameResults__main__leftTable__rowContainer__row">
                        <p>2</p>
                        <p>Berat</p>
                        <p>900</p>
                        <p>%70</p>
                        <p>3.8 sec</p>
                    </div>

                </div>
            </div>
            <div className="gameResults__main__rightTable">
                <h1>Tracks</h1>
                <div className="gameResults__main__rightTable__header">
                    <p>Round #</p>
                    <p>Name</p>
                    <p>Artist</p>
                </div>
                <div className="gameResults__main__rightTable__rowContainer">
                    <div className="gameResults__main__rightTable__rowContainer__row">
                        <p>1</p>
                        <p>Hotel California</p>
                        <p>Eagles</p>
                    </div>
                    <div className="gameResults__main__rightTable__rowContainer__row">
                        <p>2</p>
                        <p>Hoifornia</p>
                        <p>Eaglesssssaaa</p>
                    </div>
                    <div className="gameResults__main__rightTable__rowContainer__row">
                        <p>3</p>
                        <p>Hotel Califsdfsornia</p>
                        <p>Eagles</p>
                    </div>
                    <div className="gameResults__main__rightTable__rowContainer__row">
                        <p>4</p>
                        <p>Hotel hahah</p>
                        <p>Eaglasdfsdfes</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="gameResults__footer">
            <div className="gameResults__footer__left">
                <div className="gameResults__footer__left__logo">
                    <p className="gameResults__footer__left__logo__top noselect"> Musi</p>
                    <p className="gameResults__footer__left__logo__bottom noselect">Guess</p>
                </div>
                <button>Exit</button>
            </div>
            <div className="gameResults__footer__right">
                <button className = "gameResults__footer__right__buttonBack">Back to Lobby</button>
                <button className = "gameResults__footer__right__buttonRestart">Restart</button>
            </div>

        </div>
    </div>
  )
}

export default GameResults