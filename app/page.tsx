import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimatedTooltipPreview } from "@/components/AnimatedTooltip";

export default function Home() {
  return (
    <div className="min-h-screen ">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-xl">Taskzy</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/login"
          >
            Login
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/signup"
          >
            Sign Up
          </Link>
        </nav>
      </header>
      <main className="flex justify-center w-full  mx-auto md:h-auto h-screen pt-20 md:pt-0">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
              <h1 className="text-3xl font-bold  sm:text-4xl md:text-5xl lg:text-8xl max-w-5xl">
            <span className="leading-tight">
            Manage Your Tasks  { " " }
           <span className="bg-gradient-to-r from-orange-400 to-yellow-400 text-transparent bg-clip-text">
             Efficiently
         </span>
  </span>
</h1>

                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Track your projects and tasks in one place. Stay organized and
                  boost your productivity.
                </p>
              </div>

              <div className="space-x-4">
                <Link href="/signup">
                  <Button className="px-8">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="px-8">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
