"use client"

import { authClient } from "@/utils/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, Activity } from "lucide-react";

export const Navbar = () => {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await authClient.signOut();
        router.refresh();
    };

    return (
        <nav className="relative z-50 flex flex-col md:flex-row mt-15 text-black p-4 rounded-2xl border-b-6 border-r-6 border-t-2 border-l-2 border-black shadow-2xl justify-between bg-amber-300">
            <div className="flex justify-between items-center w-full md:w-auto">
                <div className="flex flex-col">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Activity className="size-8 group-hover:rotate-12 transition-transform" />
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Sportz</h1>
                    </Link>
                    <h3 className="text-sm md:text-md font-bold text-black/60 uppercase tracking-widest leading-none mt-1">Real-time match data</h3>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 border-2 border-black rounded-xl bg-white/20 hover:bg-white/40 transition-colors"
                >
                    {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </div>

            {/* Navigation Links */}
            <div className={`
                flex-col md:flex-row items-center gap-4 md:gap-6 mt-4 md:mt-0
                ${isMenuOpen ? 'flex' : 'hidden md:flex'}
            `}>
                <div className="flex items-center gap-2 bg-black/5 px-3 py-1.5 rounded-full border border-black/10">
                    <div className="size-3 rounded-full bg-red-600 animate-pulse"></div>
                    <span className="text-sm font-black uppercase italic">Live Feed</span>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                    {isPending ? (
                        <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
                    ) : session ? (
                        <>
                            <Link
                                href={pathname === '/cms' ? '/dashboard' : '/cms'}
                                className="w-full md:w-auto text-center px-6 py-2.5 bg-black text-white rounded-xl font-black uppercase italic tracking-wider hover:bg-zinc-800 transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black"
                            >
                                {pathname === '/cms' ? 'Dashboard' : 'My Terminal'}
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="w-full md:w-auto px-6 py-2.5 bg-white border-2 border-black rounded-xl font-black uppercase italic tracking-wider hover:bg-black/5 transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/signin"
                            className="w-full md:w-auto text-center px-8 py-2.5 bg-black text-white rounded-xl font-black uppercase italic tracking-wider hover:bg-zinc-800 transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
