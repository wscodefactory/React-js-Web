import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import type { SelectOption } from '../../types/common';

/**
 * 라벨과 입력 요소를 하나의 블록으로 묶어주는 기본 필드 래퍼 props.
 */
interface FormFieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * 공용 폼 필드 래퍼.
 *
 * label과 실제 입력 UI를 함께 감싸서
 * 폼의 시각적 일관성을 유지하도록 돕는다.
 */
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

/**
 * 공용 input 래퍼.
 *
 * 프로젝트 공통 입력 스타일을 적용하면서
 * 기본 HTML input 속성은 그대로 전달한다.
 */
export function Input({ className = '', ...props }: InputProps) {
  return <input className={`form-input ${className}`} {...props} />;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  className?: string;
}

/**
 * option 목록을 받아 select를 렌더링하는 공용 셀렉트 컴포넌트.
 */
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

/**
 * 컬러 피커 + 텍스트 입력을 동시에 제공하는 보조 입력 컴포넌트.
 *
 * 사용자가 시각적으로 색을 고르거나,
 * 직접 HEX 값을 입력하는 두 방식을 모두 지원한다.
 */
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
