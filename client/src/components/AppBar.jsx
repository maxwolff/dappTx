import React from 'react'
import AddressBar from '../components/AddressBar'

const Title = () => {
    return <div className="title"><img className="logotype" src="logotype.png" alt="ContracTx"/></div>
}

const AppBar = (props) => {
    return (
        <header className="app-bar">
            <Title />
            <AddressBar address={props.address} enterAddress={props.enterAddress} />
        </header>
    )
}

export default AppBar