
import React from 'react';
import update from 'immutability-helper';
import {Form, FormControl, Button, Col} from 'react-bootstrap';


class ChatBox extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			text: ""
		}
	}
	

	render() {
		return (
			<Form horizontal>
				<Col sm={10}>
					<FormControl
						type="textarea"
						placeholder="Type a message..."
						value={this.state.text}
						onChange={this.handleChange}
						onKeyDown={this.handleKeyDown}
						/>
				</Col>
				<Col sm={1}>
					<Button onClick={this.handleSendClicked}>
						Send
					</Button>
				</Col>
			</Form>
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
			this.handleSendClicked();
			e.preventDefault();
			e.nativeEvent.stopImmediatePropagation();
		}
	}

	handleSendClicked = () => {
		this.props.onSubmit(this.state.text, this.handleSendConfirmed);
	}

	handleSendConfirmed = () => {
		console.log("handleSendConfirmed()");
		this.setState((prevState) => update(prevState, {
			text: {$set: ""}
		}));
	}

}




export default ChatBox;

