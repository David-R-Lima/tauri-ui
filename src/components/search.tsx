"use client"

import * as React from "react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Search } from "lucide-react"

export function SearchComboBox() {
  const [open, setOpen] = React.useState(false)

  return (

    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>                
            <Search className="text-primary hover:cursor-pointer"/>
        </DialogTrigger>
        <DialogContent className="min-h-[30vh]">
        <DialogTitle>Search...</DialogTitle>
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>Calendar</CommandItem>
                <CommandItem>Search Emoji</CommandItem>
                <CommandItem>Calculator</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
    </Dialog>
  )
}
