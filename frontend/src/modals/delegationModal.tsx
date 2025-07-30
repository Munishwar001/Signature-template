// src/modals/DelegateModal.tsx

import React, { useState } from "react";
import { Modal, Button, Form, Input, message } from "antd";
import { requestClient } from "../store"; // Import your request client here

interface DelegateModalProps {
  visible: boolean;
  onClose: () => void;
  delegationRecord: any;
  fetchRequest: () => void;
}

const DelegateModal: React.FC<DelegateModalProps> = ({
  visible,
  onClose,
  delegationRecord,
  fetchRequest,
}) => {
  const [delegateReason, setDelegateReason] = useState<string>("");

  const handleDelegateSubmit = async () => {
    if (!delegateReason.trim()) {
      message.warning("Please enter a reason for delegation.");
      return;
    }

    try {
      await requestClient.handleDelegate({
        recordId: delegationRecord?.id,
        reason: delegateReason,
      });
      message.success("Request delegated successfully");
      onClose(); 
      setDelegateReason("");
      fetchRequest();
    } catch (err) {
      console.error("Delegation error:", err);
      message.error("Failed to delegate request");
    }
  };

  return (
    <Modal
      title="Delegate Request"
      visible={visible}
      onCancel={onClose}
      onOk={handleDelegateSubmit}
      okText="Submit"
      cancelText="Cancel"
    >
      <Form layout="vertical">
        <Form.Item label="Reason for Delegation" required>
          <Input.TextArea
            rows={4}
            placeholder="Enter reason here..."
            value={delegateReason}
            onChange={(e) => setDelegateReason(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DelegateModal;
