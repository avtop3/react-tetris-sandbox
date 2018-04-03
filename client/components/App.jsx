import React from 'react';
import Row from './Row'

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.shape_o = [
            [1, 1],
            [1, 1]
        ];
        this.topLeft = {x: 5, y: 0};
        this.potentialTopLeft = {x: 5, y: 0};

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
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        ];

        this.state = {matrix: this.getArrayToRender()};
        this.tick = this.tick.bind(this);
        this.moveLeft = this.moveLeft.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.moveDown = this.moveDown.bind(this);
    }

    tick() {
        console.log(this.topLeft);
        //console.log(this.landed);
        let arrayToRender = this.getArrayToRender();
        if (arrayToRender === false) {
            console.log('Border reached!');
            this.placeShape();
            this.nextShape();
        }
        this.setState({matrix: arrayToRender});
    }

    placeShape() {
        console.log('Place shape');
    }

    nextShape() {
        console.log('Next shape is coming!');
    }

    moveLeft() {
        this.topLeft.x--
        this.tick();
    }

    moveRight() {
        this.topLeft.x++
        this.tick();
    }

    moveDown() {
        this.topLeft.y++
        this.tick();
    }

    getArrayToRender() {
        //let _matrix = this.matrix.slice();
        let _matrix = this.matrix.map(function (arr) {
            return arr.slice();
        });

        for (var row = 0; row < this.shape_o.length; row++) {
            for (var col = 0; col < this.shape_o[row].length; col++) {
                if (this.shape_o[row][col] != 0) {
                    if (col + this.topLeft.x <= 0 || col + this.topLeft.x >= _matrix[0].length) {
                        return false;
                    } else {
                        _matrix[row + this.topLeft.y][col + this.topLeft.x] = 1;
                    }
                }
            }
        }

        return _matrix;
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