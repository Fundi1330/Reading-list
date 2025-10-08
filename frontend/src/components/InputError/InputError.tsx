import type { ReactNode } from 'react';
import './InputError.css';

interface InputErrorProps {
  className?: string;
  children: ReactNode;
}

function InputError({ className, children }: InputErrorProps) {
  return <span className={`input-error ${className}`}>{children}</span>;
}

export default InputError;
