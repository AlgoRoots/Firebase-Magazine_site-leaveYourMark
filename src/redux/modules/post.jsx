//redux/modules/post.js

import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { createContext } from "react";
import profile_img from "../../algoroot_profile.jpg";
import { firestore, storage } from "../../shared/firebase";

// 자바스크립트에서 날짜, 시간 객체를 편히 다루기 위한 패키지
import moment from "moment";

import { actionCreators as imageActions } from "./image";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";

// action 생성자 함수

const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));

// 리듀서가 사용할 initialstate
const initialState = {
  list: [],
};

// Post 하나에 대한 들어있는 정보
const initialPost = {
  // id: 0,
  // user_info: {
  //   user_name: "algoroot",
  //   user_profile: profile_img,
  // },
  image_url: profile_img,
  contents: "",
  coment_cnt: 0,
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
  //insert_dt: "2022-04-12 10:00:00",
};

const addPostFB = (contents = "") => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    // getState()는 store에 있는 user 가져옴
    const _user = getState().user.user;

    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };
    const _post = {
      ...initialPost,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    // 업로드한 이미지 작성하기 버튼 누르면 스토어에 저장하기
    const _image = getState().image.preview;
    console.log(_image);
    console.log(typeof _image);

    const _upload = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    // data url로 바뀜 , 이 안에서 add
    _upload.then((snapshot) => {
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          console.log(url);

          return url;
        })
        .then((url) => {
          postDB
            .add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              let post = { user_info, ..._post, id: doc.id, image_url: url };
              dispatch(addPost(post));
              history.replace("/");

              // preview 이미지 다시 null로 해준다. 400x300이미지로 바뀌게
              dispatch(imageActions.setPreview(null));
            })
            .catch((err) => {
              // 실제로는 콘솔만 찍는게 아니라 후처리 작업까지 해줘야된다.
              // 오류시 후처리 작업 해줘야됨 메인페이지가거나, 새로고침하거나..
              window.alert("post 작성 실패!");
              console.log("post 작성 실패!", err);
            });
        })
        .catch((err) => {
          window.alert("이미지 업로드에 문제가 있어요!");
          console.log("이미지 업로드에 문제가 있어요!", err);
        });
    });

    // console.log({ ...user_info, ..._post });
  };

  // 데이터 추가하기
};

const getPostFB = () => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");

    postDB.get().then((docs) => {
      let post_list = [];

      docs.forEach((doc) => {
        // 잘 가져왔나 확인하기! :)
        // 앗! DB에서 가져온 것하고 우리가 Post 컴포넌트에서 쓰는 데이터 모양새가 다르네요!
        // console.log(doc.id, doc.data());

        let _post = doc.data();

        // ['comment_cnt' , 'contents, ...]
        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            if (cur.indexOf("user_") !== -1) {
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        );

        // let _post = {
        //   id: doc.id,
        //   ...doc.data(),
        // };

        // let post = {
        //   id: doc.id,
        //   user_info: {
        //     user_name: _post.user_name,
        //     user_profile: _post.user_profile,
        //     user_id: _post.user_id,
        //   },
        //   image_url: _post.image_url,
        //   contents: _post.contents,
        //   coment_cnt: _post.comment_cnt,
        //   insert_dt: _post.insert_dt,
        // };
        post_list.push(post);
      });

      // 리스트 확인하기!
      // console.log("fbfbfb", post_list);
      dispatch(setPost(post_list));
    });
  };
};

//
const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("게시물 정보가 없어요! ");
      return;
    }
    const _image = getState().image.preview;

    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];
    console.log(_post);

    const postDB = firestore.collection("post");
    if (_image === _post.image_url) {
      postDB
        .doc(post_id)
        .update(post)
        .then((doc) => {
          dispatch(editPost(post_id, { ...post }));
          history.replace("/");
        });
      return;
    } else {
      // 이미지 바꾸기

      const user_id = getState().user.user.uid;
      const _upload = storage
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");

      // data url로 바뀜 , 이 안에서 add
      _upload.then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            console.log(url);

            return url;
          })
          .then((url) => {
            postDB
              .doc(post_id)
              .update({ ...post, image_url: url })
              .then((doc) => {
                dispatch(editPost(post_id, { ...post, image_url: url }));
                history.replace("/");
              });
          })
          .catch((err) => {
            window.alert("이미지 업로드에 문제가 있어요!");
            console.log("이미지 업로드에 문제가 있어요!", err);
          });
      });
    }
  };
};
// reducer
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.post_list;
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
      }),
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

        // spread 쓴 이유 : 이미지 수정 안할 경우, contents만 수정할 경우!
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),
  },
  initialState
);

// action creator export
const actionCreators = {
  setPost,
  addPost,
  getPostFB,
  addPostFB,
  editPostFB,
};

export { actionCreators };
