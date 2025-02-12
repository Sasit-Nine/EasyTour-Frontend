import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Card } from "antd";

const PackageManage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleSubmit = (values) => {
    console.log("New Package:", values);
    setIsModalOpen(false);
    form.resetFields(); // Reset form after submission
  };

  const packageData = [
    { key: "1", packageId: "P001", packageName: "Beach Tour", price: "5,000" },
    { key: "2", packageId: "P002", packageName: "Mountain Tour", price: "7,500" },
  ];

  const columns = [
    { title: "Package ID", dataIndex: "packageId" },
    { title: "Package Name", dataIndex: "packageName" },
    { title: "Price (THB)", dataIndex: "price" },
  ];

  return (
    <div>
      <Card 
        title="Package Management" 
        bordered={false} 
        extra={<Button type="primary" onClick={showModal}>Add New Package</Button>}
      >
        <Table columns={columns} dataSource={packageData} pagination={false} />
      </Card>

      <Modal 
        title="Add New Package" 
        open={isModalOpen} 
        onCancel={handleCancel} 
        onOk={() => form.submit()} 
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
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
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PackageManage;
