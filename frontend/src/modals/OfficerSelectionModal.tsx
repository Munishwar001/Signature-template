import React from "react";
import { Modal, Form, Select, message } from "antd";

interface Officer {
  id: string;
  name: string;
  email: string;
}

interface Props {
  visible: boolean;
  officers: Officer[];
  selectedOfficer: string | null;
  onSelectOfficer: (value: string) => void;
  onCancel: () => void;
  onOk: () => void;
  loading?: boolean;
}

const OfficerSelectionModal: React.FC<Props> = ({
  visible,
  officers,
  selectedOfficer,
  onSelectOfficer,
  onCancel,
  onOk,
  loading = false,
}) => {
  return (
    <Modal
      title="Select Officer for Signature"
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      okText="Send Request"
      cancelText="Cancel"
      confirmLoading={loading}
    >
      <Form layout="vertical">
        <Form.Item label="Select Officer" required>
          <Select
            placeholder="Select an officer"
            value={selectedOfficer}
            onChange={onSelectOfficer}
            options={officers.map((o) => ({
              label: `${o.name} <${o.email}>`,
              value: o.id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OfficerSelectionModal;
