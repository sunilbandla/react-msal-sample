import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AuthService from './services/auth.service';
import GraphService from './services/graph.service';

class App extends Component {
  constructor() {
    super();
    this.authService = new AuthService();
    this.graphService = new GraphService();
    this.state = {
      user: null,
      userInfo: null,
      apiCallFailed: false,
      loginFailed: false
    };
  }
  componentWillMount() {}

  callAPI = () => {
    this.setState({
      apiCallFailed: false
    });
    this.authService.getToken().then(
      token => {
        this.graphService.getUserInfo(token).then(
          data => {
            this.setState({
              userInfo: data
            });
          },
          error => {
            console.error(error);
            this.setState({
              apiCallFailed: true
            });
          }
        );
      },
      error => {
        console.error(error);
        this.setState({
          apiCallFailed: true
        });
      }
    );
  };

  logout = () => {
    this.authService.logout();
  };

  login = () => {
    this.setState({
      loginFailed: false
    });
    this.authService.login().then(
      user => {
        if (user) {
          this.setState({
            user: user
          });
        } else {
          this.setState({
            loginFailed: true
          });
        }
      },
      () => {
        this.setState({
          loginFailed: true
        });
      }
    );
  };

  render() {
    let templates = [];
    if (this.state.user) {
      templates.push(
        <div key="loggedIn">
          <button onClick={this.callAPI} type="button">
            Call Graph's /me API
          </button>
          <button onClick={this.logout} type="button">
            Logout
          </button>
          <h3>Hello {this.state.user.name}</h3>
        </div>
      );
    } else {
      templates.push(
        <div key="loggedIn">
          <button onClick={this.login} type="button">
            Login with Microsoft
          </button>
        </div>
      );
    }
    if (this.state.userInfo) {
      templates.push(
        <pre key="userInfo">{JSON.stringify(this.state.userInfo, null, 4)}</pre>
      );
    }
    if (this.state.loginFailed) {
      templates.push(<strong key="loginFailed">Login unsuccessful</strong>);
    }
    if (this.state.apiCallFailed) {
      templates.push(
        <strong key="apiCallFailed">Graph API call unsuccessful</strong>
      );
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React app with MSAL.js</h1>
        </header>
        {templates}
      </div>
    );
  }
}

export default App;
