

import React from 'react';
import {Grid, Row} from 'react-bootstrap';
import ChatBox from './ChatBox.jsx';
import Message from './Message.jsx';

class MessageList extends React.Component {
	
	renderMessages() {
		return this.props.messages.map((msg, index) => (
				<Row key={index}>
					<Message text={msg.text}/>
				</Row>
				));
	}

	render() {
		return (
				<Grid fluid>
					{this.renderMessages()}
					<Row key="chatbox">
			   			<ChatBox onSubmit={this.props.onSendMessage}/>
					</Row>
				</Grid>
				);
	}
	
}


export default MessageList;





