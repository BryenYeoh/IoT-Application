import React, { Component } from 'react';
import { IoIosAnalytics, IoIosTimer } from 'react-icons/io';
import { Link } from 'react-router-dom';

class Nav extends Component {
  state = {
    selectedTab: 'insights',
  };

  selectTab = (tab) => {
    this.setState({ selectedTab: tab });
  };

  render() {
    const { selectedTab } = this.state;
    return (
      <div className="bg-slate-900 text-white flex justify-around items-center p-4 fixed bottom-0 w-full">
        <Link 
          to="/insights"
          className={`flex items-center p-2 ${selectedTab === 'insights' ? 'bg-gray-300 text-slate-900' : ''}`}
          onClick={() => this.selectTab('insights')}
        >
          <IoIosAnalytics className="mr-2" />
          Insights
        </Link>
        <Link 
          to="/session"
          className={`flex items-center p-2 ${selectedTab === 'session' ? 'bg-gray-300 text-slate-900' : ''}`}
          onClick={() => this.selectTab('session')}
        >
          <IoIosTimer className="mr-2" />
          Session
        </Link>
      </div>
    );
  }
}

export default Nav;