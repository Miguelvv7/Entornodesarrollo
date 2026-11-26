import { createContext, useContext } from 'react';

/** true cuando se renderiza la vista estática para el PDF */
export const PrintContext = createContext(false);
export const usePrint = () => useContext(PrintContext);
