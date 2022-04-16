import React from "react";
import Post from "../components/Post";
import CommentList from "../components/CommentList";
import CommentWrite from "../components/CommentWrite";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";

import Permit from "../shared/Permit";

const PostDetail = (props) => {
  const dispatch = useDispatch();
  const user_info = useSelector((state) => state.user.user);

  const id = props.match.params.id;
  // console.log(id);

  const post_list = useSelector((store) => store.post.list);

  // index 번호 찾기
  const post_idx = post_list.findIndex((p) => p.id === id);

  const post = post_list[post_idx];

  // ####### 백에서 받아올 떄 어떻게 하지?
  // 단일 데이터는 리덕스 굳이 사용안해도 된다. 근데 댓글작성때문에 사용하네
  React.useEffect(() => {
    // post_data 가지고 있으면 밑의 절차 필요없음 ??
    if (post) return;

    dispatch(postActions.getOnePostFB(id));
  }, []);

  return (
    <React.Fragment>
      {/* post userid와 user의 uid 가 같으면 */}
      {/*  post가 있을 때만 정보 나오게 해준다.  */}
      {post && (
        <Post {...post} is_me={post.user_info.user_id === user_info?.uid} />
      )}
      <Permit>
        <CommentWrite post_id={id} />
      </Permit>
      <CommentList post_id={id} />
    </React.Fragment>
  );
};

export default PostDetail;
