import { requestClient } from "../../store";
import { message } from "antd";

export const fetchRequestData = async (
  setRequest: (data: any[]) => void,
  setLoading: (val: boolean) => void) => {
  try {
    setLoading(true);
    const response = await requestClient.getRequest();
    setRequest(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error("Error fetching requests:", error);
    message.error("Failed to fetch requests");
    setRequest([]);
  } finally {
    setLoading(false);
  }
};
