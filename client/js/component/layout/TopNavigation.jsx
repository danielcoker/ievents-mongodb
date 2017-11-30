import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <nav className="navbar navbar-expand-sm navbar-dark fixed-top">
      <div className="container">
        <a href="index.html" className="navbar-brand">
          <strong>Ievents</strong>
        </a>
        <button className="navbar-toggler" data-toggle="collapse" data-target="#navMenu">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ml-auto">
            
            <li className="nav-item">
              <a href="index.html" className="nav-link">Home</a>
            </li>
            <li className="nav-item">
              <a href="centers.html" className="nav-link">Centers</a>
            </li>
            <li className="nav-item">
              {/* <a href="signin.html" className="nav-link">Signin</a> */}
              <Link to="users/login" className="nav-link"> Signin </Link>
            </li>
            <li className="nav-item">
              {/* <a href="#" className="nav-link">Signup</a> */}
              <Link to="/" className="nav-link"> Signup </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
