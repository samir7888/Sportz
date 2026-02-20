export const Navbar = () => {
    return (
        <div className="flex mt-12 p-4 rounded-2xl  border-b-6 border-r-6 border-t-2 border-l-2 border-black shadow-2xl justify-between bg-amber-300 ">
            <div className="flex flex-col">
                <h1 className="text-3xl  font-bold">Sportz</h1>
                <h3 className="text-lg">Real-time match data demo</h3>
            </div>
            <div className="max-w-24 h-12 flex items-center gap-2">
                <div className="size-4 rounded-full bg-green-600"></div>
                <span className="text-lg font-semibold">Live</span>
            </div>
        </div>
    )
}