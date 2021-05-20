import { Layout, Form, Input, Button, Select, Result, Modal } from "antd";
import "antd/dist/antd.css";

import { useState, useEffect } from "react";

import axios from "axios";
const { Header, Content, Footer } = Layout;
interface IData {
  trip: string;
  type: {
    [typeName: string]: {
      amount: number;
      price: number;
    };
  };
  key: string;
}
const { Option } = Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default () => {
  const [form] = Form.useForm();
  const [total, setTotal] = useState(0);
  const [price, setPrice] = useState(0);
  const [trip, setTrip] = useState({} as IData);
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState([] as IData[]);
  const [result, setResult] = useState(
    {} as { message: string; status: number; remainingAmount: number }
  );
  useEffect(() => {
    axios
      .get("http://localhost:8080")
      .then((res) => {
        const data = res.data;
        setInfo(data);
      })
      .catch((e) => {
        console.log("error when called all document ", e);
      });
  }, []);

  const onFinish = (values: any) => {
    values.type = values.type.split(":")[0];
    delete values.total;
    axios
      .post("http://localhost:8080/buy", values)
      .then((res) => {
        const data = res.data;
        setResult(data);
        setVisible(true);
      })
      .catch((e) => {
        console.log("error when called all document ", e);
      });
  };
  const onTripChangeHandler = (data: string) => {
    for (let i = 0; i < info.length; i++) {
      if (info[i].key === data) {
        const res = info[i];
        setTrip(res);
      }
    }
  };
  const onTypeChooseHandler = (data: string) => {
    const price = Number(data.split(":")[1]);
    setPrice(price);
  };
  const totalHandler = (e: any) => {
    const res = e.target.value;
    setTotal(res * price);
  };
  const handleOk = () => {
    window.location.reload();
  };
  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <Layout>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <div className="logo" />
      </Header>
      <Content
        className="site-layout"
        style={{ padding: "0 50px", marginTop: 64 }}
      >
        <div style={{ margin: "16px 0" }}></div>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 380 }}
        >
          <Form
            {...layout}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
          >
            <Form.Item name="trip" label="Trip" rules={[{ required: true }]}>
              <Select
                onChange={onTripChangeHandler}
                onClear={() => {
                  setTrip({} as IData);
                }}
                placeholder="Please Select this field..."
                allowClear
              >
                {info.map((item: IData) => (
                  <Option value={item.key}>{item.trip}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select
                placeholder="Please Select this field..."
                disabled={Object.keys(trip).length > 0 ? false : true}
                onChange={onTypeChooseHandler}
              >
                {Object.keys(trip).length > 0
                  ? Object.keys(trip.type).map((typeName) => (
                      <Option
                        value={`${typeName}:${trip.type[
                          typeName
                        ].price.toString()}`}
                      >
                        type: {typeName}: amount:{" "}
                        {trip.type[typeName].amount.toString()}:{" "}
                        {trip.type[typeName].price.toString()}$
                      </Option>
                    ))
                  : undefined}
              </Select>
            </Form.Item>

            <Form.Item
              name="amount"
              label="Amount"
              rules={[{ required: true }]}
            >
              <Input
                placeholder="Please Select this field..."
                allowClear
                type={"number"}
                onChange={totalHandler}
              />
            </Form.Item>
            <Form.Item name="total" label="Total">
              <div id={"total"}>{total}</div>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Buy now
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className={"result"}>
          <Modal
            visible={visible}
            title="Title"
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="close" onClick={handleCancel}>
                Close
              </Button>,
              <Button key="try" type="primary" onClick={handleOk}>
                Try Again
              </Button>,
            ]}
          >
            {result.status === 200 ? (
              <Result status={"success"} title="Buy tickets successfully..." />
            ) : (
              <Result
                status={"warning"}
                title="Something when wrong..."
                subTitle={`message: ${result.message}\n Remaining amount: ${result.remainingAmount}`}
              />
            )}
          </Modal>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>Ticket booking</Footer>
    </Layout>
  );
};
