// components/shared/command-palette/types.ts
import type { LucideIcon } from 'lucide-react'

export type CommandItem = {
  id: string
  label: string
  description?: string
  icon: LucideIcon
  href?: string
  action?: () => void
  group: string
  keywords?: string[]
}

export type CommandGroup = {
  name: string
  items: CommandItem[]
}