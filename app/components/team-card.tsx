"use client"
import { formatTime } from "@/utils/format-date"
import { Match } from "@/type"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { getMatchStatus } from "@/utils/match-status"

export const TeamCard = ({ match, tab }: { match: Match, tab: string }) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleWatchLive = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("matchId", match.id.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="bg-white text-black border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group">
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
                        <span className="w-fit px-3 py-1 border rounded-lg bg-slate-100 border-black text-lg font-bold">{match.homeScore}</span>
                        <h2 className="w-fit px-3 py-1 border rounded-lg bg-slate-100 border-black text-lg font-bold">{match.awayScore}</h2>
                    </div>
                </div>
            </div>
            <div className="flex pt-4 border-t-2 border-neutral-200 w-full justify-between items-center ">
                <span className="text-neutral-500">{formatTime(match.startTime)}</span>
                {
                    getMatchStatus(match.startTime, match.endTime) === "live" && tab === "live" &&
                    <button onClick={handleWatchLive} className="px-4 py-2 border-2 border-black rounded-2xl cursor-pointer bg-yellow-400">Watch Live</button>
                }
            </div>


        </div>
    )
}