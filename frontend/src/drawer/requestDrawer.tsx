import { Drawer, Form, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React from "react";

interface RequestDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  form: any;
  handleAddNewRequest: () => void;
  loading: boolean;
}

const RequestDrawer: React.FC<RequestDrawerProps> = ({
  isDrawerOpen,
  setIsDrawerOpen,
  form,
  handleAddNewRequest,
  loading,
}) => {
  return (
    <Drawer
      title="Upload Data"
      placement="right"
      width={400}
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Excel File"
          name="file"
          rules={[{ required: true, message: "Please upload a file" }]}
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
        >
          <Upload
            beforeUpload={() => false}
            accept=".xlsx,.xls"
            maxCount={1}
            disabled={loading}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
        <p>
          <strong>Note :</strong> Ensure the placeholders in the Template match
          the column headers in the Excel file. Upload text data only, avoiding
          special characters and images.
        </p>
        <br />
        <Button
          type="primary"
          htmlType="submit"
          block
          onClick={handleAddNewRequest}
          loading={loading}
        >
          Upload Data
        </Button>
      </Form>
    </Drawer>
  );
};

export default RequestDrawer;
