import React from "react";
import { Grid, Text, Button } from "../elements";
import Permit from "../shared/Permit";
import { getCookie, deleteCookie } from "../shared/Cookie";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";
import { history } from "../redux/configureStore";
import { apiKey } from "../shared/firebase";

const Header = (props) => {
  const dispatch = useDispatch();
  // const [is_login, setIsLogin] = React.useState(false);
  const is_login = useSelector((state) => state.user.is_login);

  // React.useEffect(() => {
  //   let cookie = getCookie("user_id");
  //   console.log(cookie);

  //   cookie ? setIsLogin(true) : setIsLogin(false);
  // });
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  console.log(is_session);
  // console.log(sessionStorage.getItem(_session_key));

  // if (is_login && is_session) {
  //   return (

  //   );
  // }
  <Permit>
    <React.Fragment>
      <Grid is_flex padding="4px 16px">
        <Grid>
          <Text margin="0px" size="23px" bold>
            헬로
          </Text>
        </Grid>

        <Grid is_flex>
          <Button text="내정보" btnColor="#686ef3"></Button>
          <Button text="알림"></Button>
          <Button
            text="로그아웃"
            _onClick={() => {
              dispatch(userActions.logoutFB());
              // deleteCookie("user_id");
            }}
          ></Button>
        </Grid>
      </Grid>
    </React.Fragment>
  </Permit>;
  return (
    <React.Fragment>
      <Grid is_flex padding="4px 16px">
        <Grid>
          <Text margin="0px" size="23px" bold>
            헬로
          </Text>
        </Grid>

        <Grid is_flex>
          <Button
            text="로그인"
            _onClick={() => {
              history.push("/login");
            }}
          ></Button>
          <Button
            text="회원가입"
            btnColor="#686ef3"
            _onClick={() => {
              history.push("/signup");
            }}
          ></Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Header.defaultProps = {};

export default Header;
