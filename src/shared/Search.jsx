import React from "react";
import _ from "lodash";

const Search = () => {
  const [text, setText] = React.useState("");
  const onChange = (e) => {
    setText(e.target.value);
    keyPress(e);
  };

  const debounce = _.debounce((e) => {
    console.log("debounce", e.target.value);
  }, 1000);

  const throttle = _.throttle((e) => {
    console.log("throttle", e.target.value);
  }, 1000);

  // useCallback Search가 리랜더링이 되더라도 함수를 초기화 시키지 마라
  // 컴포넌트가 리랜더링 되더라도 debounce함수를 메모리제이션 해서 초기화 되지 않는다. 재렌더링 되지 않음?
  const keyPress = React.useCallback(debounce, []);
  const keyPressThrottle = React.useCallback(throttle, []);

  return (
    <div>
      <input type="text" onChange={onChange} value={text} />
    </div>
  );
};

export default Search;
