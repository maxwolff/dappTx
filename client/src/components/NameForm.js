import React from 'react'
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    //console.log(this.state) | setState() is async; log is inaccurate when called before; move to render for accurate log
  }

  handleSubmit(event) {
    event.preventDefault();
    //this.setState({value: event.target.value}); | event target for submit is NOT text input value; this undesirably clears state (undefined) upon submit
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

