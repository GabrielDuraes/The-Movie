import React, { Component } from 'react';
import { FaUserAlt } from "react-icons/fa";

import "./styles.css";

export default class Header extends Component {
  render() {
    return (
      <header id="main-header">

        <a href="/" id="logo">
          <img alt="logo the movies" src={process.env.PUBLIC_URL + '/logo512.png'} />
          <p> THE MOVIES</p>
        </a>

        <nav>
          <ul className="menu">
            <li><a href="/login"><FaUserAlt size={13} /> Entrar</a></li>
          </ul>
        </nav>

      </header>
    );
  }
}
