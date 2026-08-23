"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { DropdownMenu } from "radix-ui"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-accent hover:text-accent-foreground" aria-label="Toggle theme" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </button>
    )
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-accent hover:text-accent-foreground relative" aria-label="Select theme">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-card p-1 text-card-foreground shadow-md"
        >
          <DropdownMenu.Item
            onClick={() => setTheme("light")}
            className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground ${theme === "light" ? "bg-accent" : ""}`}
          >
            <Sun className="mr-2 h-4 w-4" />
            Light
            {theme === "light" && <span className="ml-auto text-xs">●</span>}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => setTheme("dark")}
            className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground ${theme === "dark" ? "bg-accent" : ""}`}
          >
            <Moon className="mr-2 h-4 w-4" />
            Dark
            {theme === "dark" && <span className="ml-auto text-xs">●</span>}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => setTheme("system")}
            className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground ${theme === "system" ? "bg-accent" : ""}`}
          >
            <Monitor className="mr-2 h-4 w-4" />
            System
            {theme === "system" && <span className="ml-auto text-xs">●</span>}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
