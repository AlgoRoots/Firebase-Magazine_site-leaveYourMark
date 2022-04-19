import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { actionCreators as likeActions } from "../redux/modules/like";
import { useDispatch, useSelector } from "react-redux";
import { Text } from "../elements";
import { history } from "../redux/configureStore";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const LikeBtn = (props) => {
  // post, user id 알기위해 useState로 가져오기
  const dispatch = useDispatch();

  const like_list = useSelector((state) => state.like?.list);
  const is_login = useSelector((state) => state.user.is_login);

  // const like_list = useSelector((state) => state.like.list);
  const user_info = useSelector((state) => state.user.user);

  const { post_id } = props;

  // 체크 안한 상태
  const [checkLike, setCheckLike] = useState(false);
  useEffect(() => {
    if (like_list[post_id]?.includes(user_info?.uid)) {
      // 유저가 체크한 상태
      setCheckLike(true);
    } else {
      // 유저가 체크하지 않은 상태
      setCheckLike(false);
    }
  });

  // 하트누르면 post안에 먹혀서 post detail 페이지로 갔다가 뒤로가기누르면
  // required로 감 ...  아니면 한 번 더 누르거나..
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
  // console.log("좋아요 상태", checkLike);
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

/// addLike 까지함, 색 변하고 , undolike, 하트 이모지 fill로 바뀜
