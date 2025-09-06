import { Home } from "lucide-react";
import ProfileSection from "../../../components/ProfileSection";
import { Link } from "react-router-dom";

export default function Header()
{
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-8">
                <Link to={"/"} className="p-2 rounded-lg bg-gray-800 hover:scale-105 transition-all">
                    <Home className="size-10 text-purple-300"/>
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