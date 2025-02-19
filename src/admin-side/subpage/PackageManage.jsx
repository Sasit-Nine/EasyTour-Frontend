import React, { useState, useEffect } from "react";
import { Card, Row, Col, Select, Button, Form, Input, Upload, DatePicker, Modal, message, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, PictureOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const PackageManage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [form] = Form.useForm();
  const [packages, setPackages] = useState([]);
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const storedPackages = JSON.parse(localStorage.getItem("packages")) || [];
    setPackages(storedPackages);
  }, []);

  const updateLocalStorage = (updatedPackages) => {
    localStorage.setItem("packages", JSON.stringify(updatedPackages));
  };

  const showModal = (packageToEdit = null) => {
    setIsModalOpen(true);
    if (packageToEdit) {
      setIsEditMode(true);
      setIsDraft(packageToEdit.isDraft || false);
      setEditingPackage(packageToEdit);
      form.setFieldsValue({
        ...packageToEdit,
        dateRange: packageToEdit.dateRange
          ? [dayjs(packageToEdit.dateRange[0]), dayjs(packageToEdit.dateRange[1])]
          : [],
        image: packageToEdit.imageUrl
          ? [{ uid: "-1", name: "package.jpg", status: "done", url: packageToEdit.imageUrl }]
          : [],
      });
    } else {
      setIsEditMode(false);
      setIsDraft(false);
      setEditingPackage(null);
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setIsEditMode(false);
    setIsDraft(false);
    setEditingPackage(null);
  };

  const handleSubmit = (values) => {
    const newImageUrl = values.image?.[0]?.thumbUrl || editingPackage?.imageUrl || "";
    const newPackage = {
      key: isEditMode ? editingPackage.key : Date.now().toString(),
      ...values,
      imageUrl: newImageUrl,
      dateRange: values.dateRange
        ? [
          values.dateRange[0]?.format("YYYY-MM-DD"),
          values.dateRange[1]?.format("YYYY-MM-DD"),
        ]
        : null,
      isDraft: values.status === "Draft", // แก้ไขตรงนี้ให้ตั้งค่า isDraft ตาม status ที่เลือก
    };
  
    const updatedPackages = isEditMode
      ? packages.map((pkg) => (pkg.key === editingPackage.key ? newPackage : pkg))
      : [newPackage, ...packages];
  
    setPackages(updatedPackages);
    updateLocalStorage(updatedPackages);
    handleCancel();
  
    if (isEditMode) {
      message.success(`แพ็คเกจ "${values.packageName}" ถูกแก้ไขเรียบร้อยแล้ว!`);
    } else {
      message.success(`แพ็คเกจ "${values.packageName}" ถูกเพิ่มลงระบบเรียบร้อย!`);
    }
  };  

  const handleDelete = (key) => {
    const deletedPackage = packages.find((pkg) => pkg.key === key);
    const updatedPackages = packages.filter((pkg) => pkg.key !== key);
    setPackages(updatedPackages);
    updateLocalStorage(updatedPackages);

    message.warning(`แพ็คเกจ "${deletedPackage.packageName}" ถูกลบออกจากระบบ!`);
  };

  const handlePublish = (key) => {
    const updatedPackages = packages.map(pkg =>
      pkg.key === key ? { ...pkg, isDraft: false } : pkg
    );
    setPackages(updatedPackages);
    updateLocalStorage(updatedPackages);
    message.success("แพ็คเกจถูกเผยแพร่แล้ว!");
  };

  const filteredPackages = packages.filter((pkg) => {
    const categoryMatch = filterCategory ? pkg.category === filterCategory : true;
    const statusMatch =
      filterStatus === "All" ||
      (filterStatus === "Draft" && pkg.isDraft) ||
      (filterStatus === "Published" && !pkg.isDraft);
    return categoryMatch && statusMatch;
  });

  const sortedPackages = filteredPackages.sort((a, b) => {
    const dateA = a.dateRange && a.dateRange[0] ? new Date(a.dateRange[0]) : new Date(0);
    const dateB = b.dateRange && b.dateRange[0] ? new Date(b.dateRange[0]) : new Date(0);

    if (sortOrder === "desc") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  return (
    <div style={{ padding: "30px" }}>
      <Card
        title={<h2>🏕️ Package Management</h2>}
        extra={
          <>
            <Select
              placeholder="Filter by Category"
              style={{ width: 180, marginRight: 10 }}
              onChange={setFilterCategory}
              value={filterCategory}
            >
              <Option value="Mountain">🏔️ ภูเขา</Option>
              <Option value="Sea">🌊 ทะเล</Option>
              <Option value="Waterfall">💦 น้ำตก</Option>
            </Select>
            <Button onClick={() => setFilterCategory(null)}>Clear Filter</Button>
            <Select
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
              style={{ marginLeft: 10, width: 180 }}
            >
              <Option value="All">All</Option>
              <Option value="Draft">Draft</Option>
              <Option value="Published">Published</Option>
            </Select>
            <Select
              value={sortOrder}
              onChange={(value) => setSortOrder(value)}
              style={{ marginLeft: 10, width: 180 }}
            >
              <Option value="desc">ใหม่ล่าสุด</Option>
              <Option value="asc">เก่าสุด</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
              style={{
                backgroundColor: "#000000",  // สีดำ
                color: "#FFFFFF",            // ตัวหนังสือสีขาว
                borderColor: "#000000",      // ขอบปุ่มสีดำ
                marginLeft: 10
              }}
            >
              Add Package
            </Button>
          </>
        }
      >
        {sortedPackages.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>No packages available.</p>
        ) : (
          <Row gutter={[16, 16]}>
            {sortedPackages.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.key}>
                <Card
                  title={
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ margin: 0 }}>{item.packageName}</h3>
                      <Tag color={item.isDraft ? "gold" : "green"}>{item.isDraft ? "Draft" : "Published"}</Tag>
                    </div>
                  }
                  cover={
                    item.imageUrl ? (
                      <img alt="package" src={item.imageUrl} style={{ height: 180, objectFit: "cover", borderRadius: "8px" }} />
                    ) : (
                      <div
                        style={{
                          height: 180,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#f0f0f0",
                          borderRadius: "8px",
                        }}
                      >
                        <PictureOutlined style={{ fontSize: 50, color: "#aaa" }} />
                      </div>
                    )
                  }
                  actions={[
                    <Button type="text" icon={<EditOutlined />} onClick={() => showModal(item)} style={{
                      backgroundColor: "#000000",  // สีดำ
                      color: "#FFFFFF",            // ตัวหนังสือสีขาว
                      borderColor: "#000000",      // ขอบปุ่มสีดำ
                      marginLeft: 10
                    }}
                    >
                      Edit
                    </Button>,
                    !item.isDraft && (
                      <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(item.key)}
                        style={{
                          width: "100%",
                          backgroundColor: "#FF0000", // พื้นหลังสีแดงสด
                          color: "#FFFFFF",           // ตัวอักษรสีขาว
                          borderColor: "#FF0000",     // ขอบสีแดงสด
                          marginLeft: "8px"           // เพิ่มระยะห่างจากปุ่ม Edit
                        }}
                      >
                        Delete
                      </Button>
                    ),
                    item.isDraft && (
                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={() => handlePublish(item.key)}
                        style={{
                          backgroundColor: "#16C60C",
                          color: "#FFFFFF",
                          marginLeft: -25
                        }}
                      >
                        Publish
                      </Button>
                    ),
                  ]}
                  style={{ borderRadius: "12px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", marginBottom: "16px" }}
                >
                  <div style={{ padding: "12px 0" }}>
                    <p style={{ fontWeight: "bold", marginBottom: "4px" }}>
                      <span role="img" aria-label="category">🌍</span> Category: {item.category}
                    </p>
                    <p style={{ marginBottom: "4px" }}>
                      <span role="img" aria-label="date">📅</span> <b>Date Range:</b> {item.dateRange ? `${item.dateRange[0]} to ${item.dateRange[1]}` : "Not selected"}
                    </p>
                    <p style={{ fontWeight: "bold", marginBottom: "4px" }}>
                      <span role="img" aria-label="price">💰</span> Price: {item.price} THB
                    </p>
                    <p style={{ color: "#555", fontSize: "14px", lineHeight: "1.5" }}>{item.description}</p>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      <Modal
        title={isEditMode ? "✏️ Edit Package" : "➕ Add New Package"}
        open={isModalOpen}
        centered
        width={850}
        onCancel={handleCancel}
        footer={null} // ซ่อน Footer เพื่อให้ใช้งานง่ายขึ้น
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="category"
                label="🌍 Category"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select a category" style={{ width: '100%' }}>
                  <Option value="Mountain">🏔️ ภูเขา</Option>
                  <Option value="Sea">🌊 ทะเล</Option>
                  <Option value="Waterfall">💦 น้ำตก</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={16}>
              <Form.Item
                name="packageName"
                label="🏕️ Package Name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter package name" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="price"
                label="💰 Price (THB)"
                rules={[{ required: true }]}
              >
                <Input type="number" placeholder="Enter price" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={16}>
              <Form.Item
                name="dateRange"
                label="📅 Date Range"
              >
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="image"
                label="🖼️ Upload Image"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
              >
                <Upload name="image" listType="picture-card" beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />} />
                </Upload>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={16}>
              <Form.Item
                name="description"
                label="📖 Description"
              >
                <TextArea rows={4} placeholder="Enter description" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item name="status" label="📌 Status" rules={[{ required: true }]}>
                <Select>
                  <Option value="Draft">Draft</Option>
                  <Option value="Published">Published</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col>
              <Button onClick={handleCancel} danger style={{ marginRight: '8px' }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit"
                style={{
                  backgroundColor: "#000000",  // สีดำ
                  color: "#FFFFFF",            // ตัวหนังสือสีขาว
                  borderColor: "#000000",      // ขอบปุ่มสีดำ
                  marginLeft: 10
                }}>
                {isEditMode ? "Save Changes" : "Add Package"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

    </div>
  );
};

export default PackageManage;
