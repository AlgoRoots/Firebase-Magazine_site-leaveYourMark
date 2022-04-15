import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Post from "../components/Post";
import { actionCreators as postActions } from "../redux/modules/post";

const PostList = (props) => {
  const dispatch = useDispatch();
  const post_list = useSelector((state) => state.post.list);

  // 처음 컴포넌트가 생겼을 때 한번만 firebase에 요청 뒤에 빈 배열이 들어가야 처음 한번만
  // 발동됨
  React.useEffect(() => {
    // 게시글이 한개라도 있으면 getPost할 필요없어 원래있던 리덕스에 데이터 붙여준다.
    if (post_list.length === 0) {
      dispatch(postActions.getPostFB());
    }
  }, []);
  return (
    <React.Fragment>
      {/* <Post /> */}
      {post_list.map((p, idx) => {
        return <Post key={p.id} {...p} />;
      })}
    </React.Fragment>
  );
};

export default PostList;
