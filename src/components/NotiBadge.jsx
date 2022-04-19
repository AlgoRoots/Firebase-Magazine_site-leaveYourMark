import React from "react";

import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";

import { realtime } from "../shared/firebase";
import { useSelector } from "react-redux";

const NotiBadge = (props) => {
  const [is_read, setIsRead] = React.useState(true);

  // user_id 리덕스에서 가져오기
  const user_id = useSelector((state) => state.user.user.uid);

  const notiCheck = () => {
    const notiDB = realtime.ref(`noti/${user_id}`);
    notiDB.update({ read: true });
    props._onClick();
  };

  // 함수형 컴포넌트에서 리스너 구독할 때  useEffect() 쓴다.
  // 마운트 될 때 한 번만 구독, 이게 완전히 사라질 때 없애준다.
  // 리스너 구독 해제는 컴포넌트가 unMount 되는 시점에 해야한다.
  // useEffect의 return에 넘겨주는 함수는 컴포넌트가 사라질 때 실행된다.
  React.useEffect(() => {
    // realtimedb는 참조를 ref로 가져온다. 뒤에는 경로적어주기 (user uid로 경로 넣음 )
    const notiDB = realtime.ref(`noti/${user_id}`);

    notiDB.on("value", (snapshot) => {
      //console.log(snapshot.val());
      setIsRead(snapshot.val().read);
    });
    // 구독하면 구독해제 필수
    return () => notiDB.off();
  }, []);

  return (
    <React.Fragment>
      <Badge
        invisible={is_read}
        color="secondary"
        onClick={notiCheck}
        variant="dot"
      >
        <NotificationsIcon />
      </Badge>
    </React.Fragment>
  );
};

NotiBadge.defaultProps = {
  _onClick: () => {},
};

export default NotiBadge;
