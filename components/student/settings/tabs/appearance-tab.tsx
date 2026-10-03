// components/student/settings/tabs/appearance-tab.tsx
'use client'

import { useState } from 'react'
import { Sun, Moon, Monitor, Globe, Check } from 'lucide-react'

type Theme = 'light' | 'dark' | 'system'
type Language = 'id' | 'en'

export function AppearanceTab() {
  const [theme, setTheme] = useState<Theme>('system')
  const [language, setLanguage] = useState<Language>('id')

  function handleTheme(t: Theme) {
    setTheme(t)
    // Simple: simpan di localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', t)
      if (t === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (t === 'light') {
        document.documentElement.classList.remove('dark')
      } else {
        // system
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (isDark) document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
      }
    }
  }

  function handleLanguage(l: Language) {
    setLanguage(l)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', l)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-black text-on-surface mb-1">Tampilan</h2>
        <p className="text-sm text-on-surface-variant">
          Atur tema dan bahasa aplikasi
        </p>
      </div>

      {/* Theme */}
      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-3">
          Tema
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <ThemeOption
            icon={<Sun className="w-5 h-5" />}
            label="Terang"
            selected={theme === 'light'}
            onClick={() => handleTheme('light')}
          />
          <ThemeOption
            icon={<Moon className="w-5 h-5" />}
            label="Gelap"
            selected={theme === 'dark'}
            onClick={() => handleTheme('dark')}
          />
          <ThemeOption
            icon={<Monitor className="w-5 h-5" />}
            label="Sistem"
            selected={theme === 'system'}
            onClick={() => handleTheme('system')}
          />
        </div>
      </div>

      {/* Language */}
      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-3">
          Bahasa
        </h3>
        <div className="space-y-2">
          <LanguageOption
            flag="🇮🇩"
            label="Bahasa Indonesia"
            description="Tampilan default dalam Bahasa Indonesia"
            selected={language === 'id'}
            onClick={() => handleLanguage('id')}
          />
          <LanguageOption
            flag="🇬🇧"
            label="English"
            description="Display in English"
            selected={language === 'en'}
            onClick={() => handleLanguage('en')}
          />
        </div>
      </div>
    </div>
  )
}

function ThemeOption({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
        selected
          ? 'border-primary bg-primary/5'
          : 'border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container/50'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          selected
            ? 'bg-primary text-white'
            : 'bg-surface-container text-on-surface-variant'
        }`}
      >
        {icon}
      </div>
      <p
        className={`text-xs font-bold ${
          selected ? 'text-primary' : 'text-on-surface'
        }`}
      >
        {label}
      </p>
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
          <Check className="w-3 h-3" />
        </div>
      )}
    </button>
  )
}

function LanguageOption({
  flag,
  label,
  description,
  selected,
  onClick,
}: {
  flag: string
  label: string
  description: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
        selected
          ? 'border-primary bg-primary/5'
          : 'border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container/50'
      }`}
    >
      <span className="text-2xl">{flag}</span>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-bold ${
            selected ? 'text-primary' : 'text-on-surface'
          }`}
        >
          {label}
        </p>
        <p className="text-[11px] text-on-surface-variant mt-0.5">
          {description}
        </p>
      </div>
      {selected && (
        <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
          <Check className="w-3 h-3" />
        </div>
      )}
    </button>
  )
}