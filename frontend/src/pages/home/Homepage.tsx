import { useFeaturedSongs, useMadeForYouSongs, useTrendingSongs } from "../../hooks/useMusicHook";
import Topbar from "../../components/Topbar";
import FeaturedSection from "./components/FeaturedSection";
import SectionGrid from "./components/SectionGrid";
import { useEffect } from "react";
import { usePlayerStore } from "../../hooks/usePlayerStore";

export default function Homepage() {

    //get all the songs data
    const { data: trendingSongs, isPending: isTrendingPending } = useTrendingSongs()
    const { data: madeForYouSongs, isPending: isMadeForYouPending } = useMadeForYouSongs()
    const { data: featuredSongs } = useFeaturedSongs()

    // useEffect(() => {
    //     useTrendingSongs()
    //     useMadeForYouSongs()
    // }, [trendingSongs, madeForYouSongs])


    const { initializeQueue } = usePlayerStore()
    //for initializing the queue logic in homepage
    useEffect(() => {
        if (featuredSongs?.length > 0 && madeForYouSongs?.length > 0 && trendingSongs?.length > 0) {
            const allsongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs]
            initializeQueue(allsongs)
        }
    }, [initializeQueue, featuredSongs, madeForYouSongs, trendingSongs])


    return <div className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900 mt-2">
        <div className="sticky top-0 z-20 rounded-md">
            <Topbar />
        </div>

        <div className="h-[calc(100vh-180px)] overflow-auto">
            <div className="p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6">Good Afternoon</h1>
                <FeaturedSection />

                <div className="space-y-8">
                    <SectionGrid title="Made for you" songs={madeForYouSongs} isPending={isTrendingPending} />
                    <SectionGrid title="Trending" songs={trendingSongs} isPending={isMadeForYouPending} />
                </div>
            </div>
        </div>
    </div>
}