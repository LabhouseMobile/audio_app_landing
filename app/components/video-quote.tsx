import TestimonialSingle from "./testimonial-single";


function VideoQuote() {

  return (
    <section className="overflow-hidden bg-white" id="video">
      <div className="mx-auto max-w-6xl">
        <div className="mb-20 flex w-full flex-col md:flex-row gap-12 text-center px-10">
          <div className="flex-1 w-full h-full">
                <video src="/video-app.mp4" autoPlay muted loop className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 w-full my-auto border border-zinc-200 rounded-2xl bg-slate-50 p-8 shadow-lg shadow-blue-300/50">
            <TestimonialSingle testimonial={{
              name: "Isabella",
              schoolName: "Operations Manager",
              content: "I have successfully utilized this product to enhance my work performance and navigate through various experiences. My job involves analyzing and addressing job-related challenges in diverse situations.",
              image: "/review-6.png",
            }} />
          </div>
        </div>
      </div>
    </section>
  );
}


export default VideoQuote;