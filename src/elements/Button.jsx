import React from "react";
import styled, { css } from "styled-components";

const Button = (props) => {
  const {
    text,
    _onClick,
    children,
    size,
    btnColor,
    is_add,
    margin,
    width,
    padding,
  } = props;

  const styles = {
    margin: margin,
    width: width,
    btnColor: btnColor,
    size: size,
    padding: padding,
  };

  if (is_add) {
    return (
      <React.Fragment>
        <RoundBtn {...styles} onClick={_onClick}>
          {children}
        </RoundBtn>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <ElButton variant="contained" {...styles} onClick={_onClick}>
        {text ? text : children}
      </ElButton>
    </React.Fragment>
  );
};

Button.defaultProps = {
  children: null,
  text: false,
  _onClick: () => {},
  size: "16px",
  btnColor: "#666666",
  is_add: false,
  margin: false,
  width: "100%",
  padding: "12px 0",
};

const Btn = css`
  cursor: pointer;
  border: none;
`;

const ElButton = styled.button`
  ${Btn};
  font-size: ${(props) => props.size};
  width: ${(props) => props.width};
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
  background: ${(props) => props.btnColor};
  color: #fff;
  padding: ${(props) => props.padding};
  box-sizing: border-box;
  border: none;
`;

const RoundBtn = styled.button`
  ${Btn};
  background: ${(props) => props.btnColor};
  position: fixed;
  bottom: 15px;
  right: 15px;
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  vertical-align: middle;
  padding-top: 5px;
`;
export default Button;
