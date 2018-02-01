
import React from 'react';
import {Grid, Row} from 'react-bootstrap';
import update from 'immutability-helper';
import MessageList from './MessageList.jsx';
import ConnectionManager from './ConnectionManager';

class MainView extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			messages: [{topic: "TestTopic", text: "Hello, World"}],
			connectionManager: new ConnectionManager(
					this.handleGetMessage,
					this.handleMessageSent,
					this.handleSubscribeFinished,
					this.handleUnsubscribeFinished,
					this.handleConnError,
					this.handleConnInfo
					),
			sendConfirmCallback: null,
			subConfirmCallback: null,
			unsubConfirmCallback: null
		};

		this.state.connectionManager.setupConnection(props.connection);
	}

	render() {
		return (
			<MessageList
				messages={this.state.messages}
				onSendMessage={this.handleSendMessage}
				/>
			);
	}

	componentWillReceiveProps(newProps) {
		console.log("willReceiveProps");
		console.log(newProps);
		this.state.connectionManager.setupConnection(newProps.connection);
	}

	// TODO: Register an on-page-close event to call connection.end(true).


	doSubscribe(topic) {
		this.state.connectionManager.subscribe(topic);
	}

	doUnsubscribe(topic) {
		this.state.connectionManager.unsubscribe(topic);
	}

	doPublish(topic, message) {
		this.state.connectionManager.publish(topic, message);
	}
	

	handleGetMessage = (topic, message, packet) => {
		console.log("handleGetMessage()");
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


	handleSendMessage = (text, onSendConfirm) => {
		console.log("handleSendMessage()");
		console.log(text);
		var imageUrl = "https://www.eg.bucknell.edu/~amm042/ic_account_circle_black_24dp_2x.png";
		var message = {clientTime: 1, message: text, iconUrl: imageUrl};
		this.setState((prevState) => {
			this.doPublish("root/dummy_chat/phlosioneer", JSON.stringify(message));
			return update(prevState, {
				sendConfirmCallback: {$set: onSendConfirm}
			});
		});
	}

	handleMessageSent = () => {
		console.log("handleMessageSent()");
		this.setState((prevState) => {
			if (prevState.sendConfirmCallback) {
				prevState.sendConfirmCallback();
			}
			return update(prevState, {
				sendConfirmCallback: {$set: null}
			});
		});
	}

	handleSubscribeFinished = (topic) => {
		console.log("handleSubscribeFinished()");
		console.log(topic);
		this.setState((prevState) => {
			if (prevState.subConfirmCallback) {
				prevState.subConfirmCallback();
			}
			return update(prevState, {
				subConfirmCallback: {$set: null}
			});
		});
	}

	handleUnsubscribeFinished = (topic) => {
		console.log("handleUnsubscribeFinished()");
		console.log(topic);
		this.setState((prevState) => {
			if (prevState.unsubConfirmCallback) {
				prevState.unsubConfirmCallback();
			}
			return update(prevState, {
				unsubConfirmCallback: {$set: null}
			});
		});
	}

	handleConnError(code, text) {
		console.log("handleConnError()");
		console.log(code);
		console.log(text);
		// TODO: Make an alert at the top of the page.
	}

	handleConnInfo(code, text) {
		console.log("handleConnInfo()");
		console.log(code);
		console.log(text);
		// TODO: Make an alert at the top of the page.
	}

}

export default MainView;





