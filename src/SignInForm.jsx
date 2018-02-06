

import React from 'react';
import update from 'immutability-helper';
import {FormControl, ControlLabel, FormGroup, Button} from 'react-bootstrap';

// Properties:
// - enabled
// - value
// - label
// - onChange(newValue, oldValue)
class TextFieldWrapper extends React.Component {
	render() {
		return (
			<FormGroup>
				<ControlLabel>
					{this.props.label}
				</ControlLabel>
				<FormControl
					type="text"
					value={this.props.value}
					placeholder="mqtt.server.com:port_number"
					onChange={this.handleOnChange}
					enabled={this.props.enabled.toString()}
					/>
			</FormGroup>
		);
	}

	handleOnChange = (e) => {
		if (!this.props.enabled) {
			// This should never happen.
			throw "Error: Attempt to change a disabled text field."
		}

		var newValue = e.target.value;

		if (this.props.onChange) {
			this.props.onChange(newValue);
		}
	}
}

// Properties:
// - enabled
// - serverName
// - username
// - onSubmit()
// - onChange(values)
// 	where "values" is a dictionary with "username" and "serverName" fields.
class SignInForm extends React.Component {
	

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<TextFieldWrapper 
					key="url"
					label="URL:"
					value={this.props.serverName}
					onChange={this.handleServerChange}
					enabled={this.props.enabled}
				/>
				<TextFieldWrapper
					key="username"
					label="Username:"
					value={this.props.username}
					onChange={this.handleNameChange}
					enabled={this.props.enabled}
				/>
			</form>
			);
	}

	handleSubmit = () => {
		if (this.props.onSubmit) {
			this.props.onSubmit();
		}
	}
	
	handleServerChange = (value) => {
		if (this.props.onChange) {
			this.props.onChange({
				serverName: value,
				username: this.props.username
			});
		}
	}

	handleNameChange = (value) => {
		if (this.props.onChange) {
			this.props.onChange({
				serverName: this.props.serverName,
				username: value
			});
		}
	}

}

export {TextFieldWrapper};
export default SignInForm;

