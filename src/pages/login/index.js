import React, { Component } from 'react';
import api from '../../services/api';

import './styles.css';

export default class login extends Component {
  state = {
    title: 'Login',
    type: 'Create account',
    token: ''
  }

  componentDidMount() {
    this.requestToken();
  }

  requestToken = async () => {
    const response = await api.get(`authentication/token/new?api_key=3a67ead232de4194120586c937d412a8`);
    const {request_token} = response.data;
    this.setState({ token: request_token });
  }

  requestLogin = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    api.post('https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=3a67ead232de4194120586c937d412a8', {
      username: email,
      password: password,
      request_token: this.state.token
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  ChangeType = () => {
    var title = this.state.title;
    var type = '';

    if(title === 'Login'){
      title = 'Create account';
      type = 'Sign In';
    }else {
      title = 'Login';
      type = 'Create account';
    }
    this.setState({
      title,
      type
    })
  }

  render() {
    return (
        <div id="login">
          <div id="loginContent">
            <h2>{this.state.title}</h2>
            
            <div>
              <label>Email</label>
              <input type="text" id="email" name="email" placeholder="exemple@exemple.com" />
            </div>
            <div>
              <label>Password</label>
              <input type="password" id="password" name="password" />
            </div>

            <button onClick={this.requestLogin}>Send</button>
            
            <p onClick={this.ChangeType}>{this.state.type}</p>

          </div>
        </div>
    );
  }
}
