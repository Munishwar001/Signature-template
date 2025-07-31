import { signClient } from "../../store";
import { message } from "antd";

export const fetchUploadedSignaturesUtil = async (
  session: string | undefined,
  setSignatureImages: (images: { id: string; url: string }[]) => void,
  setSelectedRequest: (record: any) => void,
  record: any
) => {
  if (!session) {
    message.error("User session not found.");
    return;
  }

  try {
    const response = await signClient.getSign(session);
    const images = Array.isArray(response)
      ? response.map((item: any) => ({
          id: item.id,
          url: item.url,
        }))
      : [];
    setSignatureImages(images);
    setSelectedRequest(record);
  } catch (error) {
    console.error("Error fetching signatures:", error);
    message.error("Failed to load signatures");
    setSignatureImages([]);
  }
};
