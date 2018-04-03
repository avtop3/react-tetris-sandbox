import React from 'react'

export default class Cell extends React.Component {
    render() {
        return (
            <div className={[this.props.active ? 'active' : null, 'cell'].join(' ')}></div>
        )
    }
}
