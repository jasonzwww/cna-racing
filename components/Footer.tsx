export function Footer() {
    return (
        <footer className="border-t border-white/10">
            <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-zinc-400">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>© {new Date().getFullYear()} CNA Racing</div>
                    <div className="text-zinc-500">Sim Racing League · Next.js</div>
                </div>
            </div>
        </footer>
    );
}
