import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'tecnico' | 'cliente';
  active: boolean;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_USERS: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@helpdesk.com',
    password: 'admin123',
    role: 'admin',
    active: true,
  },
  {
    id: '2',
    name: 'Técnico',
    email: 'tecnico@helpdesk.com',
    password: 'tecnico123',
    role: 'tecnico',
    active: true,
  },
  {
    id: '3',
    name: 'Cliente',
    email: 'cliente@helpdesk.com',
    password: 'cliente123',
    role: 'cliente',
    active: true,
  },
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState(INITIAL_USERS);

  const login = async (email: string, password: string) => {
    const foundUser = users.find(u => u.email === email && u.password === password && u.active);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
    } else {
      throw new Error('Credenciales inválidas');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      password: 'password123', // Default password
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...userData } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users: users.map(({ password: _, ...user }) => user),
        isAuthenticated: !!user,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};