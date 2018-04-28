import React from 'react'

const EmptyMessage = props => {
    if (props.isEmpty) {
        return (
            <div className="chart-empty">
                <h2>No chart data</h2>
                <p>Try an example: <a href="" onClick={props.loadExample}>analyze CryptoKittiesCore</a></p>
            </div>
        )
    }
    return false
}

export default EmptyMessage