import { forwardRef, type ComponentType } from 'react';
import { type ButtonType } from '../Button/Button';
import './IconButton.css';

const IconButton = <T extends ButtonType = ButtonType>(
  CompParam: ComponentType<T>
) => {
  const IconWithButton = forwardRef((props: ButtonType, ref) => {
    const combinedClassName = props.className
      ? `icon-btn ${props.className}`
      : 'icon-btn';
    return (
      <CompParam ref={ref} {...(props as T)} className={combinedClassName} />
    );
  });
  return IconWithButton;
};

export default IconButton;
