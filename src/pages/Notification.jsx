import React from "react";
import { Grid, Text, Image } from "../elements";
import Card from "../components/Card";

import { realtime } from "../shared/firebase";
import { useSelector } from "react-redux";

const Notification = () => {
  const [noti, setNoti] = React.useState([]);
  const user = useSelector((state) => state.user.user);
  React.useEffect(() => {
    if (!user) return;
    const notiDB = realtime.ref(`noti/${user.uid}/list`);
    const _noti = notiDB.orderByChild("insert_dt");

    _noti.once("value", (snapshot) => {
      if (snapshot.exists()) {
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
          return <Card key={`noti_${idx}`} {...n} />;
        })}
      </Grid>
    </React.Fragment>
  );
};

export default Notification;
