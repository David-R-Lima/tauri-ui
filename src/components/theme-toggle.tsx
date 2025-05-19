import { Moon, Sun } from "lucide-react"
import { useTheme } from "./providers/theme-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 hover:cursor-pointer" asChild>
       {theme === "light" ? (
          <Sun className="size-12" />
       ) : (
         <Moon className="size-12" />
       )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-2 p-1">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
