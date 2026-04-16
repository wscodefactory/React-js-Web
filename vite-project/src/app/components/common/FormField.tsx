import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import type { SelectOption } from '../../types/common';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, children, className = '' }: FormFieldProps) {
  return (
    <div className={`form-group ${className}`}>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className = '', ...props }: InputProps) {
  return <input className={`form-input ${className}`} {...props} />;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  className?: string;
}

export function Select({ options, className = '', ...props }: SelectProps) {
  return (
    <select className={`form-select ${className}`} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface ColorInputProps {
  label: string;
  defaultValue?: string;
  onChange?: (color: string) => void;
}

export function ColorInput({ label, defaultValue = '#000000', onChange }: ColorInputProps) {
  return (
    <FormField label={label}>
      <div className="form-color-group">
        <input
          type="color"
          defaultValue={defaultValue}
          className="form-color-picker"
          onChange={(e) => onChange?.(e.target.value)}
        />
        <Input type="text" defaultValue={defaultValue} onChange={(e) => onChange?.(e.target.value)} />
      </div>
    </FormField>
  );
}
