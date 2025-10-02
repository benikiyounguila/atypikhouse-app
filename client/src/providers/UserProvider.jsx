
import { createContext } from 'react';
import { useProvideAuth } from '../../hooks';

const initialState = {
  user: null,
  register: () => {},
  login: () => {},
  googleLogin: () => {},
  logout: () => {},
  loading: true,
};

export const UserContext = createContext(initialState);

export const UserProvider = ({ children, initialUser = null }) => {
  const auth = useProvideAuth(initialUser);
  return <UserContext.Provider value={auth}>{children}</UserContext.Provider>;
};
