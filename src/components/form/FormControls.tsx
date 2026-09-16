import {
  forwardRef,
  type CSSProperties,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
} from 'react'
import {
  ThemeDropdown,
  type ThemeDropdownOption,
} from './ThemeDropdown'

export type { ThemeDropdownOption }
export { ThemeDropdown }

type InputProps = InputHTMLAttributes<HTMLInputElement>
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const ThemeInput = forwardRef<HTMLInputElement, InputProps>(
  function ThemeInput({ className = '', ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`theme-input${className ? ` ${className}` : ''}`}
        {...props}
      />
    )
  },
)

export const ThemeTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function ThemeTextarea({ className = '', ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={`theme-textarea${className ? ` ${className}` : ''}`}
        {...props}
      />
    )
  },
)

interface FieldShellProps {
  id: string
  label: string
  hint?: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export function FieldShell({
  id,
  label,
  hint,
  className = '',
  style,
  children,
}: FieldShellProps) {
  return (
    <div className={`field${className ? ` ${className}` : ''}`} style={style}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint ? <p className="field__hint">{hint}</p> : null}
    </div>
  )
}

interface TextFieldProps extends Omit<InputProps, 'id' | 'onChange'> {
  id: string
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  fieldStyle?: CSSProperties
}

export function TextField({
  id,
  label,
  hint,
  value,
  onChange,
  fieldStyle,
  className,
  ...props
}: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} style={fieldStyle}>
      <ThemeInput
        id={id}
        className={className}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </FieldShell>
  )
}

interface TextAreaFieldProps extends Omit<TextareaProps, 'id' | 'onChange'> {
  id: string
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  fieldStyle?: CSSProperties
}

export function TextAreaField({
  id,
  label,
  hint,
  value,
  onChange,
  fieldStyle,
  className,
  ...props
}: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} style={fieldStyle}>
      <ThemeTextarea
        id={id}
        className={className}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </FieldShell>
  )
}

interface SelectFieldProps {
  id: string
  label: string
  hint?: string
  value: string
  options: ThemeDropdownOption[]
  onChange: (value: string) => void
  fieldStyle?: CSSProperties
  pill?: boolean
  disabled?: boolean
}

export function SelectField({
  id,
  label,
  hint,
  value,
  options,
  onChange,
  fieldStyle,
  pill = false,
  disabled = false,
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} style={fieldStyle}>
      <ThemeDropdown
        id={id}
        value={value}
        options={options}
        onChange={onChange}
        ariaLabel={label}
        pill={pill}
        disabled={disabled}
      />
    </FieldShell>
  )
}

interface CheckboxFieldProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  hint?: string
}

export function CheckboxField({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  hint,
}: CheckboxFieldProps) {
  return (
    <div>
      <label
        className={`theme-checkbox${disabled ? ' is-disabled' : ''}`}
        htmlFor={id}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="theme-checkbox__box" aria-hidden />
        <span className="theme-checkbox__label">{label}</span>
      </label>
      {hint ? <p className="field__hint">{hint}</p> : null}
    </div>
  )
}
