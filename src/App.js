import React, { Component } from 'react';
import { Route } from 'react-router-dom';

// Routes
import { routes } from './routes';

class App extends Component {
  render() {
    return (
      <div className="dappTx">
        { routes.map((route) => (
          <Route key={route.path} {...route} />
        ) ) }
      </div>
    );
  }
}

export default App;
