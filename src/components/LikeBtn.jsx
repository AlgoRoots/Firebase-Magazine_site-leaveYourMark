import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { actionCreators as likeActions } from "../redux/modules/like";
import { useDispatch, useSelector } from "react-redux";
import { Text } from "../elements";
import { history } from "../redux/configureStore";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import post from "../redux/modules/post";

import { apiKey } from "../shared/firebase";

const LikeBtn = (props) => {
  // post, user id 알기위해 useState로 가져오기
  const dispatch = useDispatch();
  const like_list = useSelector((state) => state.like.list);
  const user_info = useSelector((state) => state.user.user);

  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  const { post_id } = props;

  useEffect(() => {
    if (like_list[post_id]?.includes(user_info?.uid)) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  });

  const [toggle, setToggle] = useState(false);

  const updateLike = () => {
    if (!user_info || !is_session) {
      return history.replace("/caution");
    } else if (!like_list[post_id]?.includes(user_info.uid)) {
      dispatch(likeActions.addLikeFB(post_id));
    } else if (like_list[post_id]?.includes(user_info.uid)) {
      dispatch(likeActions.undoLikeFB(post_id));
    }
  };
  return (
    <Text _onClick={updateLike}>
      <HeartIcon style={toggle ? { color: "pink" } : { color: "grey" }} />
    </Text>
  );
};

const HeartIcon = styled(AiOutlineHeart)`
  font-size: 24px;
  cursor: pointer;
`;
const HeartCheck = styled(AiFillHeart)`
  font-size: 24px;
  cursor: pointer;
`;

export default LikeBtn;

/// addLike 까지함, 색 변하고 , undolike, 하트 이모지 fill로 바뀜
