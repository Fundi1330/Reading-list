import type { ChangeEvent } from 'react';
import './Input.css';

interface InputProps {
  type: string;
  className?: string;
  value?: string;
  onChange?: (e: ChangeEvent) => void;
  placeholder?: string;
  id?: string;
  name?: string;
}

function Input({
  className,
  type,
  value,
  onChange,
  placeholder,
  id,
  name,
}: InputProps) {
  return (
    <input
      className={`input ${className ? className : ''}`}
      onChange={onChange}
      value={value}
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
    />
  );
}

export default Input;
