"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import authService from "@/lib/http/authService";

interface User {
  id: string;
  name: string;
  role: string;
  permissions: string[];
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = sessionStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    if (!session) {
      // Session is null (user logged out), remove stored user
      setUser(null);
      sessionStorage.removeItem("user");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = session && await authService.getProfile(session.accessToken);
        setUser(data);
        sessionStorage.setItem("user", JSON.stringify({role: data.role, permissions: data.permissions, name: data.fullName, email: data.email}));
      } catch {
        setUser(null);
        sessionStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if stored user doesn't exist or session updated
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      fetchUser();
    } else {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    }
  }, [session]); // refetch whenever session changes

  const handleSetUser = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      sessionStorage.setItem("user", JSON.stringify(userData));
    } else {
      sessionStorage.removeItem("user");
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser: handleSetUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
