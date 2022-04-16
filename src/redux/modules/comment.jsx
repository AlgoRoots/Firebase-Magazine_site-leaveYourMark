import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore } from "../../shared/firebase";
import "moment";
import moment from "moment";

import firebase from "firebase/app";
import { actionCreators as postActions } from "./post";

const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";

const LOADING = "LOADING";

const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({
  post_id,
  comment_list,
}));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({
  post_id,
  comment,
}));

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
  list: {},
  is_loading: false,
};

// 댓글 추가
const addCommentFB = (post_id, contents) => {
  return function (dispatch, getState, { history }) {
    /// FB 문법 /////
    const commentDB = firestore.collection("comment");
    const user_info = getState().user.user;

    // comment 하나에 대해 fb에 보낼 정보
    let comment = {
      post_id: post_id,
      user_id: user_info.uid,
      user_name: user_info.user_name,
      user_profile: user_info.user_profile,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    // firestore에 코멘트 정보 넣기
    commentDB.add(comment).then((doc) => {
      const postDB = firestore.collection("post");
      comment = { ...comment, id: doc.id };
      // 포스트에 댓글 개수 업데이트 >
      const post = getState().post.list.find((l) => l.id === post_id);
      // 댓글 개수 업데이트 : firebase 문법
      // comment_cnt+ 1
      const increment = firebase.firestore.FieldValue.increment(1);

      // comment에 id 넣기

      postDB
        .doc(post_id)
        // 그 post를 잘 찾았으면 comment +1 업데이트
        .update({ comment_cnt: increment })
        .then((_post) => {
          // 댓글작성 성공, post 게시물도 업데이트에 성공하면
          // 페이지에 comment 추가해라

          dispatch(addComment(post_id, comment));

          // 댓글 개수 넘겨주기
          // 리덕스에 post가 있을 때만 post의 comment_cnt를 +1해줌. FB는 위에서 해준거고, 밑은 현재 유저가 보고있는
          // 댓글 수 이기 때문에 리덕스값만 보낸다.
          if (post) {
            dispatch(
              // post 하나에대한 수정 : comment + 1
              postActions.editPost(post_id, {
                // 묵시적 형변환 방지, parseInt로 바로 숫자로 바꿔준다.
                comment_cnt: parseInt(post.comment_cnt) + 1,
              })
            );
          }
        });
    });
  };
};

// 댓글 가져오기
// 게시글 id와, 작성 일시 역순으로 정렬해서 가져오기
const getCommentFB = (post_id = null) => {
  return function (dispatch, getState, { history }) {
    // post_id가 없으면 바로 리턴!

    if (!post_id) return;
    const commentDB = firestore.collection("comment");

    commentDB
      .where("post_id", "==", post_id)
      .orderBy("insert_dt", "desc")
      .get()
      .then((docs) => {
        let list = [];
        docs.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });
        //   가져온 데이터를 넣어주자!
        dispatch(setComment(post_id, list));
      })
      .catch((err) => {
        console.log("댓글 가져오기 실패!", post_id, err);
      });
  };
};

export default handleActions(
  {
    [SET_COMMENT]: (state, action) =>
      produce(state, (draft) => {
        // post_id
        // let data = {[post_id] : com_list,....} key :value 형태
        draft.list[action.payload.post_id] = action.payload.comment_list;
      }),
    [ADD_COMMENT]: (state, action) =>
      produce(state, (draft) => {
        draft.list[action.payload.post_id].unshift(action.payload.comment);
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
  },
  initialState
);

const actionCreators = {
  getCommentFB,
  setComment,
  addComment,
  addCommentFB,
};

export { actionCreators };
