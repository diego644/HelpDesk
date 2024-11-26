import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';

const statusStyles = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_proceso: 'bg-blue-100 text-blue-800',
  resuelto: 'bg-green-100 text-green-800',
};

const priorityStyles = {
  baja: 'text-green-600',
  media: 'text-yellow-600',
  alta: 'text-red-600',
};

const TicketList = () => {
  const { tickets, updateTicketStatus, addComment, canUpdateStatus } = useTickets();
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleStatusChange = (ticketId: string, newStatus: 'pendiente' | 'en_proceso' | 'resuelto') => {
    updateTicketStatus(ticketId, newStatus);
  };

  const handleCommentSubmit = (ticketId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(ticketId, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Mis Tickets
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link to="/dashboard/new-ticket" className="btn">
            Nuevo Ticket
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {ticket.status === 'pendiente' && <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />}
                    {ticket.status === 'en_proceso' && <Clock className="h-5 w-5 text-blue-500 mr-2" />}
                    {ticket.status === 'resuelto' && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {ticket.title}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex items-center space-x-2">
                    {canUpdateStatus(ticket) && (
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value as any)}
                        className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="resuelto">Resuelto</option>
                      </select>
                    )}
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[ticket.status]}`}>
                      {ticket.status === 'pendiente' && 'Pendiente'}
                      {ticket.status === 'en_proceso' && 'En Proceso'}
                      {ticket.status === 'resuelto' && 'Resuelto'}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Tipo: {ticket.type}
                    </p>
                    <p className={`mt-2 flex items-center text-sm ${priorityStyles[ticket.priority]} sm:mt-0 sm:ml-6`}>
                      Prioridad: {ticket.priority}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Creado el {ticket.createdAt}</p>
                  </div>
                </div>

                {/* Comentarios */}
                <div className="mt-4">
                  <button
                    onClick={() => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {ticket.comments.length} comentarios
                  </button>

                  {selectedTicket === ticket.id && (
                    <div className="mt-3">
                      <div className="space-y-3">
                        {ticket.comments.map((comment) => (
                          <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{comment.userName}</span>
                              <span className="text-gray-500">
                                {new Date(comment.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="mt-1 text-gray-700">{comment.content}</p>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={(e) => handleCommentSubmit(ticket.id, e)} className="mt-3">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Agregar un comentario..."
                            className="flex-1 min-w-0 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                          <button
                            type="submit"
                            className="btn"
                          >
                            Comentar
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TicketList;