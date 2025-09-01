import ProfileSection from "../../../components/ProfileSection";
import { Link } from "react-router-dom";

export default function Header()
{
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-8">
                <Link to={"/"} className="rounded-lg bg-gray-800">
                    <img src="/soniclogo.png" alt="SonicWave logo" className="w-11 h-12" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Music Manager</h1>
                    <p className="text-zinc-400 mt-1">Manage your music catalog</p>
                </div>
            </div>
            <ProfileSection/>
        </div>
    )
}