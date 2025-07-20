import { forwardRef, type ReactNode } from 'react';
import './DropdownContent.css';

interface DropdownContentProps {
  open: boolean;
  children?: ReactNode;
  top: number | null;
}

const DropdownContent = forwardRef<HTMLDivElement, DropdownContentProps>(
  (props, ref) => {
    const { open, children, top } = props;

    return (
      <div
        ref={ref}
        className={`dropdown-content ${open ? 'content-open' : ''}`}
        // style={{ top: top ? `${top}px` : '100%' }}
      >
        {children}
      </div>
    );
  }
);

export default DropdownContent;
