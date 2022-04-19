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
const LOADING = "LOADING";
const DELETE_POST = "DELETE_POST";

// action 생성자 함수

const setPost = createAction(SET_POST, (post_list, paging) => ({
  post_list,
  paging,
}));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));
const deletePost = createAction(DELETE_POST, (post_id) => ({ post_id }));

// 리듀서가 사용할 initialstate
const initialState = {
  list: [],
  // 시작 , 다음 , 가져올 개수
  paging: { start: null, next: null, size: 3 },
  // 지금 로딩중인지
  is_loading: false,
};

// Post 하나에 대한 들어있는 정보
const initialPost = {
  image_url: profile_img,
  contents: "",
  comment_cnt: 0,
  like_cnt: 0,
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
  layout: "default",
};

const addPostFB = (contents = "", layout = "default") => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");

    const _user = getState().user.user;
    // console.log("setUser!!!",_user);

    // getState()는 store에 있는user 가져와준다.
    // setUser로 생성한 session 정보

    // id: "cc@cc.com"
    // uid: "GfqOcoismnVlroqVfxomqd5Sgvo2"
    // user_name: "성혜"
    // user_profile: ""

    // user_info 딕셔너리형태로 user분류하기
    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };

    const _post = {
      // 기존 초기값
      ...initialPost,
      // 포스트 작성시 적은 contents새로 넣어준다.
      contents: contents,
      layout: layout,
      // 생성시 날짜시간
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    // 업로드한 이미지 작성하기 버튼 누르면 스토어에 저장하기
    const _image = getState().image.preview;
    // console.log(_image);
    // console.log(typeof _image);

    ////////////////////////////////////
    ///////// 이후 FB 문법 변경 ///////////
    ////////////////////////////////////

    // firestore storage에서 이미지 가져오기 (firesotre 문자열(string)에서 업로드 )
    // https://firebase.google.com/docs/storage/web/upload-files?hl=ko&authuser=0#web-version-8_3

    const _upload = storage
      // ref(~) 파일 이름 중복 방지 위해 user_id, 현재 시간을 ms로 넣어준다.
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    // data url로 바뀜 , 이 안에서 add
    _upload.then((snapshot) => {
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          // url 잘 만들어졌는지 확인
          // console.log(url);
          return url;
        })
        .then((url) => {
          // return 된  url 잘 들어왔는지 확인
          // console.log(url);

          // firebase "post" DB에 정보 넣기
          postDB
            .add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              // 성공시 > 아이디 추가
              let post = { user_info, ..._post, id: doc.id, image_url: url };
              // 가공한 post 데이터 addPost()해준다.
              dispatch(addPost(post));
              history.replace("/");

              // preview 이미지 다시 null로 해준다.(400x300이미지로)
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
};

// ###### ISSUE : 4-3 데이터가 한 개가 적게 나오는 오류 ######### //
const getPostFB = (start = null, size = 3) => {
  return function (dispatch, getState, { history }) {
    // 시작정보가 기록되었는데 다음 가져올 데이터가 없다면? 리스트가 끝남.
    // 그럼 아무것도 하지말고 return!
    let _paging = getState().post.paging;
    if (_paging.start && !_paging.next) {
      console.log("더 이상 가져올 포스트가 없어요!");
      return;
    }

    // 가져오기 시작
    dispatch(loading(true));

    ////////////////////////////////////
    ///////// 이후 FB 문법 변경 ///////////
    ////////////////////////////////////

    const postDB = firestore.collection("post");
    // size + 1 다음 게 있는지 확인
    let query = postDB.orderBy("insert_dt", "desc");

    // 시작점 정보가 있으면? 시작점부터 가져오도록 쿼리 수정
    if (start) {
      // 카거 곂쳐서 똑같은 것만 불러오는 부분, query에다 query를 추가해줘야 다음게 실행됨
      query = query.startAt(start);
    }
    query
      .limit(size + 1)
      .get()
      .then((docs) => {
        let post_list = [];

        // 새로운 paging 정보
        let paging = {
          // start는 도큐먼트의 제일 첫번 째 것
          start: docs.docs[0],
          // 4개를 가지고 오지만, 데이터가 4개미만일 때도 처리해줘야함
          next:
            docs.docs.length === size + 1
              ? docs.docs[docs.docs.length - 1]
              : null,
          size: size,
        };

        docs.forEach((doc) => {
          // 잘 가져왔나 확인
          // console.log("다르냐?", doc.id, doc.data());

          // comment_cnt: 0
          // contents: "케이크조아!!😀"
          // image_url: "https://firebasestorage.googleapis.com/v0/b/react-deep-99.appspot.com/o/images%2FGfqOcoismnVlroqVfxomqd5Sgvo2_1650044228069?alt=media&token=d94d02ce-85ea-4bde-84b7-27cb329d938b"
          // insert_dt: "2022-04-16 12:02:32"
          // user_id: "GfqOcoismnVlroqVfxomqd5Sgvo2"
          // user_name: "성혜"
          // user_profile: ""

          // DB에서 가져온 것하고 우리가 Post 컴포넌트에서 쓰는 데이터 모양새 다름

          let _post = doc.data();

          // 데이터 모양 맞추기
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
            // 랜덤 배정된 doc.id 추가
            { id: doc.id, user_info: {} }
          );
          //console.log("query!! startAt > paging > query> post", post);
          post_list.push(post);
        });

        // size+1 로 4개씩 push한다, 하지만 size대로 가져와야 하니 마지막 카드 없애기
        if (paging.next) {
          post_list.pop();
        }

        // 리스트 확인하기
        //console.log("리스트 잘 가져왔니? ", post_list);
        // >>
        // id 추가, user_info에 user_관련 정보 담김
        // id: "b1CcR1w10zAyHtig58vg"
        // user_info: {user_profile: '', user_id: 'GfqOcoismnVlroqVfxomqd5Sgvo2', user_name: '성혜'}

        // 가공한 Post_list setPost를 통해 배열에 넘겨준다.
        dispatch(setPost(post_list, paging));
      });
    return;
  };
};

//  리덕스로 게시글 하나 정보 가져오는 함수
const getOnePostFB = (id) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    postDB
      .doc(id)
      .get()
      .then((doc) => {
        // console.log(doc);
        // console.log(doc.data());

        let _post = doc.data();
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
          // 랜덤 배정된 doc.id 추가
          { id: doc.id, user_info: {} }
        );

        dispatch(setPost([post]));
      });
  };
};

