import React from 'react';
import './ConnectionView.css';
import update from 'immutability-helper';
import Mqtt from 'mqtt';

class ServerChoiceField extends React.Component {
	render() {
		return (
			<div>
				<input
					type="text"
					value={this.props.value}
					placeholder="mqtt.server.com:port_number"
					onInput={this.handleOnChange}
					enabled={this.props.enabled.toString()}

					// onChange is set to silence a runtime warning; React doesn't understand onInput.
					onChange={() => null}
					/>
			</div>
		);
	}

	handleOnChange = (e) => {
		this.props.onChange(e.target.value);
	}
}

class ConnectionView extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			isConnecting: false,
			serverName: "mqtt.bucknell.edu:9001",
			connection: null
		};
	}

	renderLoading() {
		if (this.state.isConnecting) {
			return (
				<div>
					Connecting to server...
					<div className="loader">Loading Graphic</div>
				</div>
				);
		} else {
			return "";
		}
	}

	renderCancelButton() {
		if (this.state.isConnecting) {
			return (
				<button onClick={this.handleFailedConnect}>Cancel Connection</button>
				);
		} else {
			return "";
		}
	}

	render() {
		return (
			<div>
				<div>
					<ServerChoiceField 
						value={this.state.serverName}
						onChange={this.handleServerChange}
						enabled={!this.state.isConnecting}
					/>
					<button onClick={this.handleConnect}>Connect</button>
					{this.renderCancelButton()}
				</div>
				{this.renderLoading()}
			</div>
		);
	}
	
	handleServerChange = (newValue) => {
		this.setState((prevState) => {
			if (prevState.isConnecting) {
				throw "Can't change server name while connecting to a server";
			}

			return update(prevState, {
				serverName: {$set: newValue}
			});
		});	
	}

	correctServerName(name) {
		if (!name.toLowerCase().startsWith("ws://")) {
			return "ws://" + name;
		} else {
			return name;
		}
	}

	handleConnect = (newValue) => {
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
		this.props.onConnect(connection);
	}

	// TODO: When the user clicks the cancel button, call connection.end(false) with a callback, and display
	// "cancelling...". Then, when the callback occurs, reset. If cancel is clicked again while "cancelling..."
	// then call connection.end(true) and reset.
	handleFailedConnect = (error) => {
		// TODO: Make this nicer. There is NO documentation about the form of the error object,
		// or what errors are possible.
		this.state.connection.end(true);
		this.setState(update(this.state, {
			isConnecting: {$set: false},
			connection: {$set: null}
		}));
		throw error;
	}
}


export default ConnectionView;


