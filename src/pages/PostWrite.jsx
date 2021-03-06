import React from "react";
import { Grid, Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";
import Required from "./Required";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as imageActions } from "../redux/modules/image";

const PostWrite = (props) => {
  const dispatch = useDispatch();
  const is_login = useSelector((state) => state.user.is_login);
  console.log("is_login ? ", is_login);
  const preview = useSelector((state) => state.image.preview);
  const post_list = useSelector((state) => state.post.list);

  const post_id = props.match.params.id;
  const is_edit = post_id ? true : false;

  let _post = is_edit ? post_list.find((p) => p.id === post_id) : null;

  const { history } = props;

  React.useEffect(() => {
    if (is_edit && !_post) {
      window.alert("포스트 정보가 없어요! 새로고침해서 리덕스 정보 빠짐");
      console.log("포스트 정보가 없어요!");
      history.goBack();

      return;
    }
    if (is_edit) {
      dispatch(imageActions.setPreview(_post.image_url));
    }
  }, []);

  const [contents, setContents] = React.useState(_post ? _post.contents : "");
  const [layout, setLayout] = React.useState(_post ? _post.layout : "default");

  const addPost = () => {
    dispatch(postActions.addPostFB(contents, layout));
  };

  const editPost = () => {
    dispatch(
      postActions.editPostFB(post_id, { contents: contents, layout: layout })
    );
  };

  const is_checked = (e) => {
    if (e.target.value) {
      setLayout(e.target.value);
    }
  };

  const changeContents = (e) => {
    setContents(e.target.value);
  };

  if (!is_login) {
    return <Required />;
  }
  return (
    <React.Fragment>
      <Grid padding="16px">
        <Text margin="16px 0px" size="36px" bold>
          {is_edit ? "게시글 수정" : "게시글 작성"}
        </Text>
        <Grid is_flex>
          {/* Upload :  이미지 파일 따로 가공해 받아옴 */}
          <Upload />
        </Grid>
        <Grid is_flex padding="16px 0">
          <Text size="24px" bold>
            레이아웃 선택
          </Text>
          <select onChange={is_checked}>
            <option value="default">Default</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </Grid>
      </Grid>

      {layout === "default" && (
        <>
          <Grid>
            <Grid padding="16px">
              <Text margin="0px" size="24px" bold>
                미리보기
              </Text>
            </Grid>
            <Image
              shape="rectangle"
              preview_img
              src={preview ? preview : "http://via.placeholder.com/400x300"}
            />
          </Grid>

          <Grid padding="16px">
            <Input
              value={contents}
              _onChange={changeContents}
              label="게시글 내용"
              placeholder="게시글 작성"
              multiLine
            />
          </Grid>
        </>
      )}

      {layout === "left" && (
        <>
          <Grid>
            <Grid padding="16px">
              <Text margin="0px" size="24px" bold>
                미리보기
              </Text>
            </Grid>
          </Grid>

          <Grid padding="16px" is_flex>
            <Image
              shape="rectangle"
              preview_img
              src={preview ? preview : "http://via.placeholder.com/400x300"}
            />
            <Input
              value={contents}
              _onChange={changeContents}
              label="게시글 내용"
              placeholder="게시글 작성"
              multiLine
            />
          </Grid>
        </>
      )}

      {layout === "right" && (
        <>
          <Grid>
            <Grid padding="16px">
              <Text margin="0px" size="24px" bold>
                미리보기
              </Text>
            </Grid>
          </Grid>

          <Grid padding="16px" is_flex>
            <Input
              value={contents}
              _onChange={changeContents}
              label="게시글 내용"
              placeholder="게시글 작성"
              multiLine
            />
            <Image
              shape="rectangle"
              preview_img
              src={preview ? preview : "http://via.placeholder.com/400x300"}
            />
          </Grid>
        </>
      )}
      {/*  */}
      <Grid padding="16px">
        {is_edit ? (
          <Button text="게시글 수정" _onClick={editPost}></Button>
        ) : (
          <Button text="게시글 작성" _onClick={addPost}></Button>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default PostWrite;
