import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'pendiente' | 'en_proceso' | 'resuelto';
  priority: 'baja' | 'media' | 'alta';
  type: 'problema' | 'tarea' | 'incidente';
  createdAt: string;
  comments: Comment[];
}

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'comments'>) => void;
  updateTicketStatus: (id: string, status: Ticket['status']) => void;
  addComment: (ticketId: string, content: string) => void;
  canUpdateStatus: (ticket: Ticket) => boolean;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      title: 'Aire acondicionado no funciona',
      description: 'El aire acondicionado del piso 3 no enfría correctamente',
      status: 'pendiente',
      priority: 'alta',
      type: 'problema',
      createdAt: '2024-03-15',
      comments: [],
    },
    {
      id: '2',
      title: 'Cambio de luminarias en pasillo',
      description: 'Se requiere cambiar las luces del pasillo principal',
      status: 'en_proceso',
      priority: 'media',
      type: 'tarea',
      createdAt: '2024-03-14',
      comments: [],
    },
    {
      id: '3',
      title: 'Fuga de agua en baño',
      description: 'Hay una fuga de agua en el baño del primer piso',
      status: 'resuelto',
      priority: 'alta',
      type: 'incidente',
      createdAt: '2024-03-13',
      comments: [],
    },
  ]);

  const addTicket = (ticketData: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'comments'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      status: 'pendiente',
      createdAt: new Date().toISOString().split('T')[0],
      comments: [],
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const updateTicketStatus = (id: string, status: Ticket['status']) => {
    if (!user || !['admin', 'tecnico'].includes(user.role)) return;
    
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, status } : ticket
      )
    );
  };

  const addComment = (ticketId: string, content: string) => {
    if (!user) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      ticketId,
      userId: user.id,
      userName: user.name,
      content,
      createdAt: new Date().toISOString(),
    };

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, comments: [...ticket.comments, newComment] }
          : ticket
      )
    );
  };

  const canUpdateStatus = (ticket: Ticket) => {
    return user ? ['admin', 'tecnico'].includes(user.role) : false;
  };

  return (
    <TicketContext.Provider
      value={{ tickets, addTicket, updateTicketStatus, addComment, canUpdateStatus }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets debe ser usado dentro de un TicketProvider');
  }
  return context;
};