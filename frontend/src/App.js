import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GamePage from './pages/GamePage';
import AdminPage from './pages/AdminPage';
import StatsPage from './pages/StatsPage';
import PreviousGamePage from './pages/PreviousGamePage';

const App = () => {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/game" component={GamePage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/stats" component={StatsPage} />
      <Route path="/previous-game" component={PreviousGamePage} />
      <Redirect from="/" to="/login" />
    </Switch>
  );
};

export default App;
