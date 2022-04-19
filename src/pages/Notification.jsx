import React from "react";
import { Grid, Text, Image } from "../elements";
import Card from "../components/Card";

import { realtime } from "../shared/firebase";
import { useSelector } from "react-redux";

const Notification = (props) => {
  // 처음에는 빈 배열로 시작
  const [noti, setNoti] = React.useState([]);
  const user = useSelector((state) => state.user.user);
  console.log("user 정보", user);
  // 이 컴포넌트가 처음 로드 되었을 때 가지고 와야한다.
  React.useEffect(() => {
    // 처음에 user정보가 없으면 return해준다.
    if (!user) return;

    const notiDB = realtime.ref(`noti/${user.uid}/list`);

    // firebase realtime database는 내림차순 정렬을 지원하지 않음.
    // 데이터를 가져온 후 직접 역순으로 내보내야 함 > reverse()!
    const _noti = notiDB.orderByChild("insert_dt");

    _noti.once("value", (snapshot) => {
      // snapshot 존재 유무
      if (snapshot.exists()) {
        // data 가져오기 객체형태 > key를 가지고 있다.
        let _data = snapshot.val();

        let _noti_list = Object.keys(_data)
          .reverse()
          .map((s) => {
            return _data[s];
          });

        setNoti(_noti_list);
      }
    });
  }, [user]);

  return (
    <React.Fragment>
      <Grid padding="16px" bg="#EFF6FF">
        {noti.map((n, idx) => {
          // key 값 설정 다시 해주기 원래 key={`n.post_id`}
          // 게시물 하나에 댓글 50개 썼을 때 똑같은 아이디가 50개가 됨, > idx로 받아오게 바꿔줌
          return <Card key={`noti_${idx}`} {...n} />;
        })}
      </Grid>
    </React.Fragment>
  );
};

export default Notification;
