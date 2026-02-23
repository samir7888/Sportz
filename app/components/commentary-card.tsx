import { Commentary } from "@/type";
import { Circle, Goal, RectangleVertical, RefreshCw } from "lucide-react";

export const CommentaryCard = ({ c, sport }: { c: Commentary, sport?: string }) => {
    if (sport === 'cricket') {
        return <CricketCommentaryCard c={c} />;
    }

    // Default to Football/General style
    return (
        <div className="flex gap-4 px-4 py-3 hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0 group">
            <div className="w-12 flex flex-col items-center justify-start pt-1">
                <span className="text-sm font-bold text-zinc-900">{c.minute}'</span>

            </div>

            <div className="flex-1 flex gap-3">
                <div className="pt-1">
                    {c.eventType === 'goal' && <Goal className="w-5 h-5 text-green-600" />}
                    {c.eventType === 'card' && <RectangleVertical className="w-5 h-5 text-red-500 fill-red-500" />}
                    {c.eventType === 'yellow-card' && <RectangleVertical className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
                    {c.eventType === 'substitution' && <RefreshCw className="w-5 h-5 text-blue-500" />}
                    {!['goal', 'card', 'yellow-card', 'substitution'].includes(c.eventType || '') && (
                        <Circle className="w-2 h-2 mt-2 fill-zinc-300 text-zinc-300" />
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[11px] font-bold text-zinc-900 uppercase tracking-tight">
                            {c.eventType?.replace('-', ' ')}
                        </span>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 font-bold uppercase text-[10px] hover:underline">
                            Delete
                        </button>
                    </div>
                    <p className="text-sm text-zinc-800 leading-normal">
                        {c.message}
                    </p>
                </div>
            </div>
        </div>
    );
};

const CricketCommentaryCard = ({ c }: { c: Commentary }) => {
    const getRunColor = (run?: number, eventType?: string) => {
        if (eventType?.toLowerCase().includes('wicket')) return 'bg-red-600 text-white border-red-600';
        if (run === 4) return 'bg-green-600 text-white border-green-600';
        if (run === 6) return 'bg-yellow-600 text-white border-yellow-600';
        if (run === 0) return 'bg-zinc-100 text-zinc-400 border-zinc-200';
        return 'bg-zinc-800 text-white border-zinc-800';
    };

    const overValue = c.over ?? c.minute;

    return (
        <div className="flex gap-4 px-4 py-3 hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0 group">
            <div className="w-12 text-sm font-bold text-zinc-900 pt-1">
                {overValue !== undefined ? overValue : ''}
            </div>

            <div className="flex-1 flex gap-4">
                <div className="shrink-0">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-black shadow-sm ${getRunColor(c.run, c.eventType)}`}>
                        {c.eventType?.toLowerCase().includes('wicket') ? 'W' : (c.run === 0 ? '•' : c.run)}
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                        {c.actor && (
                            <span className="text-[11px] font-bold text-zinc-900 uppercase">
                                {c.actor}
                            </span>
                        )}

                    </div>
                    <p className="text-sm text-zinc-800 leading-normal">
                        {c.message}
                    </p>
                </div>
            </div>
        </div>
    );
};
