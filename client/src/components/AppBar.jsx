import React from 'react'
import Menu from './Menu.svg'
import AddressBar from './AddressBar'

const Title = () => {
    return <div className="title"><img className="menu-button" src={Menu} alt="Menu button" /><a href="/"><img className="logotype" src="logotype.png" alt="ContracTx"/></a></div>
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