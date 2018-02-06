import React from 'react';
import update from 'immutability-helper';
import Mqtt from 'mqtt';
import {FormControl, ControlLabel, FormGroup,
	Button, Alert, ProgressBar, Modal} from 'react-bootstrap';
import SignInForm from './SignInForm.jsx'


class ConnectionView extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			isConnecting: false,
			serverName: "mqtt.bucknell.edu:9001",
			username: "username",
			connection: null
		};
	}

	renderLoading() {
		if (this.state.isConnecting) {
			return (
				<Alert bsStyle="info">
					Connecting to server...
					<ProgressBar active now={100}/>
				</Alert>
				);
		} else {
			return "";
		}
	}

	renderCancelButton() {
		if (this.state.isConnecting) {
			return (
				<Button onClick={this.handleCancel}>Cancel Connection</Button>
				);
		} else {
			return "";
		}
	}

	render() {
		return (
			<Modal.Dialog>
				<Modal.Header>
					<Modal.Title>
						Connect to a server
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<SignInForm
						enabled={!this.state.isConnecting}
						serverName={this.state.serverName}
						username={this.state.username}
						onSubmit={this.handleConnect}
						onChange={this.handleChange}
						/>
				</Modal.Body>
				<Modal.Footer>
					{this.renderCancelButton()}
					<Button
						bsStyle="primary"
						onClick={this.handleConnect}
						disabled={this.state.isConnecting}>
							Connect
					</Button>
					
					{this.renderLoading()}
				</Modal.Footer>
			</Modal.Dialog>
		);
	}
	
	handleChange = (values) => {
		this.setState(update(this.state, {
			serverName: {$set: values.serverName},
			username: {$set: values.username}
		}));
	}

	correctServerName(name) {
		// TODO: Make this check better.
		if (!name.toLowerCase().includes("://")) {
			return "ws://" + name;
		} else {
			return name;
		}
	}

	handleConnect = (e) => {
		// This prevents the page-reload when called through onSubmit.
		if (e) {
			e.preventDefault();
		}

		// Note: setState ensures `this` is bound correctly.
		this.setState((prevState) => {
			var serverName = prevState.serverName;
			
			// Check that the server name has the right prefix.
			// TODO: Display the full, corrected server name
			serverName = this.correctServerName(serverName); 
			
			var client = Mqtt.connect(serverName);
			client.on('connect', this.handleSuccessfulConnect);
			client.on('error', this.handleFailedConnect);		

			return update(this.state, {
				isConnecting: {$set: true},
				connection: {$set: client}
			});
		});
	}

	handleSuccessfulConnect = () => {
		var connection = this.state.connection;
		
		// Unregister event listeners.
		connection.removeListener('connect', this.handleSuccessfulConnect);
		connection.removeListener('error', this.handleFailedConnect);

		// Reset this component.
		this.setState(update(this.state, {
			isConnecting: {$set: false},
			connection: {$set: null}
		}));
		
		// Pass the connection up to the parent.
		this.props.onConnect(connection, this.state.username);
	}

	handleFailedConnect = (error) => {
		// TODO: Make this nicer. There is NO documentation about the form of the error object,
		// or what errors are possible.
		this.handleCancel();
		throw error;
	}

	// TODO: When the user clicks the cancel button, call connection.end(false) with a callback, and display
	// "cancelling...". Then, when the callback occurs, reset. If cancel is clicked again while "cancelling..."
	// then call connection.end(true) and reset.
	handleCancel = () => {
		this.setState((prevState) => {
			this.state.connection.end(true);
			return update(prevState, {
				isConnecting: {$set: false},
				connection: {$set: null}
			});
		});
	}
}


export default ConnectionView;


