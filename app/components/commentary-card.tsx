import { Commentary } from "@/type";

export const CommentaryCard = ({ commentary }: { commentary: Commentary }) => {
    return (
        <div className="flex flex-col p-4 border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase text-neutral-500">
                    {commentary.minute ? `${commentary.minute}'` : (commentary.period || 'Match')}
                </span>
                {commentary.team && (
                    <span className="text-xs font-semibold px-2 py-0.5 bg-neutral-100 rounded">
                        {commentary.team}
                    </span>
                )}
            </div>
            <p className="text-sm text-neutral-800 leading-relaxed">
                {commentary.message}
            </p>
        </div>
    );
};