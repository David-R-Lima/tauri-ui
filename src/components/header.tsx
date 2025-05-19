import { HeaderState } from "@/enums/header";
import { Home, ListEnd, ListMusic, ListPlus, Search, Settings } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { AddPlaylistDialog } from "./add-playlist-dialog";

interface HeaderProps {
    state: HeaderState
    setHeaderState: Dispatch<SetStateAction<HeaderState>>
}

export function Header({setHeaderState, state}: HeaderProps) {
    return (
        <div className="w-full h-[40px] flex items-start justify-center">
            <div className=" flex justify-between w-[30%] h-full bg-secondary-foreground rounded-b-full px-8">
                <Home className="text-primary mt-1 hover:cursor-pointer" onClick={() => setHeaderState(HeaderState.HOME)}></Home>
                <ListEnd className="text-primary mt-1 hover:cursor-pointer" onClick={() => setHeaderState(HeaderState.LISTPLAYLIST)}/>
                <AddPlaylistDialog></AddPlaylistDialog>
                <ListMusic className="text-primary mt-1 hover:cursor-pointer" onClick={() => setHeaderState(HeaderState.LISTSONGS)}/>
                <Search className="text-primary mt-1 hover:cursor-pointer"/>
                <Settings className="text-primary mt-1 hover:cursor-pointer" onClick={() => setHeaderState(HeaderState.SETTINGS)}/>
            </div>
        </div>
    )
}