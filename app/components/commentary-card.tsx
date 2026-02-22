import { Commentary } from "@/type";

export const CommentaryCard = ({ c }: { c: Commentary }) => {
    return (
        <div className="flex gap-6 px-3 py-4 items-center">
            <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-black">{c.minute}'</span>
                <span className="text-[10px] font-bold uppercase text-zinc-800">{c.period}</span>
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-medium text-black uppercase px-2 py-0.5 rounded border border-black
                     ${c.eventType === 'goal' ? 'bg-green-400' :
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
    );
};

const CricketCommentaryCard = ({ c }: { c: Commentary }) => {
    return (
        <div className="flex gap-6 px-3 py-4 items-start">
            <div className="flex flex-col items-center">
                <span className="px-3 py-2 border-2 border-black rounded-full text-2xl font-black text-black">{c.run}</span>
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-medium text-black uppercase px-2 py-0.5 rounded border border-black
                     ${c.eventType === 'goal' ? 'bg-green-400' :
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
    );
};
