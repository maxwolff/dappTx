import React from 'react'
import AddressBar from '../components/AddressBar'

function Title() {
    return <div className="title"><img className="logotype" src="logotype.png" alt="ContracTx"/></div>
}

function AppBar(props) {
    return (
        <header className="app-bar">
            <Title />
            <AddressBar enterAddress={props.enterAddress} />
        </header>
    )
}

export default AppBar