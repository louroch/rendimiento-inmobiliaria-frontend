import { api } from './api';

export interface TeamMetrics {
  totalAgentes: number;
  totalConsultas: number;
  totalMuestras: number;
  totalOperaciones: number;
  conversionRates: {
    consultasToMuestras: string;
    muestrasToOperaciones: string;
  };
}

export interface AgentRanking {
  agente: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  consultasRecibidas: number;
  muestrasRealizadas: number;
  operacionesCerradas: number;
  numeroCaptaciones: number;
  cantidadPropiedadesTokko: number;
  totalRegistros: number;
  conversionRates: {
    consultasToMuestras: string;
    muestrasToOperaciones: number;
  };
  score: number;
}

export interface Rankings {
  captaciones: AgentRanking[];
  muestras: AgentRanking[];
  operaciones: AgentRanking[];
  conversionConsultas: AgentRanking[];
  conversionMuestras: AgentRanking[];
  scoreGeneral: AgentRanking[];
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
  metrics: {
    totalConsultas: number;
    totalMuestras: number;
    totalOperaciones: number;
    totalCaptaciones: number;
    conversionRates: {
      consultasToMuestras: string;
      muestrasToOperaciones: string;
    };
    percentages: {
      seguimiento: string;
    };
  };
}

export interface DashboardData {
  success: boolean;
  teamMetrics: TeamMetrics;
  rankings: Rankings;
  allAgents: Agent[];
}

export interface AgentPerformanceData {
  success: boolean;
  agent: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  metrics: {
    totalConsultas: number;
    totalMuestras: number;
    totalOperaciones: number;
    totalCaptaciones: number;
    conversionRates: {
      consultasToMuestras: string;
      muestrasToOperaciones: string;
    };
    percentages: {
      seguimiento: string;
    };
  };
  weeklyAnalysis?: {
    currentWeek: any;
    previousWeek: any;
    changes: any;
  };
  ranking: {
    position: number;
    totalAgents: number;
  };
}

export interface WeeklyData {
  weekNumber: number;
  startFormatted: string;
  metrics: {
    consultasRecibidas: number;
    muestrasRealizadas: number;
    operacionesCerradas: number;
    numeroCaptaciones: number;
  };
}

export interface TrendsData {
  success: boolean;
  weeklyData: WeeklyData[];
  trends: {
    consultas: { direction: string; percentage: number };
    muestras: { direction: string; percentage: number };
    operaciones: { direction: string; percentage: number };
  };
  topPerformersCurrentWeek: any[];
}

export interface ExportData {
  success: boolean;
  data: {
    metadata: {
      generated: string;
      totalRecords: number;
      totalAgents: number;
    };
    summary: {
      totalConsultas: number;
      totalMuestras: number;
      totalOperaciones: number;
      totalCaptaciones: number;
    };
    rankings: {
      captaciones: AgentRanking[];
      muestras: AgentRanking[];
      operaciones: AgentRanking[];
      scoreGeneral: AgentRanking[];
    };
    agents: Agent[];
    records: any[];
  };
}

class ReportsService {
  // Dashboard principal
  async getDashboard(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<DashboardData> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const response = await api.get(`/reports/dashboard?${queryParams.toString()}`);
    return response.data;
  }

  // Análisis individual de agente
  async getAgentPerformance(
    agentId: string,
    params?: {
      startDate?: string;
      endDate?: string;
      includeWeekly?: boolean;
    }
  ): Promise<AgentPerformanceData> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.includeWeekly) queryParams.append('includeWeekly', 'true');
    
    const response = await api.get(`/reports/agent-performance/${agentId}?${queryParams.toString()}`);
    return response.data;
  }

  // Tendencias temporales
  async getTrends(params?: {
    weeks?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<TrendsData> {
    const queryParams = new URLSearchParams();
    if (params?.weeks) queryParams.append('weeks', params.weeks.toString());
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const response = await api.get(`/reports/trends?${queryParams.toString()}`);
    return response.data;
  }

  // Exportación de datos
  async getExportData(params?: {
    startDate?: string;
    endDate?: string;
    format?: 'json' | 'pdf' | 'excel';
  }): Promise<ExportData> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.format) queryParams.append('format', params.format);
    
    const response = await api.get(`/reports/export?${queryParams.toString()}`);
    return response.data;
  }

  // Exportar a PDF
  async exportToPDF(params?: {
    startDate?: string;
    endDate?: string;
    templateType?: 'dashboard' | 'agent-performance' | 'trends' | 'summary';
    agentId?: string;
  }): Promise<Blob> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.templateType) queryParams.append('templateType', params.templateType);
    if (params?.agentId) queryParams.append('agentId', params.agentId);
    queryParams.append('format', 'pdf');
    
    const response = await api.get(`/reports/export?${queryParams.toString()}`, {
      responseType: 'blob',
      timeout: 60000, // 60 segundos para PDFs que pueden tardar más
      headers: {
        'Accept': 'application/pdf, application/octet-stream'
      }
    });
    
    // Verificar que el blob no esté vacío
    if (response.data.size === 0) {
      throw new Error('El archivo PDF generado está vacío');
    }
    
    return response.data;
  }

  // Exportar a Excel
  async exportToExcel(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    queryParams.append('format', 'excel');
    
    const response = await api.get(`/reports/export?${queryParams.toString()}`, {
      responseType: 'blob',
      timeout: 45000, // 45 segundos para Excel
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream'
      }
    });
    
    // Verificar que el blob no esté vacío
    if (response.data.size === 0) {
      throw new Error('El archivo Excel generado está vacío');
    }
    
    return response.data;
  }
}

export const reportsService = new ReportsService();
