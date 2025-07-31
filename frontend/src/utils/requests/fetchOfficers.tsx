import { message } from "antd";
import { requestClient } from "../../store";

export const handleOfficerSelection = async ({
  selectedOfficer,
  selectedRequest,
  onSuccess,
}: {
  selectedOfficer: string | null;
  selectedRequest: any;
  onSuccess: () => void;
}) => {
  if (!selectedOfficer || !selectedRequest) {
    message.error("Please select an officer.");
    return;
  }

  try {
    await requestClient.sendRequestToOfficer({
      recordId: selectedRequest.id,
      officerId: selectedOfficer,
    });
    message.success("Request sent for signature");
    onSuccess(); 
  } catch (err) {
    console.error("Error sending request:", err);
    message.error("Failed to send request");
  }
};
