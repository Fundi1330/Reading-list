import type {
  ChangeEvent,
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
  ReactNode,
} from 'react';
import './Input.css';

interface InputProps {
  type: HTMLInputTypeAttribute;
  className?: string;
  value?: string;
  children?: ReactNode;
  onChange?: (e: ChangeEvent) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  minLength?: number;
  maxLength?: number;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  required?: boolean;
}

function Input({
  className,
  type,
  value,
  autoComplete,
  onChange,
  placeholder,
  id,
  name,
  minLength,
  maxLength,
  required,
}: InputProps) {
  return (
    <input
      className={`input ${className ? className : ''}`}
      onChange={onChange}
      value={value}
      type={type}
      id={id}
      autoComplete={autoComplete}
      name={name}
      required={required}
      placeholder={placeholder}
      minLength={minLength}
      maxLength={maxLength}
    />
  );
}

export default Input;
export type { InputProps as InputType };
