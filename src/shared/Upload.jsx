import React from "react";
import { Button } from "../elements";
import { storage } from "./firebase";

import { useDispatch, useSelector } from "react-redux";
import { actionCreators as imageActions } from "../redux/modules/image";

const Upload = (props) => {
  const dispatch = useDispatch();

  // 업로드하는 중에 재 업로드 막기 > line 44
  const is_uploading = useSelector((state) => state.image.uploading);
  const fileInput = React.useRef();
  const selectFile = (e) => {
    // console.log(e);
    // console.log(e.target);
    // console.log(e.target.files[0]);
    // console.log(fileInput.current.files[0]);
    const reader = new FileReader();
    // user 가 선택한 file => ~files[0]
    const file = fileInput.current.files[0];
    reader.readAsDataURL(file);

    // 읽기가 끝나면 발생하는 이벤트 핸들러
    reader.onloadend = () => {
      // reader.result는 올린 파일의 읽은 후를 string으로 반환해줌

      // console.log(
      //   "읽기 끝나서 reader.reult가 onloadend에서 발동 됨 ",
      //   reader.result
      // );

      // setPreview에 reader.result가 넘어가면서 initialState 의   preview: null 값이 업데이트 됨
      // 수정하는경우에는 null이 아니라 다른 이미지의 reader.result가 담겨있을 것.
      dispatch(imageActions.setPreview(reader.result));
    };
  };

  const uploadFB = () => {
    // 선택한 이미지 정보들
    let image = fileInput.current.files[0];
    //console.log("이미지 업로드 버튼을 눌렀어요!", image);
    if (!image) {
      alert("이미지 넣어주세요!");
      return;
    }
    // 위에서 setPreview를 통해 prevew: null; 이 먼저 업데이트 됨.
    // uploadImageFB를 통해서는 image를 가져가서 이름을 정해준 후 initialState변경시켜 FB  storage에 저장시킴
    // storage에 저장만 해줌! FBdb에 들어가는 것과는 별개임
    // 사실 필요없는 부분같음
    dispatch(imageActions.uploadImageFB(image));
  };

  return (
    <React.Fragment>
      <input
        type="file"
        onChange={selectFile}
        ref={fileInput}
        disabled={is_uploading}
      />
      <Button _onClick={uploadFB}>업로드하기</Button>
    </React.Fragment>
  );
};

export default Upload;
