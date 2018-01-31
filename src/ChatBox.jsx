
import React from 'react';
import update from 'immutability-helper';
import {FormGroup, FormControl} from 'react-bootstrap';


class ChatBox extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			text: ""
		}
	}
	

	render() {
		return (
			<FormControl
				type="textarea"
				placeholder="Type a message..."
				value={this.state.text}
				onChange={this.handleChange}
				onKeyDown={this.handleKeyDown}
				/>
			);
	}

	handleChange = (e) => {
		var value = e.target.value;
		this.setState(update(this.state, {
			text: {$set: value}
		}));
	}

	handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey && this.props.onSubmit) {
			this.props.onSubmit(this.state.text);
			e.preventDefault();
			e.nativeEvent.stopImmediatePropagation();
			this.setState(update(this.state, {
				text: {$set: ""}
			}));
		}
	}

}




export default ChatBox;

