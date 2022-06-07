import React, { useEffect, useState } from "react";
import profile_img from "../algoroot_profile.jpg";
import { Button, Grid, Image, Text } from "../elements";
import PostCardFooter from "./PostCardFooter";
import LikeBtn from "./LikeBtn";
import { history } from "../redux/configureStore";

import { useDispatch, useSelector } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as likeActions } from "../redux/modules/like";

const Post = React.memo((props) => {
  const dispatch = useDispatch();
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
