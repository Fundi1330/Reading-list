import React, { useState, type ReactElement } from 'react';
import { type InputType } from '../Input/Input';
import IconButton from '../IconButton/IconButton';
import Button from '../Button/Button';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';

import './PasswordInput.css';

interface PasswordInputProps {
  children: ReactElement<InputType>;
}

function PasswordInput({ children }: PasswordInputProps) {
  const [isVisible, setVisible] = useState(false);

  const getType = () => (isVisible ? 'text' : 'password');
  const newProps = {
    ...children.props,
    type: getType(),
  };

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  const EyeIconButton = IconButton(Button);

  return (
    <div className='input-container'>
      {React.cloneElement(children, newProps)}
      <EyeIconButton onClick={toggleVisible}>
        {isVisible ? (
          <RiEyeOffFill size={'1.35rem'} />
        ) : (
          <RiEyeFill size={'1.35rem'} />
        )}
      </EyeIconButton>
    </div>
  );
}

export default PasswordInput;
