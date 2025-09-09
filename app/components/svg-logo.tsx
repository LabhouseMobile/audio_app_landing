import Image from "next/image";
import React from "react";

const SVGLogo: React.FC = () => (
  <div className="w-[44px] h-[44px]">
    <Image
      src="/logo-1024.png"
      alt="Logo"
      width={88}
      height={88}
      priority
      quality={100}
      className="object-contain w-full h-full"
    />
  </div>
);

export default SVGLogo;
