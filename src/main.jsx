import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./shared/App";

// store 가져오기
import store from "./redux/configureStore";
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
