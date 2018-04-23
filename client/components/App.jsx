import React from "react";
import Row from "./Row";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.shape_j = [
            [
                [1, 0, 0],
                [1, 1, 1]
            ]
            ,
            [
                [1, 1],
                [1, 0],
                [1, 0]
            ],
            [
                [1, 1, 1],
                [0, 0, 1]
            ],
            [
                [0, 1],
                [0, 1],
                [1, 1]
            ]
        ];
        this.shape_o = [
            [
                [1, 1],
                [1, 1]
            ],
        ];
        this.shape_l = [
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
            ],
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ],
        ];
        this.shape_z = [
            [
                [1, 1, 0],
                [0, 1, 1],
            ],
            [
                [0, 1],
                [1, 1],
                [1, 0],
            ],
        ];
        this.shapes = [this.shape_o, this.shape_j, this.shape_z, this.shape_l];
        this.shapeIndex = Math.floor(Math.random() * this.shapes.length);
        this.rotateIndex = 0;
        this.potentialRotateIndex = 0;
        this.topLeft = {x: 5, y: 0};
        this.potentialTopLeft = {x: this.topLeft.x, y: this.topLeft.y};

        this.landed = [
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
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1]
        ];

        this.state = {
            matrix: this.getArrayToRender(),
            score: 0,
            gameOver: false,
        };
        this.tick = this.tick.bind(this);
        this.actionMoveLeft = this.actionMoveLeft.bind(this);
        this.actionMoveRight = this.actionMoveRight.bind(this);
        this.actionMoveDown = this.actionMoveDown.bind(this);
        this.actionDrop = this.actionDrop.bind(this);
        this.actionRotate = this.actionRotate.bind(this);

        document.onkeydown = this.onKeyDown.bind(this);
    }

    onKeyDown(e) {
        console.log(e.keyCode);

        if (87 === e.keyCode || 38 === e.keyCode) {
            // w or Up key
            this.actionRotate();
        }

        if (65 === e.keyCode || 37 === e.keyCode) {
            // A or Left key
            this.actionMoveLeft();
        }

        if (68 === e.keyCode || 39 === e.keyCode) {
            // D or Right key
            this.actionMoveRight();
        }

        if (83 === e.keyCode || 40 === e.keyCode) {
            // S or Down key
            this.actionMoveDown();
        }

        if (32 === e.keyCode) {
            // S or Down key
            this.actionDrop();
        }
    }

    tick() {
        console.log({
            potentialTopLeft: this.potentialTopLeft,
            topLeft: this.topLeft
        });

        if (this.state.gameOver === true) {
            if (window.confirm(`Game is over. Your score: ${this.state.score}. Would you like to start new game?`)) {
                this.resetGame();
                this.setState({matrix: this.getArrayToRender()});
            }
            return;
        }

        //console.log(this.landed);

        const nextPosition = this.checkNextPosition();
        if (nextPosition === false) {
            console.log("Border reached!");
        }
        if (nextPosition === null) {
            console.log("Landed!");
            this.landed = this.landTheShape();
            const result = this.checkRowsForDisappear();
            if (false !== result) {
                this.landed = result;
            }
            this.checkForGameOver();

            this.nextShape();
        }

        if (nextPosition === true) {
            console.log("Moving");
        }
        this.setState({matrix: this.getArrayToRender()});
    }

    getShape(potential = false) {
        if (potential)
            return this.shapes[this.shapeIndex][this.potentialRotateIndex];

        return this.shapes[this.shapeIndex][this.rotateIndex];
    }

    landTheShape() {
        console.log("Place shape");

        let _matrix = this.landed.map(function (arr) {
            return arr.slice();
        });
        const shape = this.getShape();

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== 0) {
                    _matrix[row + this.topLeft.y][col + this.topLeft.x] = 1;
                }
            }
        }

        return _matrix;
    }

    nextShape() {
        console.log("Next shape is coming!");
        this.topLeft = {x: 5, y: 0};
        this.rotateIndex = 0;
        this.shapeIndex = Math.floor(Math.random() * this.shapes.length);
        this.resetPotentialPosition();
    }

    actionMoveLeft() {
        this.potentialTopLeft.x--;
        this.tick();
    }

    actionMoveRight() {
        this.potentialTopLeft.x++;
        this.tick();
    }

    actionMoveDown() {
        this.potentialTopLeft.y++;
        this.tick();
    }

    actionDrop() {
        do {
            this.potentialTopLeft.y++;
            if (this.potentialTopLeft.y >= this.landed.length)
                break;
        } while (true === this.checkNextPosition());
        this.tick();
    }

    actionRotate() {
        console.log("Rotating");
        this.potentialRotateIndex++;
        if (this.potentialRotateIndex >= this.shapes[this.shapeIndex].length) {
            this.potentialRotateIndex = 0;
        }
        this.tick();
    }

    getArrayToRender() {
        const shape = this.getShape();
        let _matrix = this.landed.map(function (arr) {
            return arr.slice();
        });

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== 0) {
                    _matrix[row + this.topLeft.y][col + this.topLeft.x] = 1;
                }
            }
        }

        return _matrix;
    }

    /**
     * false - can`t move
     * null - can`t move, place shape
     * true - next move allowed
     */
    checkNextPosition() {
        const shape = this.getShape(true);
        let _matrix = this.landed;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== 0) {
                    if (row + this.potentialTopLeft.y >= _matrix.length) {
                        this.resetPotentialPosition();
                        return null;
                    }
                    if (col + this.potentialTopLeft.x < 0 || col + this.potentialTopLeft.x >= _matrix[0].length
                        || (0 !== _matrix[row + this.potentialTopLeft.y][col + this.potentialTopLeft.x] && this.potentialTopLeft.x !== this.topLeft.x)
                        || (0 !== _matrix[row + this.potentialTopLeft.y][col + this.potentialTopLeft.x] && this.potentialRotateIndex !== this.rotateIndex)
                    ) {
                        this.resetPotentialPosition();
                        return false;
                    }
                    if (0 !== _matrix[row + this.potentialTopLeft.y][col + this.potentialTopLeft.x]) {
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
        const emptyRow = new Array(this.landed[0].length).fill(0);
        let _matrix = this.landed.filter(row => {
            if (-1 !== row.indexOf(0)) {
                return row.slice();
            }
            console.log("Row has been disappeared");
        });

        if (this.landed.length === _matrix.length) {
            return false;
        }

        for (let i = _matrix.length; i < this.landed.length; i++) {
            this.setState({score: this.state.score + this.landed[0].length});
            _matrix.unshift(emptyRow);
        }

        return _matrix;
    }

    checkForGameOver() {
        if (0 < this.landed[0].reduce((sum, currentValue) => currentValue + sum, 0)) {
            this.landed = this.fillMatrixWith(1);
            this.setState({gameOver: true, matrix: this.getArrayToRender()});

            return true;
        }
    }

    fillMatrixWith(stubValue = 0) {
        const stubRow = new Array(this.landed[0].length).fill(stubValue);
        return this.landed.map(row => stubRow.slice());
    }

    potentialShapePositionToReal() {
        this.topLeft = {x: this.potentialTopLeft.x, y: this.potentialTopLeft.y};
        this.rotateIndex = this.potentialRotateIndex;
    }

    resetPotentialPosition() {
        this.potentialTopLeft = {x: this.topLeft.x, y: this.topLeft.y};
        this.potentialRotateIndex = this.rotateIndex;
    }

    resetGame() {
        this.resetPotentialPosition();
        this.landed = this.fillMatrixWith(0);
        this.setState({score: 0, gameOver: false, matrix: this.getArrayToRender()});
    }

    render() {
        return (
            <div className="game-container">
                <div id="field-container">
                    <div id="field">
                        {this.state.matrix.map(row => {
                            return <Row cells={row}/>;
                            })}
                    </div>
                    <h3 id="score">Score: {this.state.score}</h3>
                    <div className="key-pad">
                        <p>
                            <button onClick={this.actionMoveLeft}>&lt;</button>
                            <button onClick={this.actionRotate}>&#x21bb;</button>
                            <button onClick={this.actionMoveRight}>&gt;</button>
                        </p>
                        <p>
                            {/*<button onClick={this.moveDown}>Drop</button>*/}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
