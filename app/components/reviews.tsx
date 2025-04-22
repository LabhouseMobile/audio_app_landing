import Image, { StaticImageData } from "next/image";
import reviewImg1 from "../../public/review_1.png";
import reviewImg2 from "../../public/review_2.png";
import reviewImg3 from "../../public/review_3.png";
import reviewImg4 from "../../public/review_4.png";
import reviewImg5 from "../../public/review_5.png";

interface ReviewProps {
    name: string;
    role: string;
    title: string;
    image: string | StaticImageData;
    content: string;
}

function Reviews() {
  const reviews: ReviewProps[] = [
    {
      name: "Alex Morgan",
      role: "Project Manager",
      title: "Meeting notes on autopilot",
      image: reviewImg4,
      content: "Summary AI has transformed our team meetings. No more scrambling to take notes - we get perfect transcripts and action items automatically.",
    },
    {
      name: "Sarah Chen",
      role: "Graduate Student",
      title: "Perfect lecture notes",
      image: reviewImg1,
      content: "As a PhD student, I record all my lectures and Summary AI creates perfectly organized notes. It even highlights key concepts I might have missed!",
    },
    {
      name: "James Wilson",
      role: "Content Creator",
      title: "Podcast notes in seconds",
      image: reviewImg3,
      content: "I upload my podcast recordings to Summary AI and get detailed show notes instantly. My audience loves the summaries I can now provide.",
    },
    {
      name: "Michelle Rodriguez",
      role: "Sales Director",
      title: "Calendar integration is magic",
      image: reviewImg2,
      content: "The calendar integration is a game-changer. Summary AI joins my calls automatically and everyone gets detailed notes in their inbox after - no effort required.",
    },
    {
      name: "David Kumar",
      role: "Executive Assistant",
      title: "Time-saving essential",
      image: reviewImg5,
      content: "I manage a busy executive calendar. Summary AI joins every meeting and delivers concise summaries to all participants. It's like having an extra team member.",
    }
  ];

  return (
    <section className="overflow-hidden bg-slate-50" id="reviews">
      <div className="mx-auto max-w-screen py-24">
        <div className="mb-20 flex w-full flex-col text-center px-10">
          <h2 className="mx-auto mb-8 max-w-xl text-3xl font-bold tracking-tight text-slate-800 lg:text-5xl">
            What Our Users Are Saying
          </h2>
          <div className="mx-auto max-w-md font-medium text-slate-500">
            See how professionals across industries are saving time and improving productivity with Summary AI.
          </div>
        </div>
        
        {/* Horizontal scrolling container with snap points */}
        <div className="relative py-5 overflow-hidden">
          <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar px-10">
            {reviews.map((review, index) => (
              <div key={index} className="flex-none w-[calc(100%-40px)] max-w-[380px] mr-5 snap-start">
                <ReviewCard {...review} />
              </div>
            ))}
          </div>
          
         
        </div>
      </div>
      
     
    </section>
  );
}

function ReviewCard({
  title,
  image,
  name,
  role,
  content,
}: ReviewProps) {
  return (
    <div className={`relative h-full rounded-lg border border-zinc-200`}>
     
      
      <div className="flex h-full flex-col gap-5 rounded-lg bg-white p-8 lg:gap-6">
        {/* Avatar and info */}
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 overflow-hidden rounded-full bg-gray-100">
            {typeof image === 'string' ? (
              <img src={image} alt={name} className="h-full w-full object-cover" />
            ) : (
              <Image src={image} alt={name} width={56} height={56} />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">{name}</h4>
            <p className="text-sm text-slate-500">{role}</p>
          </div>
        </div>
        
        {/* Review content */}
        <div>
          <h3 className="mb-2 text-xl font-bold text-slate-800">{title}</h3>
          {content && <p className="mt-3 text-slate-700">{content}</p>}
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i}
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="h-5 w-5 text-yellow-400"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
                  clipRule="evenodd" 
                />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reviews;