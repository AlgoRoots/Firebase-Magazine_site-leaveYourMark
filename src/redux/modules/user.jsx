import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

import { setCookie, getCookie, deleteCookie } from "../../shared/Cookie";

import { auth } from "../../shared/firebase";
import firebase from "firebase/app";

// actions
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SET_USER";

// action creators
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));

// initialState
const initialState = {
  user: null,
  is_login: false,
};

// middleware actions
const loginFB = (id, pwd) => {
  return function (dispatch, getState, { history }) {
    ///////// 이후 FB 문법 변경 ///////////

    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then((res) => {
      // auth.signInWithEmailAndPassword()로 로그인
      auth
        .signInWithEmailAndPassword(id, pwd)
        .then((user) => {
          console.log("user id, pw 잘 받아왔어요 ", user);
          // setUser 통해 리덕스 정보 업데이트, 리듀서 보면 is_login = true 추가시켜 업데이트
          dispatch(
            setUser({
              user_name: user.user.displayName,
              id: id,
              user_profile: "",
              uid: user.user.uid,
            })
          );

          history.push("/");
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;

          console.log(errorCode, errorMessage);
        });
    });
  };
};

const signupFB = (id, pwd, user_name) => {
  return function (dispatch, getState, { history }) {
    ///////// 이후 FB 문법 변경 ///////////

    auth
      // createUserWithEmailAndPassword 로 가입시키기, id pwd 사용
      .createUserWithEmailAndPassword(id, pwd)
      .then((user) => {
        // console.log(user);

        auth.currentUser
          .updateProfile({
            // user_name 업데이트
            displayName: user_name,
          })
          .then(() => {
            dispatch(
              setUser({
                // id, pwd, user_name까지 다 잘 받아왔다면 setUser로 아래 정보 넘겨준다.
                user_name: user_name,
                id: id,
                user_profile: "",
                uid: user.user.uid,
              })
            );
            // 메인페이지 이동
            history.push("/");
          })
          .catch((error) => {
            console.log(
              "id, pwd까지 받아왔는데, updateProfile 이후로 안된 상태? ",
              error
            );
          });
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log("id, pwd 잘 받아오지 못함!?!");
        console.log(errorCode, errorMessage);
      });
  };
};

const loginCheckFB = () => {
  return function (dispatch, getState, { history }) {
    ///////// 이후 FB 문법 변경 ///////////
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(
          setUser({
            user_name: user.displayName,
            user_profile: "",
            id: user.email,
            uid: user.uid,
          })
        );
      } else {
        dispatch(logOut());
      }
    });
  };
};

const logoutFB = () => {
  return function (dispatch, getState, { history }) {
    ///////// 이후 FB 문법 변경 ///////////
    // firebase에서 제공하는 signOut()함수 씀
    auth.signOut().then(() => {
      dispatch(logOut());
      history.replace("/");
    });
  };
};

// reducer
// 불변성 유지해주는 immer 설치해 사용
export default handleActions(
  {
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        // is_login 쿠키 저장 , 가져온 user 정보 initialState에 업데이트 ,is_login = true 로 업데이트
        setCookie("is_login", "success");
        draft.user = action.payload.user;
        draft.is_login = true;
      }),
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {
        // is_login 쿠키 삭제  , 가져온 user 정보 initialState에 null 로 비워줌, is_login = false 로 업데이트
        deleteCookie("is_login");
        draft.user = null;
        draft.is_login = false;
      }),
    [GET_USER]: (state, action) => produce(state, (draft) => {}),
  },
  initialState
);

// action creator export
const actionCreators = {
  logOut,
  getUser,
  signupFB,
  loginFB,
  loginCheckFB,
  logoutFB,
};

export { actionCreators };
