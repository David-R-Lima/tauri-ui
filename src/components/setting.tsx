import { ModeToggle } from "./theme-toggle";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";


export function Settings() {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Settings />
            </DialogTrigger>
            <DialogContent>
                <ModeToggle></ModeToggle>
            </DialogContent>
        </Dialog>
    )
}