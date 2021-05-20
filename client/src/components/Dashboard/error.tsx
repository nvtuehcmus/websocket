import { Result, Button } from "antd";

export default (info: any) => {
  const text = `trip: ${info.message}`;
  return (
    <Result
      status="warning"
      title="Sorry, something when wrong.... "
      extra={[
        <Button type="primary" key="console">
          Go Console
        </Button>,
        <Button key="buy">Buy Again</Button>,
      ]}
    />
  );
};
