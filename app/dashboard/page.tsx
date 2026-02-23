"use client"
import { useEffect, useState, Suspense } from "react";
import { Navbar } from "../components/Navbar";
import { TeamCard } from "../components/team-card";
import { fetchLiveMatches, fetchMatchCommentary, fetchMatches, fetchUpcomingMatches } from "../service/api";
import Pusher from "pusher-js";
import { Commentary, Match } from "@/type";
import { useSearchParams } from "next/navigation";
import { CommentaryCard } from "../components/commentary-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Radio, CalendarDays, Activity } from "lucide-react";

function DashboardContent() {
    const [matchData, setMatchData] = useState<Match[]>([]);
    const [liveMatches, setLiveMatches] = useState<Match[]>([]);
    const [commentaries, setCommentaries] = useState<Commentary[]>([]);
    const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const searchParams = useSearchParams();
    const selectedMatchId = searchParams.get("matchId");

    useEffect(() => {
        const getAllData = async () => {
            setIsLoading(true);
            try {
                const [allRes, liveRes, upcomingRes] = await Promise.all([
                    fetchMatches(),
                    fetchLiveMatches(),
                    fetchUpcomingMatches()
                ]);
                setMatchData(allRes.events);
                setLiveMatches(liveRes.events);
                setUpcomingMatches(upcomingRes.events);
            } catch (error) {
                console.error("Failed to fetch matches:", error);
            } finally {
                setIsLoading(false);
            }
        };
        getAllData();
    }, [])


    // 1. Global subscriptions (e.g., new match created)
    useEffect(() => {
        const pusher = new Pusher(
            process.env.NEXT_PUBLIC_PUSHER_KEY!,
            {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            }
        );

        const channel = pusher.subscribe("sportz");
        channel.bind("match.created", (data: Match) => {
            setMatchData((prev) => [data, ...prev])
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    // 2. Match-specific subscriptions (e.g., live commentary for current match)
    useEffect(() => {
        if (!selectedMatchId) return;

        const pusher = new Pusher(
            process.env.NEXT_PUBLIC_PUSHER_KEY!,
            {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            }
        );

        const channel = pusher.subscribe(`match-${selectedMatchId}`);

        channel.bind(`commentary-added`, (data: Commentary) => {
            setCommentaries((prev) => [data, ...prev])
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [selectedMatchId]);



    useEffect(() => {
        if (selectedMatchId) {
            const getCommentaries = async () => {
                try {
                    const data = await fetchMatchCommentary(selectedMatchId);
                    setCommentaries(data.data);
                } catch (error) {
                    console.error("Failed to fetch commentaries:", error);
                }
            };
            getCommentaries();
        } else {
            setCommentaries([]);
        }
    }, [selectedMatchId]);

    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-48 bg-zinc-200 animate-pulse rounded-3xl border-2 border-zinc-300"></div>
            ))}
        </div>
    );

    const EmptyState = ({ message, submessage }: { message: string, submessage: string }) => (
        <div className="col-span-full py-20 flex flex-col items-center justify-center border-4 border-dashed border-zinc-200 rounded-[2.5rem] bg-zinc-100/50">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-400 mb-2">{message}</h3>
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">{submessage}</p>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-zinc-50 font-sans text-black">
            <main className="flex flex-col pb-12 h-full mx-auto w-full max-w-7xl px-4">
                <Navbar />

                <Tabs className="mt-12" defaultValue="all">
                    <TabsList className="bg-zinc-200/50 p-1.5 rounded-2xl border-2 border-black inline-flex gap-2">
                        <TabsTrigger
                            className="data-[state=active]:bg-black data-[state=active]:text-white px-6 py-3 rounded-xl font-black uppercase italic tracking-wider transition-all"
                            value="all"
                        >
                            <LayoutDashboard className="size-4 mr-2 inline" />
                            All ({matchData.length})
                        </TabsTrigger>
                        <TabsTrigger
                            className="data-[state=active]:bg-red-500 data-[state=active]:text-white px-6 py-3 rounded-xl font-black uppercase italic tracking-wider transition-all"
                            value="live"
                        >
                            <Radio className="size-4 mr-2 inline" />
                            Live ({liveMatches.length})
                        </TabsTrigger>
                        <TabsTrigger
                            className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black px-6 py-3 rounded-xl font-black uppercase italic tracking-wider transition-all"
                            value="upcoming"
                        >
                            <CalendarDays className="size-4 mr-2 inline" />
                            Upcoming ({upcomingMatches.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-8">
                        {isLoading ? <LoadingSkeleton /> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {matchData.length > 0 ? matchData.map((match) => (
                                    <TeamCard key={match.id} match={match} tab={"all"} />
                                )) : (
                                    <EmptyState message="No Matches Found" submessage="Check back later for new events" />
                                )}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="live" className="mt-8">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            <div className="lg:col-span-3">
                                {isLoading ? <LoadingSkeleton /> : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {liveMatches.length > 0 ? liveMatches.map((match) => (
                                            <TeamCard key={match.id} match={match} tab={"live"} />
                                        )) : (
                                            <EmptyState message="No Live Action" submessage="Check upcoming for scheduled matches" />
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-2 border-4 border-black rounded-[2.5rem] bg-white overflow-hidden flex flex-col shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-h-[600px]">
                                <div className="p-5 border-b-4 border-black bg-yellow-400 font-black uppercase italic flex items-center justify-between">
                                    <span className="tracking-tighter">Live Commentary</span>
                                    <div className="size-4 rounded-full bg-red-600 animate-pulse border-2 border-black"></div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                    {selectedMatchId ? (
                                        commentaries.length > 0 ? (
                                            commentaries.map((c) => {
                                                const match = [...liveMatches, ...matchData, ...upcomingMatches].find(m => m.id.toString() === selectedMatchId);
                                                return <CommentaryCard key={c.id} c={c} sport={match?.sport} />;
                                            })
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                                                <div className="size-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-zinc-300">
                                                    <Activity className="size-8 text-zinc-300" />
                                                </div>
                                                <h4 className="font-black uppercase italic tracking-tighter text-zinc-400">Silence is Golden</h4>
                                                <p className="text-zinc-500 text-xs font-bold uppercase mt-1">Waiting for play-by-play updates...</p>
                                            </div>
                                        )
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                                            <div className="size-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-zinc-300">
                                                <Radio className="size-8 text-zinc-300" />
                                            </div>
                                            <h4 className="font-black uppercase italic tracking-tighter text-zinc-400">Feed Offline</h4>
                                            <p className="text-zinc-500 text-xs font-bold uppercase mt-1">Select a match to tune in</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="upcoming" className="mt-8">
                        {isLoading ? <LoadingSkeleton /> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {upcomingMatches.length > 0 ? upcomingMatches.map((match) => (
                                    <TeamCard key={match.id} match={match} tab={"upcoming"} />
                                )) : (
                                    <EmptyState message="The Calendar is Clear" submessage="Fresh fixtures arriving soon" />
                                )}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}


