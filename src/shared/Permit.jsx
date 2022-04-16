import React from "react";
import { useSelector } from "react-redux";
import { apiKey } from "./firebase";

const Permit = (props) => {
  // 로그인상태,  토큰 있는지 체크
  const is_login = useSelector((state) => state.user.is_login);

  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;

  // 세션있는지 체크
  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  if (is_session && is_login) {
    return <React.Fragment>{props.children}</React.Fragment>;
  }

  return null;
};

export default Permit;
