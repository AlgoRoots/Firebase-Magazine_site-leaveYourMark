import React from "react";
import { Text, Input, Grid, Button } from "../elements";

import { useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

const Signup = (props) => {
  const dispatch = useDispatch();

  const [id, setId] = React.useState("");
  const [pwd, setPwd] = React.useState("");
  const [pwd_check, setPwdCheck] = React.useState("");
  const [user_name, setUserName] = React.useState("");

  const signup = () => {
    if (id === "" || pwd === "" || user_name === "") return;
    if (pwd !== pwd_check) return;

    dispatch(userActions.signupFB(id, pwd, user_name));
  };

  return (
    <Grid padding="16px">
      <Text size="32px" bold>
        회원가입
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
          label="닉네임"
          placeholder="닉네임을 입력해주세요."
          _onChange={(e) => {
            console.log("닉네임입력중");
            setUserName(e.target.value);
          }}
        />
      </Grid>

      <Grid padding=" 16px 0">
        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          _onChange={(e) => {
            console.log("비밀번호입력중");
            setPwd(e.target.value);
          }}
        />
      </Grid>
      <Grid padding=" 16px 0">
        <Input
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요."
          _onChange={(e) => {
            console.log("비밀번호 재입력중");
            setPwdCheck(e.target.value);
          }}
        />
      </Grid>

      <Button
        ssize="10px"
        text="회원가입하기"
        _onClick={() => {
          console.log("회원가입했어!");
          signup();
        }}
      ></Button>
    </Grid>
  );
};

Signup.defaultProps = {};
export default Signup;