// 받아온게 post 가 아니라 contents가 맞지 않나..? ????????????
const editPostFB = (post_id = null, contents = {}) => {
  // console.log("나는 뭘 받아왔나 contents인데 ? ", contents);
  return function (dispatch, getState, { history }) {
    // id가 없으면 return
    if (!post_id) {
      console.log("게시물 정보가 없어요! ");
      return;
    }

    // image.js 에서 가져온 Preview
    const _image = getState().image.preview;

    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];
    console.log(_post);

    const postDB = firestore.collection("post");
    if (_image === _post.image_url) {
      postDB
        .doc(post_id)
        .update(contents)
        .then((doc) => {
          dispatch(editPost(post_id, { ...contents }));
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

const deletePostFB = (post_id) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    postDB
      .doc(post_id)
      .delete()
      .then(() => {
        history.replace("/");
        dispatch(deletePost(post_id));
      })
      .catch((err) => {
        console.log("post 삭제 실패", err);
      });
  };
};

// reducer
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(...action.payload.post_list);

        // post_id가 같은 중복 항목 제거
        draft.list = draft.list.reduce((acc, cur) => {
          // findIndex로 누산값(cur)에 현재값이 이미 들어있나 확인
          // 있으면? 덮어쓰고, 없으면? 넣어주기
          if (acc.findIndex((a) => a.id === cur.id) === -1) {
            return [...acc, cur];
          } else {
            // 최근 값으로 덮어쓰기
            acc[acc.findIndex((a) => a.id === cur.id)] = cur;
            return acc;
          }
        }, []);

        // paging이 있을 때만 넣기

        if (action.payload.paging) {
          draft.paging = action.payload.paging;
        }
        // 다 불러왔으니 무조건 로딩중 아님
        draft.is_loading = false;
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
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = draft.list.filter(
          (post) => post.id !== action.payload.post_id
        );
      }),
  },
  initialState
);

// action creator export
const actionCreators = {
  setPost,
  addPost,
  editPost,
  getPostFB,
  addPostFB,
  editPostFB,
  getOnePostFB,
  deletePostFB,
};

export { actionCreators };
