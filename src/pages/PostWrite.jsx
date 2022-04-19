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

  // props에는 configureStore에서 import 한 createBrowserHistory의 history, match, location이 있다 .
  // 포스트 카드 각각 아이디 : 수정, 작성 모두 PostWrite에서 하기 때문에 필요함
  // 작성을 누르면 undefined가 나오는게 당연함
  //console.log(" 포스트 카드 각각 아이디 ", props.match.params.id);

  // 그 카드의 아이디 로 수정 or 작성 인지 판별
  const post_id = props.match.params.id;
  const is_edit = post_id ? true : false;

  //  수정모드면 ? post_list에서 post_id와 같은것을 찾아라 : 수정모드가 아닐 때 (작성모드) null;
  // 이 때 post_list는 useSelector로 가져온 현재 존재하는 총 카드 리스트들임
  let _post = is_edit ? post_list.find((p) => p.id === post_id) : null;
  //console.log("수정모드면 그 post 정보 , 아니면 null", _post);

  const { history } = props;

  // _post가 있으면 수정모드이다. 존재하면 그 contents가 나오게, 아니라면 작성페이지이므로 비워둔다.

  // firebase 에 넣어주지않고 리덕스 정보로 이용하기 때문에 새로고침하면 리덕스 데이터 날아간다.
  // 후처리 해줘야함 // 렌더 처음할 때 한번만 해주면 됨
  React.useEffect(() => {
    if (is_edit && !_post) {
      window.alert("포스트 정보가 없어요! 새로고침해서 리덕스 정보 빠짐");
      console.log("포스트 정보가 없어요!");
      history.goBack();

      return;
    }
    // 수정모드라면, image에서 만든 setPreview 를 통해
    // 리듀서에서 initialState  preview: ~~. 깂을 변경해준다.
    if (is_edit) {
      dispatch(imageActions.setPreview(_post.image_url));
    }
  }, []);

  const [contents, setContents] = React.useState(_post ? _post.contents : "");
  const [layout, setLayout] = React.useState(_post ? _post.layout : "default");
  //const [previewImg, setPreviewImg] = React.useState(is_edit? "http://via.placeholder.com/400x300" : "default");

  const addPost = () => {
    // addPostFB에 contents state값을 넘겨준다. // post.jsx > 66line => const _post~
    // 넘겨줄 때 image모듈의 setPreview(null); 로 바꿔줘서 새로 작성할시 기본 이미지 유지되게 해줌
    // 가져간 state값을 리듀서작업 통해 initalPost 업데이트됨
    dispatch(postActions.addPostFB(contents, layout));
  };

  const editPost = () => {
    // editPostFB에 contents state값을 넘겨준다. post자체가 아닌 contents만 넘겨주고 있음 !
    dispatch(
      postActions.editPostFB(post_id, { contents: contents, layout: layout })
    );
  };

  const is_checked = (e) => {
    if (e.target.value) {
      // console.log(e.target.value);
      setLayout(e.target.value);
    }
  };

  // console.log("layout", layout);

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
