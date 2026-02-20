"use client"
import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { TeamCard } from "./components/team-card";
import { fetchMatchCommentary, fetchMatches } from "./service/api";
import Pusher from "pusher-js";
import { Commentary, CommentaryResponse, Match } from "@/type";
import { useSearchParams } from "next/navigation";
import { CommentaryCard } from "./components/commentary-card";

export default function Home() {
  const [matchData, setMatchData] = useState<Match[]>([]);
  const [commentaries, setCommentaries] = useState<Commentary[]>([]);

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



  useEffect(() => {
    if (selectedMatchId) {
      const getCommentaries = async () => {
        try {
          const data = await fetchMatchCommentary(selectedMatchId);
          console.log(data);
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
      <main className="flex flex-col h-screen mx-auto w-7xl">
        <Navbar />
        <div className="grid grid-cols-4 gap-4 p-4">
          <div className="col-span-3 grid grid-cols-2 gap-4">

            {matchData.map((match) => (
              <TeamCard key={match.id} match={match} />
            ))}
          </div>

          <div className="col-span-1 border-2 border-black rounded-2xl bg-white overflow-hidden flex flex-col">
            <div className="p-4 border-b-2 border-black bg-yellow-400 font-bold uppercase tracking-wider">
              Live Commentary
            </div>
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
              {selectedMatchId ? (
                commentaries.length > 0 ? (
                  commentaries.map((c) => (
                    <CommentaryCard key={c.id} commentary={c} />
                  ))
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
      </main>
    </div>
  );
}
