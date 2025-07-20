import { forwardRef, type ReactNode } from 'react';

import './Button.css';

interface ButtonProps {
  className?: string;
  onClick: () => void;
  children: string | ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, children, onClick } = props;
  console.log(className === 'icon-btn');
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`btn ${className ? className : ''}`}
    >
      {children}
    </button>
  );
});

export default Button;
export type { ButtonProps as ButtonType };
