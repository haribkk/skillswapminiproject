
import { useContext } from 'react';
import { AppProvider, AppContext } from './app/AppProvider';
import { AppContextType } from './app/types';

export { AppProvider };

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
