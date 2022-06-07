import React from "react";

import { Grid, Input, Button } from "../elements";

import { actionCreators as commentActions } from "../redux/modules/comment";
import { useDispatch, useSelector } from "react-redux";

const CommentWrite = (props) => {
  const dispatch = useDispatch();
  const [comment_text, setCommentText] = React.useState();

  const { post_id } = props;

  const onChange = (e) => {
    setCommentText(e.target.value);
  };

  const write = () => {
    if (comment_text === "") {
      window.alert("댓글을 입력해주세요!");
      return;
    }
    dispatch(commentActions.addCommentFB(post_id, comment_text));
    setCommentText("");
  };
  return (
    <React.Fragment>
      <Grid is_flex padding="16px">
        <Input
          placeholder="댓글 내용을 입력해주세요 :)"
          _onChange={onChange}
          value={comment_text}
          is_submit
          onSubmit={write}
        />
        <Button width="50px" margin="0px 2px" _onClick={write}>
          작성
        </Button>
      </Grid>
    </React.Fragment>
  );
};

export default CommentWrite;
