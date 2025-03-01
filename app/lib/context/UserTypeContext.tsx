import React, { createContext, useState, useContext, ReactNode } from 'react';
import { UserType } from '../../types';

type UserTypeContextType = {
  userType: UserType;
  setUserType: (userType: UserType) => void;
};

const UserTypeContext = createContext<UserTypeContextType | undefined>(undefined);

export const UserTypeProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserType] = useState<UserType>('customer');

  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
};

export const useUserType = (): UserTypeContextType => {
  const context = useContext(UserTypeContext);
  if (context === undefined) {
    throw new Error('useUserType must be used within a UserTypeProvider');
  }
  return context;
};
