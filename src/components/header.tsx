import { Home, ListEnd, ListMusic, ListPlus, Search, Settings } from "lucide-react";

export function Header() {
    return (
        <div className="absolute w-[100vw] h-[5vh] flex items-start justify-center">
            <div className=" flex justify-between w-[30%] h-full bg-secondary-foreground rounded-b-full px-8">
                <Home className="text-primary mt-1 hover:cursor-pointer"></Home>
                <ListEnd className="text-primary mt-1 hover:cursor-pointer"/>
                <ListPlus className="text-primary mt-1 hover:cursor-pointer"/>
                <ListMusic className="text-primary mt-1 hover:cursor-pointer"/>
                <Search className="text-primary mt-1 hover:cursor-pointer"/>
                <Settings className="text-primary mt-1 hover:cursor-pointer" />
            </div>
        </div>
    )
}