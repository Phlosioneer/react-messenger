
import React from 'react';
import {Panel, Grid, Row} from 'react-bootstrap';
import update from 'immutability-helper';
import Message from './Message.jsx';

class ChatView extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			messages: [{topic: "TestTopic", text: "Hello, World"}]
		};

		this.setupConnection(props.connection);
	}

	renderMessages() {
		return this.state.messages.map((msg, index) => <Message key={index} text={msg.text}/>);
	}

	render() {
		return (
				<Grid fluid>
					<Row>
						{this.renderMessages()}
					</Row>
				</Grid>
			   );
	}

	componentWillReceiveProps(newProps) {
		console.log("willReceiveProps");
		console.log(newProps);
		this.teardownConnection(this.props.connection);
		this.setupConnection(newProps.connection);
	}

	setupConnection(conn) {
		console.log("setupConnection()");
		console.log(conn);

		if (conn === undefined || conn === null) {
			return;
		}

		conn.on('connect', this.handleConnect);
		conn.on('reconnect', this.handleReconnect);
		conn.on('close', this.handleConnectionClose);
		conn.on('offline', this.handleOffline);
		conn.on('error', this.handleConnectionError);
		conn.on('message', this.handleMessage);

		conn.subscribe("root/#");
	}

	teardownConnection(conn) {
		if (conn === undefined || conn === null) {
			return;
		}

		conn.removeListener('connect', this.handleConnect);
		conn.removeListener('reconnect', this.handleReconnect);
		conn.removeListener('close', this.handleConnectionClose);
		conn.removeListener('offline', this.handleOffline);
		conn.removeListener('error', this.handleConnectionError);
		conn.removeListener('message', this.handleMessage);
	}
	
	handleConnect = (connack) => {
		console.log("handleConnect()");
		console.log(connack);
	}

	handleReconnect = () => {
		console.log("handleReconnect()");
	}

	handleConnectionClose = () => {
		console.log("handleConnectionClose()");
	}

	handleOffline = () => {
		console.log("handleOffline()");
	}

	handleConnectionError = (error) => {
		console.log("handleConnectionError()");
		console.log(error);
	}

	handleMessage = (topic, text, packet) => {
		console.log("handleMessage()");
		var message = {
			topic: topic,
			text: message
		};
		console.log(message);
		console.log(packet);
		this.setState((prevState) => update(prevState, {
			messages: {$push: message}
		}));
	}
}

export default ChatView;





