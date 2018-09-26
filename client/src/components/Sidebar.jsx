import React from 'react'

class Sidebar extends React.Component {

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event) {
    event.preventDefault()
    this.props.loadExample(event)
}

  render() {
    return(
      <aside className={'sidebar ' + this.props.sidebar}>
        <article className="about">
          <section>
            <h2>About</h2>
            <p>Use this utility to analyze Ethereum smart contracts and their functions</p>
            <small>Example: <a href="" id="sidebar-eg" onClick={this.handleClick}>analyze CryptoKittiesCore</a></small>
          </section>
          <section>
            <h3>Usage Guide</h3>
            <ol className="instructions">
              <li>Find an ERC20 contract address. <small>(Search on <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer">Etherscan</a>)</small></li>
              <li>Paste the address into the field at the top then click "Analyze".</li>
              <li>The charts will analyze the last month of contract data. Use the API to access to older data.</li>
            </ol>
          </section>
          <section>
            <h3>API Requests</h3>
            <ol className="instructions">
              <li>API calls use the following endpoint:</li>
              <pre className="snippet">/api/{'{contractID}'}/{'{startTime}'}/{'{endTime}'}</pre>
              <li>Format each endpoint parameter as a hexadecimal number. <small>(E.g. "0x5A1340E0")</small></li>
            </ol>
          </section>
          <section>
            <h3>Colophon</h3>
            <small>View project repository on <a href="https://github.com/maxwolff/dappTx" target="_blank" rel="noopener noreferrer">Github</a>
            <br />Built with <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">React</a> + <a href="https://www.highcharts.com/" target="_blank" rel="noopener noreferrer">Highcharts</a>
            <br />Typeset with <a href="https://www.ibm.com/plex/" target="_blank" rel="noopener noreferrer">IBM Plex</a>
            <br />Backend by <a href="https://twitter.com/maxcwolff" target="_blank" rel="noopener noreferrer">Max Wolff</a>
            <br />Design + frontend by <a href="https://twitter.com/stedman_rh" target="_blank" rel="noopener noreferrer">Stedman Halliday</a>
            <br />Special thanks <a href="https://github.com/jtmoulia" target="_blank" rel="noopener noreferrer">Thomas Moulia</a> + <a href="https://gitcoin.co/" target="_blank" rel="noopener noreferrer">Gitcoin</a></small>
          </section>
        </article>
      </aside>
    )
  }

}

export default Sidebar