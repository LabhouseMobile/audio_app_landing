import { Button } from "./components/button";
import HeaderBanner from "./components/header-banner";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderBanner includeCTA={true} />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-slate-200 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              Page Not Found
            </h2>
            <p className="text-slate-600 mb-8">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It
              might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <Button href="/" color="blue" className="w-full md:w-auto">
            Go Back Home
          </Button>
        </div>
      </main>
    </div>
  );
}
