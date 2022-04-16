import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Post from "../components/Post";
import { actionCreators as postActions } from "../redux/modules/post";
import user from "../redux/modules/user";

const PostList = (props) => {
  const dispatch = useDispatch();
  const post_list = useSelector((state) => state.post.list);
  const user_info = useSelector((state) => state.user.user);
  // console.log("post_list :!!", post_list);

  // 처음 컴포넌트가 생겼을 때 한번만 발동되게 firebase에 요청하게 의존성 배열에 []빈 배열 넣어줌
  React.useEffect(() => {
    // 게시글이 한개라도 있으면 getPost할 필요없음 > 원래있던 리덕스에 데이터 붙여주면 됨 (?)
    if (post_list.length === 0) {
      // getPostFB()로 firebase store 데이터 리스트 가져오기
      dispatch(postActions.getPostFB());
    }
  }, []);
  return (
    <React.Fragment>
      {/* <Post /> */}
      {post_list.map((p, idx) => {
        if (p.user_info.user_id === user_info.uid) {
          return <Post key={p.id} {...p} is_me />;
        }
        return <Post key={p.id} {...p} />;
      })}
    </React.Fragment>
  );
};

export default PostList;
