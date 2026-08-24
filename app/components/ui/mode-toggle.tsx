"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

const THEME_ORDER = ["light", "dark", "system"] as const

const THEME_META = {
  light: { icon: Sun, label: "Light" },
  dark: { icon: Moon, label: "Dark" },
  system: { icon: Monitor, label: "System" },
} as const

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

  const current = (THEME_ORDER.includes(theme as never) ? theme : "system") as
    | (typeof THEME_ORDER)[number]
  const { icon: Icon, label } = THEME_META[current]

  return (
    <button
      onClick={() => setTheme(THEME_ORDER[(THEME_ORDER.indexOf(current) + 1) % THEME_ORDER.length])}
      className="inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-accent hover:text-accent-foreground"
      aria-label={`Theme: ${label}. Click to switch`}
      title={`Theme: ${label}`}
    >
      <Icon className="h-[1.2rem] w-[1.2rem]" />
    </button>
  )
}
