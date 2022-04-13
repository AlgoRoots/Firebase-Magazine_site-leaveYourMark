import React, { useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { ConnectedRouter } from "connected-react-router";
import { history } from "../redux/configureStore";
import "./App.css";

import PostList from "../pages/PostList";
import Login from "../pages/Login";
import Header from "../components/Header";
import { Grid } from "../elements";
import Signup from "../pages/Signup";

function App() {
  const [count, setCount] = useState(0);

  return (
    <React.Fragment>
      <Grid>
        <Header></Header>
        <ConnectedRouter history={history}>
          <Route path="/" exact component={PostList}></Route>
          <Route path="/login" exact component={Login}></Route>
          <Route path="/signup" exact component={Signup}></Route>
        </ConnectedRouter>
      </Grid>
    </React.Fragment>
  );
}

export default App;
