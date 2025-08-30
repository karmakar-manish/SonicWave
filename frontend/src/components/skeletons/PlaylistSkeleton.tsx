export default function PlaylistSkeleton()
{
    return Array.from({length:7}).map((_,i)=>(
        <div key={i} className="p-2 rounded-md flex items-center gap-3 overflow-scroll">
            <div className="w-12 h-12 bg-zinc-800 rounded-md flex-shrink-0"/>
            <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 skeleton bg-zince-800 animate-pulse rounded w-3/4"/>
                <div className="h-3 skeleton bg-zince-800 animate-pulse rounded w-1/2"/>
            </div>
        </div>
    ))
}