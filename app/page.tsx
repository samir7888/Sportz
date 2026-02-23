"use client"
import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { TeamCard } from "./components/team-card";
import { fetchLiveMatches, fetchMatchCommentary, fetchMatches, fetchUpcomingMatches } from "./service/api";
import Pusher from "pusher-js";
import { Commentary, CommentaryResponse, Match } from "@/type";
import { useSearchParams } from "next/navigation";
import { CommentaryCard } from "./components/commentary-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [matchData, setMatchData] = useState<Match[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [commentaries, setCommentaries] = useState<Commentary[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);

  const searchParams = useSearchParams();
  const selectedMatchId = searchParams.get("matchId");

  useEffect(() => {

    const getMatches = async () => {
      const matches = await fetchMatches();
      setMatchData(matches.events);
    }
    getMatches();

  }, [])

  useEffect(() => {
    const getLiveMatches = async () => {
      const liveMatches = await fetchLiveMatches();
      setLiveMatches(liveMatches.events);
    }
    getLiveMatches();
  }, [])

  useEffect(() => {
    const getUpcomingMatches = async () => {
      const upcomingMatches = await fetchUpcomingMatches();
      setUpcomingMatches(upcomingMatches.events);
    }
    getUpcomingMatches();
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

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-black">
      <main className="flex flex-col pb-12 h-full mx-auto w-7xl">
        <Navbar />


        <Tabs className="mt-12" defaultValue="all">
          <TabsList className="gap-4">
            <TabsTrigger className="text-black border-2 border-black px-3 py-4" value="all">{`All Matches (${matchData.length})`}</TabsTrigger>
            <TabsTrigger className="border-2 border-black text-black px-3 py-4" value="live">{`Live Matches (${liveMatches.length})`}</TabsTrigger>
            <TabsTrigger className="border-2 border-black text-black px-3 py-4" value="upcoming">Upcoming Matches ({upcomingMatches.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="col-span-3 grid grid-cols-2 gap-4 h-full">

              {matchData.length > 0 ? matchData.map((match) => (
                <TeamCard key={match.id} match={match} tab={"all"} />
              )) : (
                <div className="p-8 text-center text-neutral-500">
                  No matches available.
                </div>
              )}
            </div>


          </TabsContent>
          <TabsContent value="live">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">


              <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">

                {liveMatches.length > 0 ? liveMatches.map((match) => (
                  <TeamCard key={match.id} match={match} tab={"live"} />
                )) : (
                  <div className="p-8 text-center text-neutral-500">
                    No live matches available.
                  </div>
                )}
              </div>

              <div className="col-span-1 max-h-[360px] md:col-span-2 border-2 border-black rounded-2xl bg-white overflow-hidden flex flex-col">
                <div className="p-4 border-b-2 border-black bg-yellow-400 font-bold uppercase tracking-wider">
                  Live Commentary
                </div>
                <div className="flex-1 overflow-y-auto">
                  {selectedMatchId ? (
                    commentaries.length > 0 ? (
                      commentaries.map((c) => {
                        const match = [...liveMatches, ...matchData, ...upcomingMatches].find(m => m.id.toString() === selectedMatchId);
                        return <CommentaryCard key={c.id} c={c} sport={match?.sport} />;
                      })
                    ) : (
                      <div className="p-8 text-center text-neutral-500 italic">
                        No commentary available for this match yet.
                      </div>
                    )
                  ) : (
                    <div className="p-8 text-center text-neutral-500">
                      Select a match to view live commentary
                    </div>
                  )}
                </div>
              </div>


            </div>

          </TabsContent>


          <TabsContent value="upcoming">



            {upcomingMatches.length > 0 ? upcomingMatches.map((match) => (
              <div className="grid grid-cols-2 gap-4 h-full">
                <TeamCard key={match.id} match={match} tab={"upcoming"} />
              </div>
            )) : (
              <div className="p-8 text-center text-neutral-500">
                No upcoming matches available.
              </div>
            )}


          </TabsContent>
        </Tabs>





      </main>
    </div>
  );
}
