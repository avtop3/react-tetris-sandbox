import React from 'react';
import Row from './Row'

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.shape_o = [
            [1, 0],
            [1, 0]
        ];
        this.topLeft = {x: 5, y: 0};
        this.potentialTopLeft = {x: 6, y: 0};

        this.matrix = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
        ];

        this.state = {
            matrix: this.getArrayToRender(),
            score: 0,
            status: false
        };
        this.tick = this.tick.bind(this);
        this.moveLeft = this.moveLeft.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.moveDown = this.moveDown.bind(this);

        document.onkeydown = this.onKeyDown.bind(this);
    }

    onKeyDown(e) {
        console.log(e.keyCode)

        if (87 === e.keyCode || 38 === e.keyCode) { // w or Up key
        }

        if (65 === e.keyCode || 37 === e.keyCode) { // A or Left key
            this.moveLeft();
        }

        if (68 === e.keyCode || 39 === e.keyCode) { // D or Right key
            this.moveRight();
        }

        if (83 === e.keyCode || 40 === e.keyCode) { // S or Down key
            this.moveDown();
        }
    }

    tick() {
        console.log({'potentialTopLeft': this.potentialTopLeft, 'topLeft': this.topLeft});
        //console.log(this.landed);

        const nextPosition = this.checkNextPosition();
        if (nextPosition === false) {
            console.log('Border reached!');
            // this.landTheShape();
            // this.nextShape();
        }
        if (nextPosition === null) {
            console.log('Landed!');
            this.landTheShape();
            const result = this.checkRowsForDisappear();
            if (false !== result) {
                this.matrix = result;
            }
            this.checkForGameOver();
            this.nextShape();
        }

        if (nextPosition === true) {
            console.log('Moving');
            // this.landTheShape();
            // this.nextShape();

        }
        this.setState({matrix: this.getArrayToRender()});

    }

    landTheShape() {
        console.log('Place shape');
        for (let row = 0; row < this.shape_o.length; row++) {
            for (let col = 0; col < this.shape_o[row].length; col++) {
                if (this.shape_o[row][col] != 0) {
                    this.matrix[row + this.topLeft.y][col + this.topLeft.x] = 1;
                }
            }
        }
    }

    nextShape() {
        console.log('Next shape is coming!');
        this.topLeft = {x: 5, y: 0};
        this.resetPotentialPosition();
    }

    moveLeft() {
        this.potentialTopLeft.x--
        this.tick();
    }

    moveRight() {
        this.potentialTopLeft.x++
        this.tick();
    }

    moveDown() {
        this.potentialTopLeft.y++
        this.tick();
    }

    getArrayToRender() {
        let _matrix = this.matrix.map(function (arr) {
            return arr.slice();
        });

        for (let row = 0; row < this.shape_o.length; row++) {
            for (let col = 0; col < this.shape_o[row].length; col++) {
                if (this.shape_o[row][col] != 0) {
                    _matrix[row + this.topLeft.y][col + this.topLeft.x] = 1;
                }
            }
        }

        return _matrix;
    }

    checkNextPosition() {
        let _matrix = this.matrix;

        for (let row = 0; row < this.shape_o.length; row++) {
            for (let col = 0; col < this.shape_o[row].length; col++) {
                if (this.shape_o[row][col] !== 0) {
                    if (col + this.potentialTopLeft.x < 0 || col + this.potentialTopLeft.x >= _matrix[0].length) {
                        this.resetPotentialPosition();
                        return false;
                    }
                    if (row + this.potentialTopLeft.y >= _matrix.length || 0 !== _matrix[row + this.potentialTopLeft.y][col + this.potentialTopLeft.x]) {
                        this.resetPotentialPosition();
                        return null;
                    }
                }
            }
        }

        this.potentialShapePositionToReal();
        return true;
    }

    checkRowsForDisappear() {
        const emptyRow = (new Array(this.matrix[0].length)).fill(0);
        let _matrix = this.matrix.filter((row) => {
            if (-1 !== row.indexOf(0)) {
                return row.slice();
            }
            console.log('Row has been disappeared');
        });

        if (this.matrix.length === _matrix.length) {
            return false;
        }

        for (let i = _matrix.length; i < this.matrix.length; i++) {
            this.setState({score: this.state.score + this.matrix[0].length});
            _matrix.unshift(emptyRow);
        }

        return _matrix;
    }

    checkForGameOver() {
        if (0 < this.matrix[0].reduce((sum, currentValue) => currentValue + sum, 0)) {
            this.matrix = this.fillMatrixWith(1);
        }
    }

    fillMatrixWith(stubValue = 0) {
        const stubRow = (new Array(this.matrix[0].length)).fill(stubValue);
        return this.matrix.map((row) => stubRow);
    }

    potentialShapePositionToReal() {
        this.topLeft = {x: this.potentialTopLeft.x, y: this.potentialTopLeft.y};
    }

    resetPotentialPosition() {
        this.potentialTopLeft = {x: this.topLeft.x, y: this.topLeft.y};
    }


    render() {
        return (
            <div className="game-container">
                <div className="key-pad">
                    <p>
                        <button onClick={this.moveLeft}>&lt;</button>
                        <button onClick={this.tick}>Tick!</button>
                        <button onClick={this.moveRight}>&gt;</button>
                    </p>
                    <p>
                        <button onClick={this.moveDown}>Down</button>
                    </p>
                </div>
                <h3 id="score">Score: {this.state.score}</h3>
                <div id="field">
                    {
                        this.state.matrix.map((row) => {
                            return <Row cells={row}/>
                        })
                    }
                </div>
            </div>
        )
    }
}