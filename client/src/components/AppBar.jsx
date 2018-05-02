import React from 'react'
import Menu from './Menu.svg'
import AddressBar from './AddressBar'

class Title extends React.Component {
    render() {
        return (
            <div className="title">
                <img className="menu-button" src={Menu} alt="Menu button" onClick={this.props.toggleSidebar} />
                <a href="/"><img className="logotype" src="logotype.png" alt="ContracTx"/></a>
            </div>
        )
    }
}

class AppBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {value: ''}
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(event) {
        event.preventDefault()
        this.props.toggleSidebar(event)
    }

    render() {
        return (
            <header className="app-bar">
                <Title toggleSidebar={this.handleClick} />
                <AddressBar address={this.props.address} enterAddress={this.props.enterAddress} />
            </header>
        )
    }
}

export default AppBar