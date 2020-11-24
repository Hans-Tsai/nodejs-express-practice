import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Vacations from './Vacation';

function Home() {
  return (
  <div>
    <h2>Welcome to Meadowlark Travel</h2>
    <ul>
      <li>Check out our "<Link to="/about">About</Link>" page!</li>
      <li>And our <Link to="/vacations">vacations</Link>!</li>
    </ul>
  </div>
  )
};

function About() {
  return (<i>coming soon</i>)
};

function Notfound() {
  return (<i>Not Found</i>)
};

function App() {
  return (
    <Router>
      <div className="container">
        <header>
          <h1>Meadowlark Travel</h1>
          <Link to="/"><img src={logo} alt="Meadowlark Travel Logo" /></Link>
        </header>
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/about" exact component={About}></Route>
          <Route path="/vacations" exact component={Vacations}></Route>
          <Route component={Notfound}></Route>
        </Switch>
      </div>
    </Router>
  )
};

export default App;