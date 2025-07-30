import React from "react";
import { Drawer, Form, Input, Upload, Button, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface NewRequestDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  form: any;
  loading: boolean;
  handleAddNewRequest: () => void;
}

const RequestsDrawer: React.FC<NewRequestDrawerProps> = ({
  isDrawerOpen,
  setIsDrawerOpen,
  form,
  loading,
  handleAddNewRequest,
}) => {
     return (
    <Drawer
      title="Send Request"
      placement="right"
      width={400}
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
    >
      <Spin spinning={loading}>
        <Form layout="vertical" form={form} onFinish={handleAddNewRequest}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Enter Title Of Your Request" />
          </Form.Item>

          <Form.Item
            label="Select the word file"
            name="file"
            rules={[{ required: true, message: "Please upload a file" }]}
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Upload beforeUpload={() => false} accept=".doc,.docx" maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={5} placeholder="Enter Description" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Send Request
          </Button>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default RequestsDrawer;