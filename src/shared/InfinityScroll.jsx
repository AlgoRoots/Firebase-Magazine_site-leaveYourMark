import React from "react";

import { Spinner } from "../elements";
import _ from "lodash";

const InfinityScroll = (props) => {
  const { children, callNext, is_next, loading } = props;

  const _handleScoll = _.throttle(() => {
    // 스크롤 계산하기
    const { innerHeight } = window;
    const { scrollHeight } = document.body;

    // 브라우저마다 documnet에 접근해 scrollTop을 가져오는 방법이 다르다.
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;

    if (scrollHeight - innerHeight - scrollTop < 200) {
      if (loading) return;
      // 다음 리스트로 보내기
      callNext();
    }
  }, 300);

  // useCallback 사용해 메오이제이션 해준다.
  const handleScroll = React.useCallback(_handleScoll, [loading]);

  // 처음 렌더링 되었을 때 이벤트 달아주기
  React.useEffect(() => {
    // 로딩 중이면, return!
    if (loading) return;
    // is_next 있으면 이벤트를 붙이고, 없으면 이벤트를 삭제
    if (is_next) {
      window.addEventListener("scroll", handleScroll);
    } else {
      window.removeEventListener("scroll", handleScroll);
    }

    // 함수형 컴포넌트가 화면에서 사라질 때 리턴구문이 실행됨, 클래스형에서 unmountdidmont와 비슷한 역할
    return () => window.removeEventListener("scroll", handleScroll);
  }, [is_next, loading]);

  return (
    <React.Fragment>
      {children}
      {is_next && <Spinner />}
    </React.Fragment>
  );
};

InfinityScroll.defaultProps = {
  children: null,
  callNext: () => {},
  is_next: false,
  loading: false,
};
export default InfinityScroll;
