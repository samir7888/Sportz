import { Navbar } from "../components/Navbar";

export default function CMSLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            <div className="max-w-7xl mx-auto px-4">
                <Navbar />
            </div>
            {children}
        </div>
    );
}