import { message } from "antd";

export const handlePreviewRequest = (
  record: any,
  templateSignStatus: number,
  templateId: string | undefined
) => {
  try {
    const isSigned = record.signStatus === 5 || templateSignStatus === 5;

    const previewUrl = isSigned
      ? `${record.url?.startsWith("http") ? record.url : `http://localhost:3000/${record.url}`}`
      : `http://localhost:3000/api/templates/preview/${templateId}/${record.id}`;

    window.open(previewUrl, "_blank");
  } catch (err) {
    console.error("Error in preview:", err);
    message.error("Preview failed");
  }
};
