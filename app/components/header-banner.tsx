function HeaderBanner() {
  return (
    <div className="bg-[#E9F3FF] min-h-10">  
      <div className="container mx-auto px-4 py-2"> 
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4 text-sm text-gray-600 font-bold text-center">
            <span className="mr-10">
            #1 Transcription App 2025.
            </span>
            <span className="flex items-center justify-between">
            {[...Array(5)].map((_, index) => (
            <span key={index}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-yellow-500"
              >
                <path
                  fillRule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
          ))}
            </span>
            <span>
            Rated 4.9 out of 5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderBanner;
