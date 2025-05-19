import { ListPlus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreatePlaylistSchema, CreatePlaylistType } from "@/services/playlist/types";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { CreatePlaylist } from "@/services/playlist";

export function AddPlaylistDialog() {
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<CreatePlaylistType>({
        resolver: zodResolver(CreatePlaylistSchema),
    })

    const submit = useMutation({
        mutationFn: CreatePlaylist,
        onSuccess: () => {
            console.log('Success')
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const handleSubmitForm = async (data: CreatePlaylistType) => {
        await submit.mutateAsync({
            ...data
        })
    }
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <ListPlus className="text-primary mt-1 hover:cursor-pointer"/>
            </DialogTrigger>
            <DialogContent>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleSubmitForm)}>
                    <h1>Create playlist</h1>
                    <Input placeholder="Playlist name *" onChange={(e) => {
                        setValue('name', e.target.value)
                    }}></Input>
                    <Input placeholder="Description" onChange={(e) => {
                        setValue('description', e.target.value)
                    }}></Input>
                    <Button>Create</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}