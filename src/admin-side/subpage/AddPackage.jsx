import React, { useState } from "react";
import { Form, Input, Button, InputNumber, message } from "antd";

const AddPackage = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // สมมติว่าคุณจะส่งข้อมูลไปที่ server หรือบันทึกลงใน state
    console.log("New Package:", values);
    
    // แสดงข้อความสำเร็จ
    message.success("New package added successfully!");

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add New Tour Package</h1>
      <p>This is where you can add new tour packages.</p>
      <Form
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: "600px", marginTop: "20px" }}
      >
        <Form.Item
          name="packageName"
          label="Package Name"
          rules={[{ required: true, message: "Please input the package name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price (THB)"
          rules={[{ required: true, message: "Please input the price!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: "100%" }}
          >
            Add Package
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddPackage;
