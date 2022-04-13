import React from "react";
import profile_img from "../algoroot_profile.jpg";
// import Grid from "../elements/Grid";
// import Image from "../elements/Image";
// import Text from "../elements/Text";
import { Grid, Image, Text } from "../elements";

const Post = (props) => {
  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex>
          <Image src={props.src} />
          <Text bold>{props.user_info.user_name}</Text>
          <Text>{props.insert_dt}</Text>
        </Grid>
        <Grid is_flex padding="16px"></Grid>
        <Grid padding="16px"></Grid>
        <Text>{props.contents}</Text>
        <Grid>
          <Image shape="rectangle" src={props.src} />
        </Grid>
        <Grid padding="16px">
          <Text bold>댓글 {props.coment_cnt}개</Text>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Post.defaultProps = {
  user_info: {
    user_name: "algoroot",
    user_profile: profile_img,
  },
  image_url: profile_img,
  contents: "념념이",
  coment_cnt: 10,
  insert_dt: "2022-04-12 10:00:00",
};
export default Post;
