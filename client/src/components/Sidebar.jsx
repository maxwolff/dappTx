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
            <li>Paste the contract address into the navbar and click “Analyze"</li>
            <li>The first chart plots the contract’s transaction volume as a percentage of sampled Ethereum transactions over time.</li>
            <li>The second chart plots calls to each of the contract’s functions over time.</li>
          </ol>
          <h3>API + Repository</h3>
          <p>API endpoint: /api/:contractID/:startTime/:endTime</p>
      </aside>
    )
  }

}

export default Sidebar