import { message } from "antd";
import { requestClient } from "../../store";

export const handleDeleteRequest = async (
  record: any,
  templateId: string | undefined,
  fetchDataCallback: () => Promise<void>
) => {
  try {
    const response = await requestClient.deleteRequest(record, templateId);
    if (response) {
      message.success("Deleted");
      await fetchDataCallback();
    }
  } catch (err) {
    console.error("Error while deleting request =>", err);
    message.error("Failed to delete");
  }
};
