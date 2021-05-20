import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Result, Button } from "antd";

export default () => {
  return (
    <Result
      status={"success"}
      title="Buy tickets successfully"
      extra={
        <Button
          type="primary"
          onClick={() => window.location.reload()}
          key="console"
        >
          close
        </Button>
      }
    />
  );
};
