import React from 'react'
import AddressBar from './AddressBar'

const Title = () => {
    return <div className="title"><a href="/"><img className="logotype" src="logotype.png" alt="ContracTx"/></a></div>
}

const AppBar = props => {
    return (
        <header className="app-bar">
            <Title />
            <AddressBar address={props.address} enterAddress={props.enterAddress} />
        </header>
    )
}

export default AppBar