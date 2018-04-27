import React from 'react'

class AddressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d'};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    console.log(this.state)
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.enterAddress(this.state.value);
  }

  render() {
    return (
      <form className="address-bar" onSubmit={this.handleSubmit}>
        <input type="text" className="address-input" aria-label="Contract address" placeholder="Enter a contact address" value={this.state.value} onChange={this.handleChange} />
        <input type="submit" value="Analyze" className="button submit" />
      </form>
    );
  }
}
export default AddressBar

