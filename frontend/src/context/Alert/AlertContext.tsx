import { createContext } from 'react';
import type { AlertType } from '../../components/Alert/Alert';

export interface AlertContextType {
  alerts: AlertType[];
  setAlerts: Function;
}

export const AlertContext = createContext<AlertContextType>({
  alerts: [],
  setAlerts: () => {},
});
