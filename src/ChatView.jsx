
import React from 'react';
import {Grid, Row} from 'react-bootstrap';
import update from 'immutability-helper';
import Message from './Message.jsx';
import ChatBox from './ChatBox.jsx';

class ChatView extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			messages: [{topic: "TestTopic", text: "Hello, World"}]
		};

		this.setupConnection(props.connection);
	}

	renderMessages() {
		return this.state.messages.map((msg, index) => (
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
			   			<ChatBox onSubmit={this.handleSendMessage}/>
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

	// TODO: Register an on-page-close event to call connection.end(true).

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
		conn.on('message', this.handleGetMessage);
		
		conn.subscribe("root/#", {qos: 2}, this.handleSubscribeCompleted);
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
		conn.removeListener('message', this.handleGetMessage);
	}

	doSubscribe(topic) {
		this.props.connection.subscribe(topic, {qos: 2}, this.handleSubscribeCompleted);
	}

	doUnsubscribe(topic) {
		this.props.connection.unsubscribe(topic, this.handleUnsubscribeError);
	}

	doPublish(topic, message) {
		this.props.connection.publish(topic, message, {qos: 2}, this.handleSendCompleted);
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

	handleGetMessage = (topic, messageBytes, packet) => {
		console.log("handleGetMessage()");
		// Mqtt gives us a raw, UInt8Array of the bytes in the message.
		var message = Array.from(messageBytes).map(c => String.fromCharCode(c)).join("");
		message = JSON.parse(message);
		console.log(message);
		console.log(packet);
		var messageProps = {
			topic: topic,
			text: message.message
		};
		console.log(messageProps);
		console.log(this.state);
		this.setState((prevState) => update(prevState, {
			messages: {$push: [messageProps]}
		}));
	}

	handleSendCompleted = (error) => {
		console.log("handleSendCompleted()");
		console.log(error);
	}

	handleSendMessage = (text) => {
		console.log("handleSendMessage()");
		console.log(text);
		var imageUrl = "https://www.eg.bucknell.edu/~amm042/ic_account_circle_black_24dp_2x.png";
		var message = {clientTime: 1, message: text, iconUrl: imageUrl};
		this.doPublish("root/dummy_chat/phlosioneer", JSON.stringify(message));
	}

	handleSubscribeCompleted = (error, grantedTopics) => {
		console.log("handleSubscribeCompleted()");
		console.log(error);
		console.log(grantedTopics);
	}

	handleUnsubscribeError = (error) => {
		console.log("handleUnsubscribeError()");
		console.log(error);
	}
}

export default ChatView;





