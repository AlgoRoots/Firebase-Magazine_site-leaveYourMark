import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";
import logger from "redux-logger";

// reducer
import User from "./modules/user";
import Post from "./modules/post";
import Image from "./modules/image";
import Comment from "./modules/comment";
import Like from "./modules/like";

export const history = createBrowserHistory();

const rootReducer = combineReducers({
  user: User,
  post: Post,
  image: Image,
  comment: Comment,
  like: Like,
  router: connectRouter(history),
});

const middlewares = [thunk.withExtraArgument({ history: history })];
// 개발환경 Vite 공식문서 참고
const env = import.meta.env.DEV;

if (env) {
  middlewares.push(logger);
}

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;
const enhancer = composeEnhancers(applyMiddleware(...middlewares));
let store = (initialStore) => createStore(rootReducer, enhancer);

export default store();
