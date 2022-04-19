import React, { useEffect, useState } from "react";
import profile_img from "../algoroot_profile.jpg";
// import Grid from "../elements/Grid";
// import Image from "../elements/Image";
// import Text from "../elements/Text";
import { Button, Grid, Image, Text } from "../elements";
import LikeBtn from "./LikeBtn";
import { history } from "../redux/configureStore";

import { useDispatch, useSelector } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as likeActions } from "../redux/modules/like";

// 부모가 바뀔 때 자식은 왜 꼭 렌더링 되어야만 할까? 🤔
// 부모 컴포넌트가 바뀔 때마다 바뀔 게 없는 컴포넌트까지 다시 렌더링하는 걸 막아주는 방법이 있으면 참 좋을 것 같죠?
// → 사실 있습니다! 컴포넌트를 렌더링하고, 결과를 메모이제이션해두는 거예요!

// React.memo를 사용해서 할 수 있어요!
// useMemo가 렌더링 때마다 연산하지 않도록,
// 연산된 값을 재 사용하는 훅이라면 memo는 컴포넌트의 리렌더링을 방지하는 함수예요!
const Post = React.memo((props) => {
  // console.log("hi!!! post!!");
  const dispatch = useDispatch();
  const like_list = useSelector((state) => state.like.list);
  console.log("like list!!!", like_list, typeof like_list);
  const post_id = props.id;

  const deletePost = () => {
    window.alert("삭제 완료 🥹");
    dispatch(postActions.deletePostFB(post_id));
  };

  useEffect(() => {
    dispatch(likeActions.getLikeFB(post_id));
  }, []);

  const { layout } = props;
  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex padding="16px">
          <Grid is_flex width="auto">
            <Image shape="circle" src={props.src} />
            <Text bold>{props.user_info.user_name}</Text>
          </Grid>
          <Grid is_flex width="auto">
            <Text>{props.insert_dt}</Text>
            {/* is_me user id 와 post의 userid 가 같으면 수정버튼 보여준다.  */}
            {props.is_me && (
              <Button
                width="auto"
                margin="4px"
                padding="4px"
                _onClick={() => {
                  history.push(`/write/${props.id}`);
                }}
              >
                수정
              </Button>
            )}
            {props.is_me && (
              <Button
                width="auto"
                margin="4px"
                padding="4px"
                _onClick={deletePost}
              >
                삭제
              </Button>
            )}
          </Grid>
        </Grid>

        {layout === "default" && (
          <>
            <Grid padding="16px">
              <Text>기본 위아래</Text>
              <Text>{props.contents}</Text>
            </Grid>

            <Grid>
              <Image shape="rectangle" src={props.image_url} />
            </Grid>
          </>
        )}

        {layout === "right" && (
          <>
            <Grid is_flex>
              <Grid padding="16px">
                <Text>{props.contents}</Text>
              </Grid>
              <Grid>
                <Image shape="rectangle" src={props.image_url} />
              </Grid>
            </Grid>
          </>
        )}

        {layout === "left" && (
          <Grid is_flex>
            <Grid>
              <Image shape="rectangle" src={props.image_url} />
            </Grid>
            <Grid padding="16px">
              <Text>{props.contents}</Text>
            </Grid>
          </Grid>
        )}

        <Grid padding="16px" is_flex width="auto">
          <Grid is_flex width="auto">
            <Text margin="0px 10px 0px 0" bold>
              댓글 {props.comment_cnt}개
            </Text>
            <Text margin="0px" bold>
              좋아요 {props.like_cnt}개
            </Text>
          </Grid>
          <LikeBtn post_id={post_id} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
});

Post.defaultProps = {
  user_info: {
    user_name: "algoroot",
    user_profile: profile_img,
  },
  image_url: profile_img,
  contents: "념념이",
  coment_cnt: 0,
  like_cnt: 0,
  insert_dt: "2022-04-12 10:00:00",
  is_me: false,
  layout: "default",
};

export default Post;
