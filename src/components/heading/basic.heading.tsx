//* Packages Imports */
import { Typography, theme } from "antd";
import {  FC,  } from "react";

//* Types Imports */
import { HeadingInterface } from "../../interface/common";

const { useToken } = theme;

const Heading: FC<HeadingInterface> = ({
  children,
  wrapperStyle = {},
  titleStyle = {},
  titleLevel = 4,
  warapperClassName = "",
  titleClassName = "",
}) => {
  const { token } = useToken();
  return (
    <div style={{ ...wrapperStyle }} className={warapperClassName}>
      <Typography.Title
        level={titleLevel}
        style={{
          color: token.colorPrimary,
          marginBottom: "0px",
          marginTop: "0px",
          ...titleStyle,
        }}
        className={titleClassName}
      >
        {children}
      </Typography.Title>
    </div>
  );
};

export default Heading;
