// src/helpers/signatureHandlers.ts
import { message } from "antd";
import { otpClient } from "../store";


export const handleSignClick = async (
  selectedImage: { id: string; url: string } | null,
  selectedRequestId: string | undefined,
  closeSignatureModal: () => void,
  openOtpModal: () => void
) => {
  if (!selectedImage) {
    message.warning("Please select a signature image.");
    return;
  }

  await otpClient.generateOtp(selectedRequestId);
  message.success("OTP sent successfully");

  closeSignatureModal();
  openOtpModal();
};
