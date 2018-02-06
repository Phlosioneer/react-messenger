import React from 'react';
import ConnectionView from './ConnectionView.jsx';
import MainView from './MainView.jsx';
import update from 'immutability-helper';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isConnected: false,
			connection: null,
			username: ""
		};
	}

	render() {
		if (this.state.isConnected) {
			return (
				<MainView
			   		onDisconnect={this.handleDisconnect}
					connection={this.state.connection}
					username={this.state.username}
					/>
				);
		} else {
			return (
				<ConnectionView
					onConnect={this.handleConnect}
					/>
				);
		}
	}

	componentDidMount() {
		window.addEventListener("beforeunload", this.handleDisconnect);
	}

	componentWillUnmount() {
		window.removeEventListener("beforeunload", this.handleDisconnect);
	}

	handleConnect = (connection, username) => {
		this.setState(update(this.state, {
			isConnected: {$set: true},
			connection: {$set: connection},
			username: {$set: username}
		}));
	}

	handleDisconnect = () => {
		this.setState(update(this.state, {
			isConnected: {$set: false},
			connection: {$set: null}
		}));
	}
}

export default App;
