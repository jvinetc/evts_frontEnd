import { createContext, useState } from "react";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setAdmin] = useState(false); // Estado global

  return (
    <AdminContext.Provider value={{ isAdmin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};