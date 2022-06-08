import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, realtime } from "../../shared/firebase";
import moment from "moment";

import firebase from "firebase/app";

import { actionCreators as postActions } from "./post";

const SET_LIKE = "SET_LIKE";
const ADD_LIKE = "ADD_LIKE";
const UNDO_LIKE = "UNDO_LIKE";

const setLike = createAction(SET_LIKE, (post_id, user_list) => ({
  post_id,
  user_list,
}));
const addLike = createAction(ADD_LIKE, (post_id, user_id) => ({
  post_id,
  user_id,
}));

const undoLike = createAction(UNDO_LIKE, (post_id, user_id) => ({
  post_id,
  user_id,
}));

const initialState = {
  list: {},
};

const addLikeFB = (post_id) => {
  return function (dispatch, getState, { history }) {
    const likeDB = firestore.collection("like");
    const user_info = getState().user.user;
    let like = {
      post_id: post_id,
      user_id: user_info.uid,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
      user_name: user_info.user_name,
    };
    likeDB.add(like).then((doc) => {
      const postDB = firestore.collection("post");
      like = { ...like, id: doc.id };
      const post = getState().post.list.find((l) => l.id === post_id);
      const increment = firebase.firestore.FieldValue.increment(1);

      postDB
        .doc(post_id)
        .update({ like_cnt: increment })
        .then((_post) => {
          dispatch(addLike(post_id, user_info.uid));

          if (post) {
            dispatch(
              postActions.editPost(post_id, {
                like_cnt: parseInt(post.like_cnt) + 1,
              })
            );
          }
        });
    });
  };
};

const undoLikeFB = (post_id) => {
  return function (dispatch, getState, { history }) {
    const likeDB = firestore.collection("like");
    const user_info = getState().user.user;
    likeDB
      .where("post_id", "==", post_id)
      .where("user_id", "==", user_info.uid)
      .get()
      .then((docs) => {
        let id = "";
        docs.forEach((doc) => (id = doc.id));
        likeDB
          .doc(id)
          .delete()
          .then(() => {
            const postDB = firestore.collection("post");
            const post = getState().post.list.find((l) => l.id === post_id);
            const decrement = firebase.firestore.FieldValue.increment(-1);

            postDB
              .doc(post_id)
              .update({ like_cnt: decrement })
              .then((_post) => {
                dispatch(undoLike(post_id, user_info.uid));
                if (post) {
                  if (parseInt(post.like_cnt) === 0) return;

                  dispatch(
                    postActions.editPost(post_id, {
                      like_cnt: parseInt(post.like_cnt) - 1,
                    })
                  );
                }
              });
          });
      })
      .catch((err) => {
        console.log("좋아요 취소 오류 ", err);
      });
  };
};

const getLikeFB = (post_id) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      return;
    }

    const likeDB = firestore.collection("like");

    likeDB
      .where("post_id", "==", post_id)
      .get()
      .then((docs) => {
        let user_list = [];
        docs.forEach((doc) => {
          user_list.push(doc.data().user_id);
        });
        dispatch(setLike(post_id, user_list));
      })
      .catch((error) => {
        console.log("해당 포스트의 좋아요 정보를 가져올 수 없음", error);
      });
  };
};

export default handleActions(
  {
    [SET_LIKE]: (state, action) =>
      produce(state, (draft) => {
        draft.list[action.payload.post_id] = action.payload.user_list;
      }),
    [ADD_LIKE]: (state, action) =>
      produce(state, (draft) => {
        draft.list[action.payload.post_id].push(action.payload.user_id);
      }),
    [UNDO_LIKE]: (state, action) =>
      produce(state, (draft) => {
        draft.list[action.payload.post_id] = draft.list[
          action.payload.post_id
        ].filter((user_id) => user_id !== action.payload.user_id);
      }),
  },
  initialState
);

const actionCreators = {
  getLikeFB,
  addLikeFB,
  undoLikeFB,
};

export { actionCreators };
