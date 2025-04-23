import React from "react";

export type QRCodeType = "text" | "pdf" | "app" | "auto" | "guests" | "self" | "chat";

interface QRCodeProps {
  type: QRCodeType;
}

const QRCode: React.FC<QRCodeProps> = ({ type }) => {
  return (
    <div className="qr-code-container">
      <img 
        src={`/qr/qr-${type}-web.svg`} 
        alt={`QR code for ${type}`}
        width={200}
        height={200}
      />
    </div>
  );
};

export default QRCode;
