
import React from 'react';
import {Panel} from 'react-bootstrap';


class Message extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			username: "Unknown",
			text: props.text
		}
	}

	render() {
		return (
			<Panel>
				<Panel.Title>{this.state.username}</Panel.Title>
				<Panel.Body>{this.state.text}</Panel.Body>
			</Panel>
		)
	}
	
}

export default Message;

