import "./App.css";
import React from "react";

import { BrowserRouter, Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { history } from "../redux/configureStore";

import PostList from "../pages/PostList";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import PostWrite from "../pages/PostWrite";
import PostDetail from "../pages/PostDetail";
import Notification from "../pages/Notification";
import Required from "../pages/Required";
import Search from "./Search";

import Header from "../components/Header";
import { Grid, Button } from "../elements";

import styled from "styled-components";
import { TiPlus } from "react-icons/ti";
import Permit from "../shared/Permit";

import { useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

import { apiKey } from "./firebase";

function App() {
  const dispatch = useDispatch();

  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  React.useEffect(() => {
    if (is_session) {
      dispatch(userActions.loginCheckFB());
    }
  }, []);

  return (
    <React.Fragment>
      <Grid>
        <Header></Header>
        <ConnectedRouter history={history}>
          <Route path="/" exact component={PostList} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/write" exact component={PostWrite} />
          <Route path="/write/:id" exact component={PostWrite} />
          <Route path="/post/:id" exact component={PostDetail} />
          <Route path="/noti" exact component={Notification} />
          <Route path="/search" exact component={Search} />
          <Route path="/required" exact component={Required} />
        </ConnectedRouter>
        <Permit>
          <Button
            is_add
            _onClick={() => history.push("/write")}
            btnColor="#686ef3"
          >
            <Plus />
          </Button>
        </Permit>
      </Grid>
    </React.Fragment>
  );
}

const Plus = styled(TiPlus)`
  font-size: 28px;
`;

export default App;
