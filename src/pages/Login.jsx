import React from "react";
import { Text, Input, Grid, Button } from "../elements";
import { getCookie, setCookie, deleteCookie } from "../shared/Cookie";
import { useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

const Login = (props) => {
  const dispatch = useDispatch();
  // console.log(getCookie("user_id"));

  const [id, setId] = React.useState();
  const [pwd, setPwd] = React.useState();
  if (id === "" || pwd === "") {
    window.alert("아이디 혹은 비밀번호가 공란입니다. 입력해주세요.");
    return;
  }
  const login = () => {
    // setCookie("user_id", "algoroot", 3);
    // setCookie("user_pwd", "ppp", 3);
    // dispatch(userActions.loginAction({ user_name: "Kelly" }));
    dispatch(userActions.loginFB(id, pwd));
  };
  return (
    <Grid padding="16px">
      <Text size="32px" bold>
        로그인
      </Text>
      <Grid padding=" 16px 0">
        <Input
          label="아이디"
          placeholder="아이디를 입력해주세요."
          _onChange={(e) => {
            console.log("아이디입력중");
            setId(e.target.value);
          }}
        />
      </Grid>

      <Grid padding=" 16px 0">
        <Input
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          type="password"
          _onChange={(e) => {
            console.log("비밀번호입력중");
            setPwd(e.target.value);
          }}
        />
      </Grid>
      <Button
        ssize="10px"
        text="로그인하기"
        _onClick={() => {
          console.log("로그인했어!");
          login();
        }}
      ></Button>
    </Grid>
  );
};

export default Login;
