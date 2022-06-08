import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Failure from "../components/failure";
import MainApp from "../components/payment";
import Success from "../components/success";

class MyRoutes extends React.Component {
  render() {
    return (
      <div>
        <Router>
            <Switch>
              <Route path="/" exact component={MainApp} />
              <Route path="/success" component={Success} />
              <Route path="/failure" component={Failure} />
            </Switch>
        </Router>
      </div>
    );
  }
}
export default MyRoutes;