import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { actionCreators as likeActions } from "../redux/modules/like";
import { useDispatch, useSelector } from "react-redux";
import { Text } from "../elements";
import { history } from "../redux/configureStore";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const LikeBtn = (props) => {
  const dispatch = useDispatch();
  const like_list = useSelector((state) => state.like?.list);
  const is_login = useSelector((state) => state.user.is_login);
  const user_info = useSelector((state) => state.user.user);
  const { post_id } = props;
  const [checkLike, setCheckLike] = useState(false);

  useEffect(() => {
    if (like_list[post_id]?.includes(user_info?.uid)) {
      setCheckLike(true);
    } else {
      setCheckLike(false);
    }
  });
  const updateLike = (e) => {
    if (!is_login) {
      window.alert("로그인시 하트를 누를 수 있습니다❤️‍🔥");
      console.log("event", e);
      e.preventDefault();
      return history.replace("/required");
    }
    if (!like_list[post_id]?.includes(user_info.uid)) {
      dispatch(likeActions.addLikeFB(post_id));
    }

    if (like_list[post_id]?.includes(user_info.uid)) {
      dispatch(likeActions.undoLikeFB(post_id));
    }
  };

  return (
    <Text _onClick={updateLike}>
      {checkLike ? (
        <HeartCheck style={{ color: "#686ef3" }} />
      ) : (
        <HeartIcon style={{ color: "#686ef3" }} />
      )}
    </Text>
  );
};

const HeartIcon = styled(AiOutlineHeart)`
  font-size: 24px;
  cursor: pointer;
  color: "#686ef3";
`;
const HeartCheck = styled(AiFillHeart)`
  font-size: 24px;
  cursor: pointer;
  background-color: "#686ef3";
`;

export default LikeBtn;
