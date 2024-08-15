import React, { Component } from 'react';
import Dashboard from '../../Dashboard';

class Insights extends Component {
  render() {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Insights</h1>
        <Dashboard />
      </div>
    );
  }
}

export default Insights;
