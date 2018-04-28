import React from 'react'

const EmptyMessage = (props) => {
    if (props.isEmpty) {
        return (
            <div className="chart-empty">
                <p>No chart data</p>
                <small>Example: <a href="javascript:void(0)" onClick={props.loadExample}>analyze CryptoKittiesCore</a></small>
            </div>
        )
    }
    return false
}

export default EmptyMessage