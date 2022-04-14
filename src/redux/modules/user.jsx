// action, reducer 편하게 만들어줌
import { createAction, handleActions } from "redux-actions";
// 불면성 관리 편하게 해줌
import { produce } from "immer";

import { setCookie, getCookie, deleteCookie } from "../../shared/Cookie";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { authService } from "../../shared/firebase";

// actions
const LOG_IN = "LOG_IN";
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SET_USER";

// action creators
// const logIn = createAction(LOG_IN, (user) => ({ user }));
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));

// initialState
const initialState = {
  user: null,
  is_login: false,
};

const user_initial = {
  user_name: "Kelly",
};
// middleware actions
// const loginAction = (user) => {
//   return function (dispatch, getState, { history }) {
//     console.log(history);
//     dispatch(setUser(user));
//     history.push("/");
//   };
// };

const loginFB = (id, pwd) => {
  return function (dispatch, getState, { history }) {
    const auth = getAuth();
    // login 정보 session에 저장하기
    setPersistence(auth, browserSessionPersistence).then(() => {
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.

      signInWithEmailAndPassword(auth, id, pwd)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("login user", user);

          dispatch(
            setUser({
              user_name: user.displayName,
              id: id,
              user_profile: "",
              uid: user.uid,
            })
          );
          history.push("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("인증상태 지속성 수정 ", errorCode, errorMessage);
        });
      return signInWithEmailAndPassword(auth, email, password);
    });
  };
};

const signupFB = (id, pwd, user_name) => {
  return function (dispatch, getState, { history }) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, id, pwd)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        // Signed in
        // update profile

        updateProfile(auth.currentUser, {
          displayName: user_name,
        })
          .then(() => {
            // Profile updated!
            dispatch(
              setUser({
                user_name: user_name,
                id: id,
                user_profile: "",
                uid: user.uid,
              })
            );
            history.push("/");
          })
          .catch((error) => {
            // An error occurred
            console.log(error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Sign up error~", errorCode, errorMessage);
        // ..
      });
  };
};

// https://firebase.google.com/docs/auth/web/manage-users#web-version-9
// 유저 있는지 없는지 확인
const loginCheckFB = () => {
  return function (dispatch, getState, { history }) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        dispatch(
          setUser({
            user_name: user.displayName,
            id: user.id,
            user_profile: "",
            uid: user.uid,
          })
        );
      } else {
        // User is signed out
        dispatch(logOut());
      }
    });
  };
};

const logoutFB = () => {
  return function (dispatch, getState, { history }) {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(logOut());
        history.replace("/");
      })
      .catch((error) => {
        console.log("로그아웃 에러 !");
      });
  };
};
// reducer
export default handleActions(
  {
    // produce , state (원본값) draft 복사값 > 복사값으로 알아서 함수안 코드 실행
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        setCookie("is_login", "success");
        draft.user = action.payload.user;
        draft.is_login = true;
      }),
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {
        deleteCookie("is_login");
        draft.user = null;
        draft.is_login = false;
      }),
    [GET_USER]: (state, action) => produce(state, (draft) => {}),
  },
  initialState
);

// export action creator
const actionCreators = {
  logOut,
  getUser,
  loginFB,
  logoutFB,
  signupFB,
  loginCheckFB,
};

export { actionCreators };
