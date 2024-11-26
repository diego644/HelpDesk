import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

interface TicketFormData {
  title: string;
  description: string;
  priority: 'baja' | 'media' | 'alta';
  type: 'problema' | 'tarea' | 'incidente';
}

const TicketForm = () => {
  const navigate = useNavigate();
  const { addTicket } = useTickets();
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    priority: 'media',
    type: 'problema',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTicket(formData);
    navigate('/dashboard/tickets');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          type="text"
          id="title"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          rows={4}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Prioridad
          </label>
          <select
            id="priority"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketFormData['priority'] })}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Tipo
          </label>
          <select
            id="type"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as TicketFormData['type'] })}
          >
            <option value="problema">Problema</option>
            <option value="tarea">Tarea</option>
            <option value="incidente">Incidente</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="btn-secondary"
        >
          Cancelar
        </button>
        <button type="submit" className="btn">
          Crear Ticket
        </button>
      </div>
    </form>
  );
};

export default TicketForm;