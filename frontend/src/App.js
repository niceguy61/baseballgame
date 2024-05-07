// frontend/src/App.js
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import GamePage from './pages/GamePage';
import AdminPage from './pages/AdminPage';

const App = () => {
    return (
        <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/game" component={GamePage} />
            <Route path="/admin" component={AdminPage} />
            <Redirect from="/" to="/login" />
        </Switch>
    );
};

export default App;
