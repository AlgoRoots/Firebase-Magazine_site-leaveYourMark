import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { actionCreators as likeActions } from "../redux/modules/like";
import { useDispatch, useSelector } from "react-redux";
import { Text } from "../elements";
import { history } from "../redux/configureStore";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import post from "../redux/modules/post";

const LikeBtn = (props) => {
  // post, user id 알기위해 useState로 가져오기
  const like_list = useSelector((state) => state.like?.list);
  const is_login = useSelector((state) => state.user.is_login);
  const user_info = useSelector((state) => state.user.user);

  const dispatch = useDispatch();
  const { post_id } = props;

  // 좋아요 안한 상태
  const [liked, setLiked] = useState(false);
  //이름 바꾸기
  useEffect(() => {
    // user_id가 좋아요했으면 해당 post에 uid리스트 있음
    if (like_list[post_id]?.includes(user_info?.uid)) {
      // 취소
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [like_list[post_id]]);

  const updateLike = (e) => {
    if (!is_login) {
      return history.replace("/login");
    }

    if (!like_list[post_id]?.includes(user_info.uid)) {
      dispatch(likeActions.addLikeFB(post_id));
    } else if (like_list[post_id]?.includes(user_info.uid)) {
      dispatch(likeActions.undoLikeFB(post_id));
    }
  };

  // likeDB 에 post_id, user uid 있으면 true, 아니면 false(좋아요 안한 & 취소 상태)
  // const [isLike, setIsLike] = React.useState(false);

  // React.useEffect(() => {
  //   if()
  // })
  return (
    <Text _onClick={updateLike}>
      <HeartIcon />
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
