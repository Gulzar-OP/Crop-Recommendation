import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser, logoutUser, registerUser } from "../api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  const login = async (data) => {
    const result = await loginUser(data);
    setUser(result.user);
    return result;
  };
  const register = async (data) => {
    const result = await registerUser(data);
    setUser(result.user);
    return result;
  };
  const logout = async () => {
    await logoutUser();
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
