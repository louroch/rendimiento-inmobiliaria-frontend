import React, { useState, useEffect } from 'react';
import { Button, Select, SelectItem, Card } from '@tremor/react';
import { Filter, Download } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import TokkoDashboard from '../components/TokkoDashboard';
import { TokkoFilters } from '../services/tokkoService';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

const TokkoDashboardPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<TokkoFilters>({
    userId: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof TokkoFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDateChange = (key: 'startDate' | 'endDate', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      userId: '',
      startDate: '',
      endDate: ''
    });
  };

  const exportData = async () => {
    try {
      // Aquí podrías implementar la exportación de datos de Tokko
      console.log('Exportando datos de Tokko...');
      // TODO: Implementar exportación específica para Tokko
    } catch (error) {
      console.error('Error exportando datos:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#240046' }}></div>
      </div>
    );
  }

  return (
    <AdminLayout 
      title="Dashboard de Tokko CRM" 
      subtitle="Métricas y análisis del uso de Tokko CRM"
      showBackButton={true}
      backPath="/admin"
    >
      <div className="space-y-6">
        {/* Filtros */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Agente
              </label>
              <Select
                value={filters.userId}
                onValueChange={(value) => handleFilterChange('userId', value)}
                placeholder="Todos los agentes"
                className="w-full"
              >
                <SelectItem value="">Todos los agentes</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-[#240046] transition-colors"
              />
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#240046] focus:border-[#240046] transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={clearFilters}
                variant="secondary"
                icon={Filter}
                size="sm"
              >
                Limpiar
              </Button>
              <Button
                onClick={exportData}
                variant="secondary"
                icon={Download}
                size="sm"
              >
                Exportar
              </Button>
            </div>
          </div>
        </Card>

        {/* Dashboard de Tokko */}
        <TokkoDashboard filters={filters} />
      </div>
    </AdminLayout>
  );
};

export default TokkoDashboardPage;
