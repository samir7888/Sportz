"use client"

import { useState, useEffect, use } from "react";
import { authClient } from "@/utils/auth-client";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/components/Navbar";
import { Match, Commentary } from "@/type";

export default function MatchCMSPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const [match, setMatch] = useState<Match | null>(null);
    const [commentaries, setCommentaries] = useState<Commentary[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [minute, setMinute] = useState("");
    const [period, setPeriod] = useState("1st Half");
    const [eventType, setEventType] = useState("commentary");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/signin");
        }
    }, [session, isPending, router]);

    useEffect(() => {
        const getData = async () => {
            try {
                // Fetch matches and find the specific one (simpler than specific API for now)
                const res = await fetch(`/api/matches`);
                const data = await res.json();
                const found = data.events.find((m: Match) => m.id === parseInt(id));
                setMatch(found);

                // Fetch commentaries
                const commRes = await fetch(`/api/matches/${id}/commentary`);
                const commData = await commRes.json();
                setCommentaries(commData.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [id]);

    const handleAddCommentary = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const res = await fetch(`/api/matches/${id}/commentary`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    minute: parseInt(minute),
                    sequence: commentaries.length + 1,
                    period,
                    eventType,
                    message,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.error || "Failed to add commentary");
            } else {
                setCommentaries([...commentaries, result.data]);
                setMessage("");
                setMinute("");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setSubmitting(false);
        }
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
            <main className="max-w-7xl mx-auto px-4">
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Commentary Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white text-black border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-8">
                            <h3 className="text-xl font-bold mb-6 uppercase tracking-tight">Add Commentary</h3>
                            <form onSubmit={handleAddCommentary} className="space-y-4">
                                {error && (
                                    <div className="bg-red-100 border-2 border-red-500 text-red-600 p-3 rounded-lg text-sm font-bold">
                                        {error}
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

                    {/* Commentary List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border-4 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="p-6 bg-zinc-800 text-white font-bold uppercase tracking-widest flex justify-between items-center">
                                <span>Recent Updates</span>
                                <span className="text-zinc-400 text-xs">{commentaries.length} events</span>
                            </div>
                            <div className="divide-y-2 divide-black">
                                {commentaries.length === 0 ? (
                                    <div className="p-12 text-center text-zinc-400 font-medium italic">
                                        No commentary yet. Start posting updates!
                                    </div>
                                ) : (
                                    [...commentaries].reverse().map((c) => (
                                        <div key={c.id} className="p-6 hover:bg-zinc-50 transition-colors group">
                                            <div className="flex gap-6 items-start">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-2xl font-black">{c.minute}'</span>
                                                    <span className="text-[10px] font-bold uppercase text-zinc-400">{c.period}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-black ${c.eventType === 'goal' ? 'bg-green-400' :
                                                            c.eventType === 'card' ? 'bg-red-400' : 'bg-zinc-100'
                                                            }`}>
                                                            {c.eventType}
                                                        </span>
                                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 font-bold uppercase text-[10px]">Delete</button>
                                                    </div>
                                                    <p className="text-zinc-800 font-medium leading-relaxed italic border-l-4 border-yellow-400 pl-4">
                                                        "{c.message}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}



const footballForm = () => {
    return (
        <div>
            <h1>Football Form</h1>
        </div>
    )
}

const cricketForm = () => {
    return (
        <div>
            <h1>Cricket Form</h1>
        </div>
    )
}