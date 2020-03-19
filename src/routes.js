import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './pages/home';
import About from './pages/details';
import Login from './pages/login';

const Routes = () => (
    <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about/:id" component={About} />
          <Route exact path="/login" component={Login} />
        </Switch>
    </BrowserRouter>
);

export default Routes;