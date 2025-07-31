import { message } from "antd";
import { requestClient } from "../../store";

export const addNewRequest = async ({
  form,
  setLoading,
  fetchRequest,
  closeDrawer,
}: {
  form: any;
  setLoading: (val: boolean) => void;
  fetchRequest: () => Promise<void> | void;
  closeDrawer: () => void;
}) => {
  try {
    const values = await form.validateFields();
    setLoading(true);
    await requestClient.uploadFormData(values);
    message.success("Request submitted successfully");
    form.resetFields();
    closeDrawer();
    await fetchRequest();
  } catch (error) {
    console.error("Error adding request:", error);
    message.error("Failed to submit request");
  } finally {
    setLoading(false);
  }
};
