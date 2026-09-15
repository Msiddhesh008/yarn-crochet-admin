interface ThemeSwitchProps {
  id: string
  checked: boolean
  disabled?: boolean
  ariaLabel: string
  onChange: (checked: boolean) => void
}

export function ThemeSwitch({
  id,
  checked,
  disabled = false,
  ariaLabel,
  onChange,
}: ThemeSwitchProps) {
  return (
    <label
      className={`theme-switch${checked ? ' is-on' : ''}${disabled ? ' is-disabled' : ''}`}
      htmlFor={id}
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="theme-switch__track" aria-hidden>
        <span className="theme-switch__thumb" />
      </span>
    </label>
  )
}
