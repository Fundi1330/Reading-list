import type { ReactNode } from 'react';
import './DropdownItem.css';

interface DropdownItemProps {
  children: ReactNode;
  onClick: () => void;
}

function DropdownItem({ children, onClick }: DropdownItemProps) {
  return (
    <div className='dropdown-item' onClick={onClick}>
      {children}
    </div>
  );
}

export default DropdownItem;
