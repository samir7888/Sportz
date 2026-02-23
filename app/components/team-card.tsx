"use client"
import { formatTime } from "@/utils/format-date"
import { Match } from "@/type"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { getMatchStatus } from "@/utils/match-status"
import Link from "next/link"

export const TeamCard = ({ match, tab, onDelete }: { match: Match, tab: string, onDelete?: (id: number) => void }) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const isCms = pathname.includes("cms");

    const handleWatchLive = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("matchId", match.id.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="bg-white h-fit text-black border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group">
            <div className="flex pb-4  w-full justify-between items-center">
                <div className="flex w-full justify-between space-y-3 items-center">
                    <div className="flex flex-col items-start space-y-2">
                        <div className="w-24 rounded-2xl text-center uppercase p-1 border border-black">
                            {match.sport}</div>
                        <h2 className="text-lg font-bold">{match.homeTeam}</h2>
                        <h2 className="text-lg font-bold">{match.awayTeam}</h2>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="font-medium text-red-600 flex items-center gap-2 text-2xl">
                            <div className={`size-3 rounded-full ${getMatchStatus(match.startTime, match.endTime) === "live" ? "bg-red-600" : "bg-green-600"}`} />
                            {getMatchStatus(match.startTime, match.endTime)}</div>
                        <span className="w-fit px-3 py-1 border rounded-lg bg-slate-100 border-black text-lg font-bold">{match.homeScore} {match.sport === 'cricket' ? `/ ${match.homeWickets}` : ""}</span>
                        <h2 className="w-fit px-3 py-1 border rounded-lg bg-slate-100 border-black text-lg font-bold">{match.awayScore} {match.sport === 'cricket' ? `/ ${match.awayWickets}` : ""}</h2>
                    </div>
                </div>
            </div>
            <div className="flex pt-4 border-t-2 border-neutral-200 w-full justify-between items-center ">
                <span className="text-neutral-500">{formatTime(match.startTime)}</span>
                {
                    getMatchStatus(match.startTime, match.endTime) === "live" && tab === "live" &&
                    <button onClick={handleWatchLive} className="px-4 py-2 border-2 border-black rounded-2xl cursor-pointer bg-yellow-400">Watch Live</button>
                }
                {isCms && <div className="flex gap-2">
                    <Link
                        href={`/cms/matches/${match.id}`}
                        className="p-2 hover:bg-zinc-100 rounded-lg transition-colors border-2 border-transparent hover:border-black"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </Link>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete?.(Number(match.id));
                        }}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-500 border-2 border-transparent hover:border-red-500"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>}
            </div>


        </div>
    )
}