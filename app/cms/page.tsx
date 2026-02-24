"use client"

import { useState } from "react";
import { authClient } from "@/utils/auth-client";
import { useRouter } from "next/navigation";
import { Navbar } from "../components/Navbar";
import { fetchUserMatches } from "../service/api";
import { Match, sportsType } from "@/type";
import { useAppMutation } from "../hooks/useAppMutation";
import { useQuery } from "@tanstack/react-query";
import { TeamCard } from "../components/team-card";

export default function CMSPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const [showCreateForm, setShowCreateForm] = useState(false);

    // Form state
    const [sport, setSport] = useState("Football");
    const [homeTeam, setHomeTeam] = useState("");
    const [awayTeam, setAwayTeam] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const { data: matchesData, isLoading: loading } = useQuery({
        queryKey: ["matches", "user"],
        queryFn: fetchUserMatches,
        enabled: !!session,
    });

    const matches = matchesData?.events || [];

    const mutation = useAppMutation();
    const submitting = mutation.isPending;
    const error = mutation.error ? ((mutation.error as any).response?.data?.message || (mutation.error as any).message || "An error occurred") : null;

    const handleCreateMatch = async (e: React.FormEvent) => {
        e.preventDefault();

        const start = new Date(startTime).toISOString();
        const end = new Date(endTime).toISOString();

        mutation.mutate({
            endpoint: "matches",
            method: "post",
            data: {
                sport,
                homeTeam,
                awayTeam,
                startTime: start,
                endTime: end,
            },
            invalidateTags: ["matches"],
            onSuccess: () => {
                setShowCreateForm(false);
                setHomeTeam("");
                setAwayTeam("");
                setStartTime("");
                setEndTime("");
            }
        });
    };

    const handleDeleteMatch = async (id: number) => {
        if (!confirm("Are you sure? This will delete all commentary for this match.")) return;

        mutation.mutate({
            endpoint: "matches",
            method: "delete",
            id: id.toString(),
            invalidateTags: ["matches"],
        });
    };

    if (isPending || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
            <main className="max-w-7xl mx-auto px-4 flex flex-col gap-5">

                <div className="mt-12 flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
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


                                {
                                    <select
                                        value={sport}
                                        onChange={(e) => setSport(e.target.value)}
                                        className="w-full bg-zinc-100 border-2 border-black rounded-xl p-4 font-bold focus:bg-white transition-colors outline-none"
                                        required
                                    >
                                        <option value="">Select Sport</option>
                                        {Object.values(sportsType).map((key) => (
                                            <option key={key} value={key}>
                                                {key}
                                            </option>
                                        ))}
                                    </select>
                                }

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

                                <TeamCard match={match} tab="all" onDelete={handleDeleteMatch} />

                            ))
                        )

                    )

                    }

                </div>
            </main>
    );
}
