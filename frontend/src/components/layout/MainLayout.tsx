import { Outlet } from "react-router-dom";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import LeftSidebar from "./LeftSidebar";
import FriendsActivity from "../FriendsActivity";
import AudioPlayer from "./AudioPlayer";
import PlaybackControl from "./PlaybackControl";
import { useEffect, useState } from "react";



export default function MainLayout() {
    //to show the friend activity only on bigger screens
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener("resize", checkMobile)  //change the isMobile value on screen resize

        return () => window.removeEventListener("resize", checkMobile)    //remove event listener
    }, [])

    return <div className="min-h-screen bg-black text-white">

        <PanelGroup direction="horizontal" className="flex-1 flex h-full p-2">

            {/* The component to play songs  */}
            <AudioPlayer />

            {/* Left panel  */}
            <Panel defaultSize={22} minSize={0} maxSize={25} collapsedSize={8}>
                <div className="p-4 h-full">
                    <LeftSidebar />
                </div>
            </Panel>
            {/* Left drag handle */}
            <PanelResizeHandle className="w-1 bg-tranparent hover:bg-gray-500 cursor-col-resize" />


            {/* Middle panel  */}
            <Panel defaultSize={55} minSize={55}>
                <div className="flex flex-col h-full overflow-hidden">

                    <div className="flex-1">
                        <Outlet key={location.pathname} />
                    </div>
                </div>
            </Panel>

            {!isMobile && (
                <>
                    {/* Right drag handle */}
                    <PanelResizeHandle className="w-1 hover:bg-gray-500 cursor-col-resize bg-transparent" />

                    {/* Right side panel  */}
                    <Panel defaultSize={24} maxSize={25} collapsedSize={0} minSize={0}>
                        <div className="p-4 h-full">
                            <FriendsActivity />
                        </div>
                    </Panel>
                </>
            )}

        </PanelGroup>

        <div className="absolute bottom-0 w-full flex-1 z-10">
            <PlaybackControl />
        </div>
    </div>
}