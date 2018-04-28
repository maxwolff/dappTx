import React from 'react'

class Sidebar extends React.Component {

  render() {
    return(
      <aside className="sidebar">
          <h2>About</h2>
          <p>Use this utility to analyze Ethereum smart contracts and their functions.</p>
          <small>Example: <a href="" onClick={this.props.loadExample}>analyze CryptoKittiesCore</a></small>
          <h3>Usage Guide</h3>
          <ol className="instructions">
              <li>Find an ERC20 contract address (search on <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer">Etherscan</a>)</li>
          </ol>
      </aside>
    )
  }

}

export default Sidebar