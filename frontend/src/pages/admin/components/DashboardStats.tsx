import StatsCard from "./StatsCard";
import { useFetchStats } from "../../../hooks/useMusicHook"
import { Library, ListMusic, PlayCircle, Users2 } from "lucide-react";

export default function DashboardStats() {

    //fetch all stats
    const { data: allStats } = useFetchStats()

    const statsData = [
        {
            icon: ListMusic,
            label: "Total Songs",
            value: allStats?.totalSongs.toLocaleString(),
            bgColor: "bg-emerald-500/10",
            iconColor: "text-emerald-500"
        },
        {
            icon: Library,
            label: "Total Albums",
            value: allStats?.totalAlbums.toLocaleString(),
            bgColor: "bg-violet-500/10",
            iconColor: "text-violet-500"
        },
        {
            icon: Users2,
            label: "Total Artists",
            value: allStats?.totalArtists.toLocaleString(),
            bgColor: "bg-orange-500/10",
            iconColor: "text-orange-500"
        },
        {
            icon: PlayCircle,
            label: "Total Users",
            value: allStats?.totalUsers.toLocaleString(),
            bgColor: "bg-sky-500/10",
            iconColor: "text-sky-500"
        }
        
    ]
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsData.map((stat) => (
                <StatsCard
                    key={stat.label}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    bgColor={stat.bgColor}
                    iconColor={stat.iconColor}
                />

            ))}
        </div>
    )

}