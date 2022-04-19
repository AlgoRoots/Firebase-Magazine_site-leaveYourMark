// 현재 안씀

import React from "react";

import { Grid, Text } from "../elements";
import LikeBtn from "./LikeBtn";

const PostCardFooter = (props) => {
  const post_id = props.id;
  return (
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
  );
};

PostCardFooter.defaultProps = {
  coment_cnt: 0,
  like_cnt: 0,
};

export default PostCardFooter;
