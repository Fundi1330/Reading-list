import { useContext } from 'react';
import './AlertList.css';
import {
  AlertContext,
  type AlertContextType,
} from '../../context/Alert/AlertContext';

import Alert from '../Alert/Alert';

function AlertList() {
  const { alerts } = useContext<AlertContextType>(AlertContext);
  return (
    <div className='alert-list'>
      {alerts.map((alert) => (
        <Alert key={alert.id} id={alert.id} className={alert.className}>
          {alert.children}
        </Alert>
      ))}
    </div>
  );
}

export default AlertList;
