import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";
import logger from "redux-logger";

// reducer
import User from "./modules/user";
import Post from "./modules/post";
import Image from "./modules/image";

// store에 history 넣어주기  : 리덕스에서 사용하기 위함 > roothistory 에 넣어줌
export const history = createBrowserHistory();

const rootReducer = combineReducers({
  user: User,
  post: Post,
  image: Image,
  // 만든 history와 router가 연결이 되고 store에 브라우저히스토리 같은게 다 저장된다.
  router: connectRouter(history),
});

// 미들웨어 , 사용할 미들웨어를 하나씩 넣어준다.
// 미들웨어도 .then에서 쓴다는게 액션 생성자에서 쓸것..액션 실행 > 미들웨어 (외부api요청,, setTimeout 등 비동기 작업) > 리듀서
// 히스토리 또한 미들웨어 thunk에서 할 것

const middlewares = [thunk.withExtraArgument({ history: history })];
// 개발환경 Vite 공식문서 참고
const env = import.meta.env.DEV;

// 개발환경에서만 로거쓰기
if (env) {
  // 미들웨어에  push logger
  middlewares.push(logger);
}

// 크롬 확장 프로그램, redux devTools
const composeEnhancers =
  // && 이전 : 자바스크립트는 v8 환경이면 무조건 돌아간다. 지금 이 환경이 브라우저일 때만 돌려줘라
  // && 이후 : redux devTools 설치되어있으면 열어줘라
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

// 미들웨어 묶기
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

// make store
// 기본 스토어 받아서 createStore로 rootReducer, enhancer(묶은 미들웨어) 스토어 만들어준다.
let store = (initialStore) => createStore(rootReducer, enhancer);

export default store();
