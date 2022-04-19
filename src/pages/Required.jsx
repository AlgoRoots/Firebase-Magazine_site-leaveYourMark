import React from "react";
import { Grid, Text, Button, Image, Input } from "../elements";
import { useSelector } from "react-redux";

const Required = (props) => {
  const { history } = props;

  const is_login = useSelector((state) => state.user.is_login);

  if (is_login) {
    return (
      <Grid margin="100px 0" padding="16px" center>
        <Text size="32px" bold>
          앗 ! 잠깐!
        </Text>
        <Text size="16px">이미 로그인을 하셨어요🐥</Text>
        <Button
          _onClick={() => {
            history.replace("/");
          }}
        >
          Home으로 가기
        </Button>
      </Grid>
    );
  }

  return (
    <Grid margin="100px 0" padding="16px" center>
      <Text size="32px" bold>
        앗 ! 잠깐!
      </Text>
      <Text size="16px">로그인 후에만 글을 쓸 수 있어요🐥</Text>
      <Button
        _onClick={() => {
          history.replace("/login");
        }}
      >
        로그인 하러가기
      </Button>
    </Grid>
  );
};

export default Required;
