"use client"

import { authClient } from "@/utils/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Navbar = () => {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.refresh();
    };

    return (
        <div className="flex mt-15 text-black p-4 rounded-2xl border-b-6 border-r-6 border-t-2 border-l-2 border-black shadow-2xl justify-between bg-amber-300">
            <div className="flex flex-col">
                <Link href="/">
                    <h1 className="text-3xl font-bold">Sportz</h1>
                </Link>
                <h3 className="text-lg">Real-time match data demo</h3>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="size-4 rounded-full bg-green-600 animate-pulse"></div>
                    <span className="text-lg font-semibold">Live</span>
                </div>

                <div className="flex items-center gap-4">
                    {isPending ? (
                        <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    ) : session ? (
                        <>
                            <Link href="/cms" className="px-4 py-2 bg-black text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors">
                                CMS
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="px-4 py-2 border-2 border-black rounded-xl font-medium hover:bg-black/5 transition-colors"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link href="/signin" className="px-4 py-2 bg-black text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}