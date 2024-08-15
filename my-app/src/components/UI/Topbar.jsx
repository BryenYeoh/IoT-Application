import React, { Component } from "react";
import profile from "../../../src/assets/profile.jpg";

class Topbar extends Component {
  render() {
    const today = new Date();
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = today.toLocaleDateString(undefined, options);

    return (
      <div className="topbar bg-slate-900 text-white flex justify-between items-center p-4 fixed top-0 w-full z-50">
        <div className="flex items-center">
          <img
            src={profile}
            alt="Profile Pic"
            className="w-10 h-10 rounded-full mr-2"
          />
          <div>
            <p className="font-bold text-sm">Welcome, Bryen</p>
          </div>
        </div>
        <div className="text-right border border-white rounded p-1 text-sm font-thin">
          <p>{`Today ${formattedDate}`}</p>
        </div>
      </div>
    );
  }
}

export default Topbar;
