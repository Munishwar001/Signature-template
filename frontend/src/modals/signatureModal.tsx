import React from "react";
import { Modal, Button, Image, Input, message } from "antd";

interface SignatureImage {
  id: string;
  url: string;
}

interface Props {
  visible: boolean;
  images: SignatureImage[];
  selectedImage: SignatureImage | null;
  onSelectImage: (image: SignatureImage) => void;
  onCancel: () => void;
  onSignClick: () => void;
  onUploadClick: () => void;
}

const SignatureModal1: React.FC<Props> = ({
  visible,
  images,
  selectedImage,
  onSelectImage,
  onCancel,
  onSignClick,
  onUploadClick,
}) => {
  return (
    <Modal
      title="Your Uploaded Signatures"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Close
        </Button>,
        <Button key="upload" type="default" onClick={onUploadClick}>
          Upload Signature
        </Button>,
        <Button key="sign" type="primary" onClick={onSignClick}>
          Sign
        </Button>,
      ]}
    >
      {images.length > 0 ? (
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            paddingRight: "8px",
          }}
        >
          {images.map((img, idx) => (
            <Image
              key={idx}
              src={img.url}
              alt={`Signature ${idx + 1}`}
              preview={false}
              onClick={() => onSelectImage(img)}
              style={{
                width: 120,
                border:
                  selectedImage?.url === img.url
                    ? "3px solid #1890ff"
                    : "1px solid #ccc",
                padding: 4,
                borderRadius: 4,
                cursor: "pointer",
                transition: "border 0.2s",
              }}
            />
          ))}
        </div>
      ) : (
        <p>No signatures uploaded yet.</p>
      )}
    </Modal>
  );
};

export default SignatureModal1;
