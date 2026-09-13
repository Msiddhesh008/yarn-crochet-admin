import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { ChevronDown } from 'lucide-react'

export interface ThemeDropdownOption {
  value: string
  label: string
}

interface ThemeDropdownProps {
  value: string
  options: ThemeDropdownOption[]
  onChange: (value: string) => void
  ariaLabel?: string
  id?: string
  pill?: boolean
  className?: string
  disabled?: boolean
}

export function ThemeDropdown({
  value,
  options,
  onChange,
  ariaLabel,
  id,
  pill = false,
  className = '',
  disabled = false,
}: ThemeDropdownProps) {
  const autoId = useId()
  const listId = `${id ?? autoId}-list`
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const onTriggerKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(true)
    }
  }

  return (
    <div
      ref={rootRef}
      className={`theme-dropdown${pill ? ' theme-dropdown--pill' : ''}${open ? ' is-open' : ''}${className ? ` ${className}` : ''}`}
    >
      <button
        id={id}
        type="button"
        className="theme-dropdown__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKey}
      >
        <span>{selected?.label ?? 'Select'}</span>
        <ChevronDown size={16} className="theme-dropdown__chevron" aria-hidden />
      </button>
      {open ? (
        <ul
          id={listId}
          className="theme-dropdown__menu"
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((option) => {
            const active = option.value === value
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`theme-dropdown__option${active ? ' is-active' : ''}`}
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                >
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
