import React from "react";
import { Text, Input, Grid, Button } from "../elements";

const Signup = (props) => {
  return (
    <Grid padding="16px">
      <Text size="32px" bold>
        회원가입
      </Text>
      <Grid padding=" 16px 0">
        <Input
          label="아이디"
          placeholder="아이디를 입력해주세요."
          _onChange={() => {
            console.log("아이디입력중");
          }}
        />
      </Grid>
      <Grid padding=" 16px 0">
        <Input
          label="닉네임"
          placeholder="닉네임을 입력해주세요."
          _onChange={() => {
            console.log("닉네임입력중");
          }}
        />
      </Grid>

      <Grid padding=" 16px 0">
        <Input
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          _onChange={() => {
            console.log("비밀번호입력중");
          }}
        />
      </Grid>
      <Grid padding=" 16px 0">
        <Input
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력해주세요."
          _onChange={() => {
            console.log("비밀번호 재입력중");
          }}
        />
      </Grid>

      <Button
        ssize="10px"
        text="회원가입하기"
        _onClick={() => {
          console.log("회원가입했어!");
        }}
      ></Button>
    </Grid>
  );
};

Signup.defaultProps = {};
export default Signup;
