import React from "react";
import styled from "styled-components";

const Button = (props) => {
  const { text, _onClick, size, btnColor } = props;
  return (
    <React.Fragment>
      <ElButton {...props} onClick={_onClick}>
        {text}
      </ElButton>
    </React.Fragment>
  );
};

Button.defaultProps = {
  text: "text",
  _onClick: () => {},
  size: "16px",
  btnColor: "#666666",
};

const ElButton = styled.button`
  font-size: ${(props) => props.size};
  width: 100%;
  background: ${(props) => props.btnColor};
  color: #fff;
  padding: 12px 0;
  box-sizing: border-box;
  border: none;
`;
export default Button;
