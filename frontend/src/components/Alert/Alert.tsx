import { useContext, type ReactNode } from 'react';
import './Alert.css';
import {
  AlertContext,
  type AlertContextType,
} from '../../context/AlertContext';
import Button from '../Button/Button';
import { RiCloseLargeFill } from 'react-icons/ri';

interface AlertProps {
  id: string;
  className?: 'alert-success' | 'alert-warning' | 'alert-error';
  children: ReactNode;
}

function Alert({ id, className, children }: AlertProps) {
  const { setAlerts } = useContext<AlertContextType>(AlertContext);
  const onClick = () => {
    setAlerts((alerts: AlertProps[]) => alerts.filter((a) => !(a.id === id)));
  };

  return (
    <div className={`alert ${className ? className : ''}`}>
      {children}
      <Button onClick={onClick}>
        <RiCloseLargeFill size='1.2rem' />
      </Button>
    </div>
  );
}

export default Alert;
export type { AlertProps as AlertType };
