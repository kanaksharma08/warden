
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthState, User, UserRole } from "@/lib/types";

// Mock data for demonstration
const MOCK_USERS: Record<string, User> = {
  "student@example.com": {
    id: "1",
    name: "Alex Johnson",
    email: "student@example.com",
    role: "student",
    avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff",
  },
  "warden@example.com": {
    id: "2",
    name: "Sam Davis",
    email: "warden@example.com",
    role: "warden",
    avatar: "https://ui-avatars.com/api/?name=Sam+Davis&background=0D8ABC&color=fff",
  },
  "admin@example.com": {
    id: "3",
    name: "Jordan Smith",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://ui-avatars.com/api/?name=Jordan+Smith&background=0D8ABC&color=fff",
  },
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setRole: (role: UserRole) => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType>({
  ...defaultAuthState,
  login: async () => false,
  logout: () => {},
  setRole: () => {},
  register: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("hostelsphere-user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("hostelsphere-user");
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, we would make an API call here
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = MOCK_USERS[email.toLowerCase()];
        if (user && password === "password") {
          // Store user in localStorage
          localStorage.setItem("hostelsphere-user", JSON.stringify(user));
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // In a real app, we would make an API call here
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if user already exists
        if (MOCK_USERS[email.toLowerCase()]) {
          resolve(false);
          return;
        }

        // Create a new user (in a real app, this would be stored in a database)
        const newUser: User = {
          id: `${Object.keys(MOCK_USERS).length + 1}`,
          name,
          email: email.toLowerCase(),
          role: "student", // Default role for new registrations
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
        };

        // Add user to mock data (in a real app, this would be saved to a database)
        MOCK_USERS[email.toLowerCase()] = newUser;
        
        // In a real application, we might automatically log the user in after registration
        // For this demo, we'll just return success and require them to log in
        resolve(true);
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem("hostelsphere-user");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // For demo purposes - allows switching roles
  const setRole = (role: UserRole) => {
    if (!authState.user) return;
    
    const newUser = { ...authState.user, role };
    localStorage.setItem("hostelsphere-user", JSON.stringify(newUser));
    setAuthState({
      ...authState,
      user: newUser,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, setRole, register }}>
      {children}
    </AuthContext.Provider>
  );
};
