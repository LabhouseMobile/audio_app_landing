import DownloadAppStore from "./download-appstore";
import DownloadPlayStore from "./download-playstore";
import QRCode from "./qr-code";

export default function DownloadSection() {
  return (
    <div
      className="flex flex-col my-24 gap-12 items-center justify-center"
      id="download"
    >
      <h2 className="text-4xl font-bold">
        Download
        <span className="relative mt-2 inline-block ml-2">
          <span className="absolute inset-0 rotate-2 transform bg-blue-600"></span>
          <span className="relative z-10 px-2 py-2 text-white">for free</span>
        </span>
      </h2>
      <div className="flex flex-col gap-12 md:flex-row items-center justify-center">
        <div className="flex flex-col gap-4 md:gap-6">
          <DownloadAppStore />
          <DownloadPlayStore />
        </div>
        <div className=" flex-col items-center justify-center hidden md:flex">
          Scan to try for Free
          <QRCode />
        </div>
      </div>
    </div>
  );
}
