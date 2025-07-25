import { RiArrowDownWideLine, RiArrowLeftWideLine } from 'react-icons/ri';
import Button from '../Button/Button';
import { forwardRef, type ReactNode } from 'react';
import './DropdownButton.css';
import IconButton from '../IconButton/IconButton';

interface DropdownButtonProps {
  open: boolean;
  toggle: () => void;
  children?: ReactNode;
}

const DropDownButton = forwardRef<HTMLButtonElement, DropdownButtonProps>(
  (props, ref) => {
    const { open, toggle, children } = props;

    const DropdownButton = IconButton(Button);

    return (
      <DropdownButton
        ref={ref}
        className={`dropdown-btn ${open ? 'btn-open' : ''}`}
        onClick={toggle}
      >
        {children}
        {open ? (
          <RiArrowLeftWideLine className='toggle-icon' size='1.35rem' />
        ) : (
          <RiArrowDownWideLine className='toggle-icon' size='1.35rem' />
        )}
      </DropdownButton>
    );
  }
);

export default DropDownButton;
