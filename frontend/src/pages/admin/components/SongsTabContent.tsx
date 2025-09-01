import { Music } from "lucide-react";
import SongsTable from "./SongsTable";
import AddSongDialog from "./AddSongDialog";

export default function SongsTabContent()
{
    return (
        <div>
            <div className="mt-4">
                <div className="flex items-center justify-between">
                    <div className="">
                        <div className="flex items-center gap-2 font-semibold">
                            <Music className="size-5  text-emerald-500"/>
                            Songs Library
                        </div>
                        <p className="text-slate-300 text-sm">Manage your music tracks</p>
                    </div>
                    <AddSongDialog/>
                </div>
            </div>
            {/* Content  */}
            <div>
                <SongsTable/>
            </div>
        </div>
    )
}