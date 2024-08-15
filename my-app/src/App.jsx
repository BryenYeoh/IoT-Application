import { Component } from "react";
import { Navigate, BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Topbar from "./components/UI/Topbar";
import Nav from "./components/UI/Nav";
import Insights from "./components/Main/Insights";
import Session from "./components/Main/Session";
import { PerclosScoreProvider } from "./components/CV/PerclosScoreContext";
import FailSession from "./components/Main/FailSession";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: null,
    };
  }

  render() {
    return (
      <>

        <PerclosScoreProvider>
          <Topbar />
          <div className="flex flex-col pt-16 pb-16 min-h-screen">
            {" "}
            {/* Added flex and min-h-screen */}
            <div className="flex-grow flex">
            <Routes>
                <Route path="*" element={<Navigate to="/insights" />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/session" element={<Session />} />
                <Route
                  path="/fail"
                  element={
                    <FailSession
                      handleClick={() => {
                        console.log("hell");
                      }}
                    />
                  }
                />
              </Routes>
            </div>
          </div>
          <Nav />
        </PerclosScoreProvider>
      </>
    );
  }
}

export default App;
