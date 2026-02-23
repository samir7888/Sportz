import Link from "next/link";
import { Navbar } from "./components/Navbar";
import {
  Trophy,
  Zap,
  LayoutDashboard,
  Users,
  ChevronRight,
  Play,
  Activity,
  Award,
  BarChart3
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-yellow-200">
      {/* Navbar Container */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <Navbar />
      </div>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 border border-yellow-200 text-yellow-800 text-sm font-semibold mb-6 animate-fade-in">
                <Zap className="size-4" />
                <span>Real-time sports commentary platform</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8 max-w-4xl italic uppercase">
                Experience the Game <span className="text-yellow-500">Live</span> as it Happens
              </h1>

              <p className="text-xl md:text-2xl text-zinc-600 mb-10 max-w-2xl font-medium">
                The most advanced sports commentary engine. Real-time updates, granular cricket & football data, and a powerful CMS for creators.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Link
                  href="/signup"
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-black text-white text-xl font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 border-b-6 border-zinc-800 hover:border-zinc-700"
                >
                  <span className="relative z-10">Start Your Journey</span>
                  <ChevronRight className="relative z-10 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 text-black text-xl font-bold rounded-2xl transition-all hover:bg-yellow-500 active:scale-95 border-b-6 border-yellow-600 shadow-xl"
                >
                  <Play className="mr-2 fill-current" />
                  Live Preview
                </Link>
              </div>

              {/* Floating Social Proof */}
              <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 font-black text-2xl uppercase italic"><Trophy className="size-8" /> Football</div>
                <div className="flex items-center gap-2 font-black text-2xl uppercase italic"><Award className="size-8" /> Cricket</div>
                <div className="flex items-center gap-2 font-black text-2xl uppercase italic"><Activity className="size-8" /> Real-time</div>
              </div>
            </div>
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-300/20 rounded-full blur-[120px] -z-10 animate-pulse-slow font-medium"></div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-zinc-50 border-y-2 border-black/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-4">Engineered for Performance</h2>
              <p className="text-xl text-zinc-600 max-w-2xl mx-auto">Built with a state-of-the-art tech stack to deliver match updates with zero latency.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 bg-white border-4 border-black rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform cursor-default group">
                <div className="size-16 bg-yellow-400 border-2 border-black rounded-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-6 transition-transform">
                  <Zap className="size-8 text-black" />
                </div>
                <h3 className="text-2xl font-black uppercase mb-3">Instant Updates</h3>
                <p className="text-zinc-600 font-medium">Leveraging Pusher's WebSocket mesh for sub-second latency commentary delivery across the globe.</p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 bg-black text-white border-4 border-black rounded-[32px] shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] hover:-translate-y-2 transition-transform cursor-default group">
                <div className="size-16 bg-yellow-400 border-2 border-white rounded-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] group-hover:rotate-3 transition-transform">
                  <LayoutDashboard className="size-8 text-black" />
                </div>
                <h3 className="text-2xl font-black uppercase mb-3 text-yellow-400">Power CMS</h3>
                <p className="text-zinc-400 font-medium">Own your match data. A professional-grade dashboard to manage teams, scores, and live commentary feeds.</p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 bg-white border-4 border-black rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform cursor-default group">
                <div className="size-16 bg-yellow-400 border-2 border-black rounded-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-rotate-6 transition-transform">
                  <BarChart3 className="size-8 text-black" />
                </div>
                <h3 className="text-2xl font-black uppercase mb-3">Sport Specific</h3>
                <p className="text-zinc-600 font-medium">Tailored experiences for Cricket (overs, runs) and Football (minutes, goal notifications) in one app.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Showcase / CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="bg-yellow-400 border-4 border-black rounded-[48px] p-12 md:p-20 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-8 leading-tight">Ready to Take Control of the Field?</h2>
              <p className="text-2xl font-bold mb-12 max-w-xl text-black/80">Join 1,000+ creators and fans using Sportz for their live match updates today.</p>

              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  href="/signup"
                  className="px-12 py-5 bg-black text-white text-2xl font-black rounded-2xl shadow-2xl hover:bg-zinc-800 transition-colors uppercase tracking-widest"
                >
                  Create Account
                </Link>
                <Link
                  href="/signin"
                  className="px-12 py-5 bg-white text-black border-4 border-black text-2xl font-black rounded-2xl hover:bg-zinc-50 transition-colors uppercase tracking-widest"
                >
                  Member Login
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative icons floating */}
          <Trophy className="absolute top-20 left-10 size-32 text-yellow-100 opacity-20 rotate-12 -z-10" />
          <Award className="absolute bottom-20 right-10 size-32 text-yellow-100 opacity-20 -rotate-12 -z-10" />
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t-2 border-black/5 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-black uppercase italic">Sportz</h2>
            <p className="text-zinc-500 font-medium">© 2026 Sportz Inc. All rights reserved.</p>
          </div>

          <div className="flex gap-8 text-zinc-600 font-bold uppercase text-sm tracking-widest">
            <Link href="#" className="hover:text-yellow-600 transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-yellow-600 transition-colors">Github</Link>
            <Link href="#" className="hover:text-yellow-600 transition-colors">Discord</Link>
          </div>
        </div>
      </footer>

      {/* Tailwind animation extensions (inline style for demo) */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.3; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
      `}} />
    </div>
  );
}
