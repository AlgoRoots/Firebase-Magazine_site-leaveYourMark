import React from "react";
import styled from "styled-components";

const Text = (props) => {
  const { bold, color, size, children, margin, _onClick, cursor } = props;

  const styles = {
    bold: bold,
    color: color,
    size: size,
    margin: margin,
    cursor: cursor,
  };
  return (
    <P {...styles} onClick={_onClick}>
      {children}
    </P>
  );
};

Text.defaultProps = {
  children: null,
  bold: false,
  color: "#222831",
  size: "14px",
  margin: false,
  _onClick: () => {},
  cursor: "none",
};

const P = styled.p`
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
  font-weight: ${(props) => (props.bold ? 600 : 400)};
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
  ${(props) => (props.cursor ? `cursor: ${props.cursor};` : `none;`)}
`;
export default Text;
