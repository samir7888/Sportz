"use client"

import { useState, use } from "react";
import { authClient } from "@/utils/auth-client";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/components/Navbar";
import { Match, Commentary } from "@/type";
import { useQuery } from "@tanstack/react-query";
import { useAppMutation } from "@/app/hooks/useAppMutation";

export default function MatchCMSPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    // Form state
    const [minute, setMinute] = useState("");
    const [period, setPeriod] = useState("1st Half");
    const [eventType, setEventType] = useState("commentary");
    const [message, setMessage] = useState("");



    const { data: matchData, isLoading: matchLoading } = useQuery({
        queryKey: ["matches", id],
        queryFn: async () => {
            const res = await fetch(`/api/matches`);
            const data = await res.json();
            const found = data.events.find((m: Match) => m.id === parseInt(id)) as Match;
            if (found) {
                setHomeScore(found.homeScore);
                setAwayScore(found.awayScore);
            }
            return found;
        },
        enabled: !!session,
    });

    const { data: commentariesData, isLoading: commLoading } = useQuery({
        queryKey: ["commentaries", id],
        queryFn: async () => {
            const res = await fetch(`/api/matches/${id}/commentary`);
            const data = await res.json();
            return data.data as Commentary[];
        },
        enabled: !!session,
    });
    // Score state
    const match = matchData;
    const [homeScore, setHomeScore] = useState<string | number>();
    const [awayScore, setAwayScore] = useState<string | number>();

    const commentaries = commentariesData || [];
    const loading = matchLoading || commLoading;

    const mutation = useAppMutation();
    const submitting = mutation.isPending;
    const error = mutation.error ? ((mutation.error as any).response?.data?.message || (mutation.error as any).message || "An error occurred") : null;

    const handleUpdateScore = async (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            endpoint: `matches/${id}`,
            method: "patch",
            data: { homeScore, awayScore },
            invalidateTags: [["matches", id]],
        });
    };

    const handleAddCommentary = async (e: React.FormEvent) => {
        e.preventDefault();

        mutation.mutate({
            endpoint: `matches/${id}/commentary`,
            method: "post",
            data: {
                minute: parseInt(minute),
                sequence: commentaries.length + 1,
                period,
                eventType,
                message,
            },
            invalidateTags: [["commentaries", id]],
            onSuccess: () => {
                setMessage("");
                setMinute("");
            }
        });
    };
    const handleDeleteCommentary = async (commentaryId: number) => {
        if (!confirm("Delete this update?")) return;

        mutation.mutate({
            endpoint: `matches/${id}/commentary`,
            method: "delete",
            id: commentaryId.toString(),
            invalidateTags: [["commentaries", id]],
        });
    };

    if (isPending || !session || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!match) return <div>Match not found</div>;

    return (
        <div className="min-h-screen flex flex-col gap-5 bg-zinc-50 pb-20">
            <main className="min-w-7xl mx-auto px-4">
                <Navbar />

                <div className="mt-12 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-zinc-500 font-bold uppercase text-sm hover:text-black transition-colors mb-4"
                    >
                        ← Back to CMS
                    </button>
                    <h2 className="text-4xl font-bold text-black uppercase tracking-tighter">
                        Manage Match: {match.homeTeam} vs {match.awayTeam}
                    </h2>
                </div>

                {/* Sidebar Forms */}
                <div className="flex justify-between gap-12">
                    {/* Score Update Form */}
                    <div className="bg-white text-black border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-xl font-bold mb-6 uppercase tracking-tight">Update Score</h3>
                        <form onSubmit={handleUpdateScore} className="space-y-4">
                            {match.sport === "football" ? (<div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block font-bold uppercase text-[10px] tracking-widest text-zinc-400">{match.homeTeam}</label>
                                    <input
                                        type="number"
                                        value={homeScore}
                                        onChange={(e) => setHomeScore(Number(e.target.value))}
                                        className="w-full bg-zinc-100 border-2 border-black rounded-xl p-3 font-bold focus:bg-white transition-colors outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-bold uppercase text-[10px] tracking-widest text-zinc-400">{match.awayTeam}</label>
                                    <input
                                        type="number"
                                        value={awayScore}
                                        onChange={(e) => setAwayScore(Number(e.target.value))}
                                        className="w-full bg-zinc-100 border-2 border-black rounded-xl p-3 font-bold focus:bg-white transition-colors outline-none"
                                    />
                                </div>
                            </div>)
                                : (
                                    <>
                                        <div className="space-y-2">
                                            <label className="block font-bold uppercase text-[10px] tracking-widest text-zinc-400">{match.homeTeam}</label>
                                            <input
                                                type="string"
                                                placeholder="123/2..."
                                                value={homeScore}
                                                onChange={(e) => setHomeScore(e.target.value)}
                                                className="w-full bg-zinc-100 border-2 border-black rounded-xl p-3 font-bold focus:bg-white transition-colors outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block font-bold uppercase text-[10px] tracking-widest text-zinc-400">{match.awayTeam}</label>
                                            <input
                                                type="string"
                                                value={awayScore}
                                                onChange={(e) => setAwayScore(e.target.value)}
                                                className="w-full bg-zinc-100 border-2 border-black rounded-xl p-3 font-bold focus:bg-white transition-colors outline-none"
                                            />
                                        </div>
                                    </>

                                )}
                            <button
                                disabled={submitting}
                                className="w-full bg-blue-400 border-4 border-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-500 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                            >
                                {submitting ? "Updating..." : "Update Score"}
                            </button>
                        </form>
                    </div>

                    {/* Add Commentary Form */}
                    <div className="bg-white w-full text-black border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-8">
                        <h3 className="text-xl font-bold mb-6 uppercase tracking-tight">Add Commentary</h3>
                        <form onSubmit={handleAddCommentary} className="space-y-4">
                            {error && (
                                <div className="bg-red-100 border-2 border-red-500 text-red-600 p-3 rounded-lg text-sm font-bold">
                                    {String(error)}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="block font-bold uppercase text-xs tracking-widest text-zinc-400">{
                                    match.sport === 'football' ? 'Minute' : 'Over'
                                }</label>
                                <input
                                    type="number"
                                    placeholder={match.sport === 'football' ? 'Minute' : 'Over'}
                                    value={minute}
                                    onChange={(e) => setMinute(e.target.value)}
                                    className="w-full bg-zinc-100 border-2 border-black rounded-xl p-3 font-bold focus:bg-white transition-colors outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block font-bold uppercase text-xs tracking-widest text-zinc-400">Period</label>

                                {
                                    match.sport === 'football' ? (
                                        <select
                                            value={period}
                                            onChange={(e) => setPeriod(e.target.value)}
                                            className="w-full bg-zinc-100 border-2 border-black rounded-xl p-3 font-bold focus:bg-white transition-colors outline-none"
                                        >
                                            <option>1st Half</option>
                                            <option>2nd Half</option>
                                            <option>Extra Time</option>
                                            <option>Penalties</option>
                                        </select>
                                    ) : (
                                        <select
                                            value={period}
                                            onChange={(e) => setPeriod(e.target.value)}
                                            className="w-full bg-zinc-100 border-2 border-black rounded-xl p-3 font-bold focus:bg-white transition-colors outline-none"
                                        >
                                            <option>1st Innings</option>
                                            <option>2nd Innings</option>
                                        </select>
                                    )
                                }
                            </div>

                            <div className="space-y-2">
                                <label className="block font-bold uppercase text-xs tracking-widest text-zinc-400">Event Type</label>

                                {
                                    match.sport === 'football' ? (
                                        <select
                                            value={eventType}
                                            onChange={(e) => setEventType(e.target.value)}
                                            className="w-full bg-zinc-100 border-2 border-black rounded-xl p-3 font-bold focus:bg-white transition-colors outline-none"
                                        >
                                            <option value="commentary">Commentary</option>
                                            <option value="goal">Goal</option>
                                            <option value="card">Card</option>
                                            <option value="substitution">Substitution</option>
                                        </select>
                                    ) : (
                                        <select
                                            value={eventType}
                                            onChange={(e) => setEventType(e.target.value)}
                                            className="w-full bg-zinc-100 border-2 border-black rounded-xl p-3 font-bold focus:bg-white transition-colors outline-none"
                                        >
                                            <option value="commentary">Commentary</option>
                                            <option value="wicket">Wicket</option>
                                            <option value="boundary">Boundary</option>
                                            <option value="run">Run</option>
                                        </select>
                                    )
                                }

                            </div>

                            <div className="space-y-2">
                                <label className="block font-bold uppercase text-xs tracking-widest text-zinc-400">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-zinc-100 border-2 border-black rounded-xl p-3 font-bold focus:bg-white transition-colors outline-none h-32"
                                    placeholder="What happened?"
                                    required
                                />
                            </div>

                            <button
                                disabled={submitting}
                                className="w-full bg-yellow-400 border-4 border-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-yellow-500 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                            >
                                {submitting ? "Posting..." : "Post Update"}
                            </button>
                        </form>
                    </div>
                </div>


            </main>
        </div>
    );
}



