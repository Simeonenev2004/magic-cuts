import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// temporary user until real authentication is added
const fakeUser = { uid: 'test', email: 'test@magiccuts.bg', name: 'Тест' };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(false);

  const login = () => {
    setUser(fakeUser);
  };

  const register = () => {
    setUser(fakeUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
