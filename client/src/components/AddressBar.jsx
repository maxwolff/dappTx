import React from 'react'

class AddressBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: ''}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return ({value: nextProps.address})
  }

  handleChange(event) {
    this.setState({value: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    if (this.state.value)
      this.props.enterAddress(this.state.value)
  }

  render() {
    return (
      <form className="address-bar" onSubmit={this.handleSubmit}>
        <input type="text" className="address-input" aria-label="Contract address" placeholder="Enter a contact address" value={this.state.value} onChange={this.handleChange} />
        <input type="submit" value="Analyze" className="button submit" />
      </form>
    )
  }
}
export default AddressBar