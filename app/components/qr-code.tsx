import Image from "next/image";
import React from "react";

const QRCode: React.FC = () => {
  return (
    <div className="qr-code-container">
      <Image src={`/qr-code.png`} alt={`QR code `} width={200} height={200} />
    </div>
  );
};

export default QRCode;
