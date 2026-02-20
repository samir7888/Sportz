"use client"
import { formatTime } from "@/utils/format-date"
import { Match } from "@/type"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export const TeamCard = ({ match }: { match: Match }) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleWatchLive = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("matchId", match.id.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex h-auto space-y-2  items-center p-2 flex-col border-2 rounded-2xl border-black">
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
                            <div className="size-3 rounded-full bg-red-600" />
                            Live</div>
                        <span className="w-fit px-3 py-1 border rounded-lg bg-slate-100 border-black text-lg font-bold">{match.homeScore}</span>
                        <h2 className="w-fit px-3 py-1 border rounded-lg bg-slate-100 border-black text-lg font-bold">{match.awayScore}</h2>
                    </div>
                </div>
            </div>
            <div className="flex pt-4 border-t-2 border-neutral-200 w-full justify-between items-center ">
                <span className="text-neutral-500">{formatTime(match.startTime)}</span>
                <button onClick={handleWatchLive} className="px-4 py-2 border-2 border-black rounded-2xl cursor-pointer bg-yellow-400">Watch Live</button>
            </div>


        </div>
    )
}