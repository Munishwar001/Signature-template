import { Modal, Form, Input, message } from "antd";
import { useState } from "react";
import { requestClient } from "../store";

interface RejectionModalProps {
  visible: boolean;
  onClose: () => void;
  record: { id: string } | null;
  onRejected: () => void;
}

const RejectionFormModal: React.FC<RejectionModalProps> = ({
  visible,
  onClose,
  record,
  onRejected,
}) => {
  const [reason, setReason] = useState("");

  const handleOk = async () => {
    if (!reason.trim()) {
      message.warning("Please provide a reason for rejection.");
      return;
    }

    try {
      await requestClient.handleRejectRequest(record?.id, reason);
      message.success("Request rejected successfully.");
      onClose();
      setReason("");
      onRejected();
    } catch (err) {
      console.error("Rejection failed:", err);
      message.error("Failed to reject request.");
    }
  };

  const handleCancel = () => {
    setReason("");
    onClose();
  };

  return (
    <Modal
      title="Rejection Reason"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Reject"
      cancelText="Cancel"
    >
      <Form layout="vertical">
        <Form.Item label="Reason for Rejection" required>
          <Input.TextArea
            rows={4}
            placeholder="Enter reason here..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RejectionFormModal;
