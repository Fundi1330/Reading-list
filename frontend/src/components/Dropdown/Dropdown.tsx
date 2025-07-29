import {
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react';

import DropDownButton from '../DropdownButton/DropdownButton';
import DropdownContent from '../DropdownContent/DropdownContent';
import './Dropdown.css';

interface DropdownProps {
  buttonText?: string;
  content: ReactNode;
}

function Dropdown({ buttonText, content }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [dropdownTop] = useState<number | null>(0);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const path = event.composedPath ? event.composedPath() : [];
      if (
        !path.includes(dropdownRef.current as EventTarget) &&
        !dropdownRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handler);

    return () => {
      document.removeEventListener('click', handler);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    // if (!open) {
    //   if (!buttonRef.current || !contentRef.current) return;
    //   const spaceRemaining =
    //     window.innerHeight - buttonRef.current?.getBoundingClientRect().bottom;
    //   const contentHeight = contentRef.current?.clientHeight;

    //   const topPosition =
    //     spaceRemaining > contentHeight ? null : spaceRemaining - contentHeight;
    //   setDropdownTop(topPosition);
    // }

    setOpen((open) => {
      return !open;
    });
  };

  return (
    <div className='dropdown' ref={dropdownRef as RefObject<HTMLDivElement>}>
      <DropDownButton ref={buttonRef} toggle={toggleDropdown} open={open}>
        {buttonText}
      </DropDownButton>
      <DropdownContent top={dropdownTop} ref={contentRef} open={open}>
        {content}
      </DropdownContent>
    </div>
  );
}

export default Dropdown;
