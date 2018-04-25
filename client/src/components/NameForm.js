import React from 'react'
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d'};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // this.props.addressCallback(this.state.value)
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    console.log(this.state)
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.addressCallback(this.state.value);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Contract Address:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
export default NameForm;

