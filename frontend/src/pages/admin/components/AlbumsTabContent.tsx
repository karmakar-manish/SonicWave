import { Library } from "lucide-react";
import AddAlbumDialog from "./AddAlbumDialog";
import AlbumTable from "./AlbumsTable";

export default function AlbumTabContent()
{
    return (
        <div>
            <div className="mt-4">
                <div className="flex items-center justify-between">
                    <div className="">
                        <div className="flex items-center gap-2 font-semibold">
                            <Library className="size-5  text-emerald-500"/>
                            Albums Library
                        </div>
                        <p className="text-slate-300 text-sm">Manage your album collection</p>
                    </div>
                    <AddAlbumDialog/>
                </div>
            </div>
            {/* Content  */}
            <div>
                <AlbumTable/>
            </div>
        </div>
    )
}