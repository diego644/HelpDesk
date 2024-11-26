import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  TicketIcon,
  Users,
  Settings,
  LogOut,
  PlusCircle,
} from 'lucide-react';
import NewTicket from './NewTicket';
import TicketList from './TicketList';
import UserManagement from './UserManagement';

const DashboardHome = () => {
  const { user } = useAuth();
  
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Nuevo Ticket */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PlusCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Crear Nuevo Ticket
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      Solicitar Ayuda
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/dashboard/new-ticket"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Crear ticket
              </Link>
            </div>
          </div>
        </div>

        {/* Mis Tickets */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TicketIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Mis Tickets
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      Ver Estado
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/dashboard/tickets"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Ver todos
              </Link>
            </div>
          </div>
        </div>

        {/* Gestión de Usuarios (Solo Admin) */}
        {user?.role === 'admin' && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Gestión de Usuarios
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        Administrar Usuarios
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  to="/dashboard/users"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Gestionar
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  Help Desk
                </span>
              </div>
              {/* Navigation Links */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/dashboard"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Inicio
                </Link>
                <Link
                  to="/dashboard/tickets"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Tickets
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/dashboard/users"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Usuarios
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                Bienvenido, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 hover:text-gray-900 focus:outline-none transition"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="new-ticket" element={<NewTicket />} />
          <Route path="tickets" element={<TicketList />} />
          <Route path="users" element={<UserManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;