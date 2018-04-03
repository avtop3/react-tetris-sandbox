import React from 'react'
import Cell from './Cell'

export default class Row extends React.Component {
    render() {
        return (
            <div className="row">
                {
                    this.props.cells.map(function (cell) {
                        return <Cell active={!!cell}/>
                    })
                }
            </div>
        )
    }
}