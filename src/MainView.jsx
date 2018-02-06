
import React from 'react';
import {Modal, Button, ButtonToolbar} from 'react-bootstrap';
import update from 'immutability-helper';
import MessageList from './MessageList.jsx';
import ConnectionManager from './ConnectionManager.jsx';
import {TextFieldWrapper} from './SignInForm.jsx';

class MainView extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			messages: [],
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
			unsubConfirmCallback: null,
			currentTopic: "dummy_topic",
			topicInputText: "dummy_topic",
			subscriptionDialogActive: false
		};

		this.state.connectionManager.setupConnection(props.connection);
	}

	componentWillMount() {
		this.doSubscribe("root/" + this.state.currentTopic + "/#");
	}

	componentWillUnmount() {
		this.doUnsubscribe("root/" + this.state.currentTopic + "/#");
	}

	renderSubscriptionPicker() {
		if (!this.state.subscriptionDialogActive) {
			return (
				<div>
					<p>Current topic: {this.state.currentTopic}</p>
					<Button onClick={this.handleActivateDialog}>Switch Channel</Button>
				</div>
				);
		}

		return (
			<Modal.Dialog>
				<Modal.Header>
					<Modal.Title>Choose a Chat Room</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Current topic: {this.state.currentTopic}</p>
					<TextFieldWrapper
						enabled="true"
						label="New topic:"
						value={this.state.topicInputText}
						onSubmit={this.handleGotoChatroom}
						onChange={this.handleTopicInputChange}
						/>
				</Modal.Body>
				<Modal.Footer>
					<ButtonToolbar>
						<Button
							key="cancel"
							onClick={this.handleDismissDialog}>
							Cancel
						</Button>
						<Button
							key="ok"
							onClick={this.handleGotoChatroom}
							bsStyle="primary">
							Go
						</Button>
					</ButtonToolbar>
				</Modal.Footer>
			</Modal.Dialog>
			);
	}

	render() {
		return (
			<div>
				{this.renderSubscriptionPicker()}
				<MessageList
					messages={this.state.messages}
					onSendMessage={this.handleSendMessage}
					/>
			</div>
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
		var topicParts = topic.split('/');
		var username = topicParts[topicParts.length - 1];
		var messageProps = {
			topic: topic,
			text: message.message,
			name: username
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
		var time = Math.round((new Date()).getTime() / 1000);
		var message = {clientTime: time, message: text, iconUrl: imageUrl};
		var topic = "root/" + this.state.currentTopic + "/" + this.props.username;
		this.setState((prevState) => {
			this.doPublish(topic, JSON.stringify(message));
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

	handleTopicInputChange = (newValue) => {
		this.setState(update(this.state, {
			topicInputText: {$set: newValue}
		}));
	}

	handleDismissDialog = () => {
		this.setState(prevState => update(prevState, {
			subscriptionDialogActive: {$set: false}
		}));
	}

	handleGotoChatroom = () => {
		this.doUnsubscribe("root/" + this.state.currentTopic + "/#");
		this.doSubscribe("root/" + this.state.topicInputText + "/#");
		this.setState(prevState => update(prevState, {
			currentTopic: {$set: prevState.topicInputText}
		}));
		this.handleDismissDialog();
	}

	handleActivateDialog = () => {
		this.setState(update(this.state, {
			subscriptionDialogActive: {$set: true}
		}));
	}

}

export default MainView;





