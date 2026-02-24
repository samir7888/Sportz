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
    const [currentTeam, setCurrentTeam] = useState("homeTeam");
    const [eventType, setEventType] = useState("commentary");
    const [message, setMessage] = useState("");
    const [run, setRun] = useState("");
    const [actor, setActor] = useState("");



    const { data: matchData, isLoading: matchLoading } = useQuery({
        queryKey: ["matches", id],
        queryFn: async () => {
            const res = await fetch(`/api/matches`);
            const data = await res.json();
            const found = data.events.find((m: Match) => m.id === parseInt(id)) as Match;
            if (found) {
                setHomeScore(found.homeScore);
                setAwayScore(found.awayScore);
                setHomeWickets(found.homeWickets || 0);
                setAwayWickets(found.awayWickets || 0);
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
    const [homeScore, setHomeScore] = useState<number>(match?.homeScore || 0);
    const [awayScore, setAwayScore] = useState<number>(match?.awayScore || 0);
    const [homeWickets, setHomeWickets] = useState<number>(match?.homeWickets || 0)
    const [awayWickets, setAwayWickets] = useState<number>(match?.awayWickets || 0)

    const commentaries = commentariesData || [];
    const loading = matchLoading || commLoading;

    const mutation = useAppMutation();
    const submitting = mutation.isPending;
    const error = mutation.error ? ((mutation.error as any).response?.data?.message || (mutation.error as any).message || "An error occurred") : null;


    const handleAddCommentary = async (e: React.FormEvent) => {
        e.preventDefault();

        mutation.mutate({
            endpoint: `matches/${id}`,
            method: "patch",
            data: {
                homeScore: match?.sport === 'cricket' && run !== "" && currentTeam === "homeTeam" ? (homeScore + parseInt(run)) : eventType === 'goal' && currentTeam === "homeTeam" ? homeScore + 1 : homeScore,
                awayScore: match?.sport === 'cricket' && run !== "" && currentTeam === "awayTeam" ? (awayScore + parseInt(run)) : eventType === 'goal' && currentTeam === "awayTeam" ? awayScore + 1 : awayScore,
                homeWickets: eventType === 'wicket' && currentTeam === "homeTeam" ? homeWickets + 1 : homeWickets,
                awayWickets: eventType === 'wicket' && currentTeam === "awayTeam" ? awayWickets + 1 : awayWickets,
            },
            invalidateTags: [["matches", id]],
        });

        mutation.mutate({
            endpoint: `matches/${id}/commentary`,
            method: "post",
            data: {
                minute: match?.sport === 'football' ? parseInt(minute) : 0,
                over: match?.sport === 'cricket' ? parseFloat(minute) : undefined,
                sequence: commentaries.length + 1,
                eventType,
                message,
                run: match?.sport === 'cricket' && run !== "" ? parseInt(run) : undefined,

                actor: actor || undefined,
            },
            invalidateTags: [["commentaries", id]],
            onSuccess: () => {
                setMessage("");
                setMinute("");
                setRun("");
                setActor("");
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
            <main className="max-w-7xl mx-auto px-4">

                <div className="mt-12 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-zinc-500 font-bold uppercase text-sm hover:text-black transition-colors mb-4"
                    >
                        ← Back to CMS
                    </button>
                    <h2 className="text-2xl md:text-4xl font-bold text-black uppercase tracking-tighter">
                        Manage Match: {match.homeTeam} vs {match.awayTeam}
                    </h2>
                </div>

                {/* Sidebar Forms */}

                
                <div className="flex justify-between gap-12">

                    {/* Add Commentary Form */}
                    <div className="bg-white w-full text-black border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-8">
                        <h3 className="text-xl font-bold mb-6 uppercase tracking-tight">Add Commentary</h3>
                        <form onSubmit={handleAddCommentary} className="space-y-4 flex flex-col gap-4">
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
                                <label className="block font-bold uppercase text-xs tracking-widest text-zinc-400">Team</label>

                                <select
                                    value={currentTeam}
                                    onChange={(e) => setCurrentTeam(e.target.value)}
                                    className="w-full bg-zinc-100 border-2 border-black rounded-xl p-3 font-bold focus:bg-white transition-colors outline-none"
                                >
                                    <option value="homeTeam">Home Team</option>
                                    <option value="awayTeam">Away Team</option>


                                </select>


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

                            {match?.sport === 'cricket' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block font-bold uppercase text-xs tracking-widest text-zinc-400">Runs</label>
                                        <input
                                            type="number"
                                            placeholder="Runs"
                                            value={run}
                                            onChange={(e) => setRun(e.target.value)}
                                            className="w-full bg-zinc-100 border-2 border-black rounded-xl p-3 font-bold focus:bg-white transition-colors outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block font-bold uppercase text-xs tracking-widest text-zinc-400">Player name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Kohli"
                                            value={actor}
                                            onChange={(e) => setActor(e.target.value)}
                                            className="w-full bg-zinc-100 border-2 border-black rounded-xl p-3 font-bold focus:bg-white transition-colors outline-none"
                                        />
                                    </div>
                                </div>
                            )}

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
    );
}



