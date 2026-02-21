"use client"

import { useState, useEffect } from "react";
import { authClient } from "@/utils/auth-client";
import { useRouter } from "next/navigation";
import { Navbar } from "../components/Navbar";
import { fetchUserMatches } from "../service/api";
import { Match } from "@/type";
import Link from "next/link";
import { formatTime } from "@/utils/format-date";

export default function CMSPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Form state
    const [sport, setSport] = useState("Football");
    const [homeTeam, setHomeTeam] = useState("");
    const [awayTeam, setAwayTeam] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/signin");
        }
    }, [session, isPending, router]);

    useEffect(() => {
        const getMatches = async () => {
            try {
                const data = await fetchUserMatches();
                setMatches(data.events);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getMatches();
    }, []);

    const handleCreateMatch = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const start = new Date(startTime).toISOString();
            const end = new Date(endTime).toISOString();

            const res = await fetch("/api/matches", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sport,
                    homeTeam,
                    awayTeam,
                    startTime: start,
                    endTime: end,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.error || "Failed to create match");
            } else {
                setMatches([result.data, ...matches]);
                setShowCreateForm(false);
                setHomeTeam("");
                setAwayTeam("");
                setStartTime("");
                setEndTime("");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteMatch = async (id: number) => {
        if (!confirm("Are you sure? This will delete all commentary for this match.")) return;
        try {
            const res = await fetch(`/api/matches/${id}`, { method: "DELETE" });
            if (res.ok) {
                setMatches(matches.filter(m => m.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (isPending || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 ">
            <main className="max-w-7xl mx-auto px-4 flex flex-col gap-5">
                <Navbar />

                <div className="mt-12 flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-4xl font-bold text-black uppercase tracking-tighter">Match Management</h2>
                        <p className="text-zinc-500 mt-2 font-medium">Create and manage your sport events</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="bg-black text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-wide hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-black/10"
                    >
                        {showCreateForm ? "Close Form" : "Create New Match"}
                    </button>
                </div>

                {showCreateForm && (
                    <div className="bg-white border-4 text-black border-black rounded-3xl p-8 mb-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-in fade-in slide-in-from-top-4 duration-300">
                        <form onSubmit={handleCreateMatch} className="grid grid-cols-2 gap-8">
                            {error && (
                                <div className="col-span-2 bg-red-100 border-2 border-red-500 text-red-600 p-4 rounded-xl font-bold">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="block font-bold uppercase text-xs tracking-widest text-zinc-400">Sport Type</label>
                                <input
                                    value={sport}
                                    onChange={(e) => setSport(e.target.value)}
                                    className="w-full bg-zinc-100 border-2 border-black rounded-xl p-4 font-bold focus:bg-white transition-colors outline-none"
                                    placeholder="Football, Basketball..."
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block font-bold uppercase text-xs tracking-widest text-zinc-400">Home Team</label>
                                <input
                                    value={homeTeam}
                                    onChange={(e) => setHomeTeam(e.target.value)}
                                    className="w-full bg-zinc-100 border-2 border-black rounded-xl p-4 font-bold focus:bg-white transition-colors outline-none"
                                    placeholder="Team A"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block font-bold uppercase text-xs tracking-widest text-zinc-400">Away Team</label>
                                <input
                                    value={awayTeam}
                                    onChange={(e) => setAwayTeam(e.target.value)}
                                    className="w-full bg-zinc-100 border-2 border-black rounded-xl p-4 font-bold focus:bg-white transition-colors outline-none"
                                    placeholder="Team B"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block font-bold uppercase text-xs tracking-widest text-zinc-400">Start Time</label>
                                <input
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full bg-zinc-100 border-2 border-black rounded-xl p-4 font-bold focus:bg-white transition-colors outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block font-bold uppercase text-xs tracking-widest text-zinc-400">End Time (Expected)</label>
                                <input
                                    type="datetime-local"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full bg-zinc-100 border-2 border-black rounded-xl p-4 font-bold focus:bg-white transition-colors outline-none"
                                    required
                                />
                            </div>

                            <div className="col-span-2 flex justify-end mt-4">
                                <button
                                    disabled={submitting}
                                    className="bg-green-400 border-4 border-black px-12 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-green-500 transition-colors disabled:opacity-50"
                                >
                                    {submitting ? "Creating..." : "Launch Match"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-48 bg-zinc-200 animate-pulse rounded-3xl border-2 border-zinc-300"></div>
                        ))
                    ) : (
                        matches.length === 0 ? (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center border-4 border-dashed border-zinc-200 rounded-[2.5rem] bg-zinc-100/50">
                                <div className="text-center">
                                    <h2 className="text-4xl font-bold text-black uppercase tracking-tighter">No Matches Found</h2>
                                    <p className="text-zinc-500 mt-2 font-medium">Create your first match to get started</p>
                                </div>
                            </div>
                        ) : (
                            matches.map((match) => (
                                <div key={match.id} className="bg-white text-black border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="bg-zinc-100 border-2 border-black rounded-full px-3 py-1 text-xs font-bold uppercase">{match.sport}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border-2 border-black ${match.status === 'live' ? 'bg-red-500 text-white' :
                                            match.status === 'finished' ? 'bg-zinc-800 text-white' : 'bg-yellow-400'
                                            }`}>
                                            {match.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-bold">{match.homeTeam}</span>
                                            <span className="text-2xl font-black">{match.homeScore}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-bold">{match.awayTeam}</span>
                                            <span className="text-2xl font-black">{match.awayScore}</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t-2 border-black/5 flex justify-between items-end">
                                        <span className="text-xs text-zinc-400 font-bold uppercase">
                                            {formatTime(match.startTime)}
                                        </span>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/cms/matches/${match.id}`}
                                                className="p-2 hover:bg-zinc-100 rounded-lg transition-colors border-2 border-transparent hover:border-black"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </Link>
                                            <button
                                                onClick={(e) => { e.preventDefault(); handleDeleteMatch(Number(match.id)); }}
                                                className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-500 border-2 border-transparent hover:border-red-500"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )

                    )

                    }

                </div>
            </main>
        </div>
    );
}
