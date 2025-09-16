// Tipos para los datos de performance
export interface PerformanceData {
  id: string;
  fecha: string;
  consultasRecibidas: number;
  muestrasRealizadas: number;
  operacionesCerradas: number;
  seguimiento: boolean;
  usoTokko: string | null;
  // Nuevos campos de Tokko
  cantidadPropiedadesTokko?: number | null;
  linksTokko?: string | null;
  dificultadTokko?: boolean | null;
  detalleDificultadTokko?: string | null;
  observaciones?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt?: string;
}

// Tipo para el formulario de performance
export interface PerformanceFormData {
  fecha: string;
  consultasRecibidas: number;
  muestrasRealizadas: number;
  operacionesCerradas: number;
  seguimiento: boolean;
  usoTokko: string;
  // Nuevos campos
  cantidadPropiedadesTokko: string | number;
  linksTokko: string;
  dificultadTokko: boolean | null;
  detalleDificultadTokko: string;
  observaciones: string;
}

// Tipos para las métricas de Tokko CRM
export interface TokkoResumen {
  totalRegistrosConTokko: number;
  totalPropiedadesCargadas: number;
  promedioPropiedadesPorRegistro: number;
  totalRegistrosConPropiedades: number;
}

export interface TokkoDificultadUso {
  total: number;
  si: number;
  no: number;
  porcentajes: {
    si: number;
    no: number;
  };
}

export interface TokkoUsoDistribucion {
  tipo: string;
  cantidad: number;
}

export interface TokkoUso {
  totalRegistros: number;
  distribucion: TokkoUsoDistribucion[];
}

export interface TokkoDificultadDetallada {
  detalle: string;
  fecha: string;
  agente: string;
}

export interface TokkoPorAgente {
  agente: {
    id: string;
    name: string;
    email: string;
  };
  totalPropiedades: number;
  totalRegistros: number;
}

export interface TokkoRegistro {
  id: string;
  fecha: string;
  agente: {
    id: string;
    name: string;
    email: string;
  };
  cantidadPropiedades: number;
  dificultad: boolean;
  detalleDificultad: string | null;
  usoTokko: string;
  observaciones: string;
}

export interface TokkoStats {
  resumen: TokkoResumen;
  dificultadUso: TokkoDificultadUso;
  usoTokko: TokkoUso;
  dificultadesDetalladas: TokkoDificultadDetallada[];
  porAgente: TokkoPorAgente[];
  registros: TokkoRegistro[];
}

// Tipos para Desempeño Semanal
export interface SemanaInfo {
  numero: number;
  inicio: string;
  fin: string;
  inicioFormateado: string;
  finFormateado: string;
}

export interface CambioMetrica {
  value: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ResumenSemanal {
  totalRegistros: number;
  consultasRecibidas: number;
  muestrasRealizadas: number;
  operacionesCerradas: number;
  propiedadesTokko: number;
  porcentajeSeguimiento: number;
  porcentajeDificultad: number;
}

export interface PromediosSemanal {
  consultasPorDia: number;
  muestrasPorDia: number;
  operacionesPorDia: number;
  propiedadesPorDia: number;
}

export interface CambiosSemanal {
  consultas: CambioMetrica;
  muestras: CambioMetrica;
  operaciones: CambioMetrica;
  propiedades: CambioMetrica;
}

export interface SemanaAnterior {
  inicio: string;
  fin: string;
  totalRegistros: number;
  consultasRecibidas: number;
  muestrasRealizadas: number;
  operacionesCerradas: number;
  propiedadesTokko: number;
}

export interface WeeklyStats {
  semana: SemanaInfo;
  resumen: ResumenSemanal;
  promedios: PromediosSemanal;
  cambios: CambiosSemanal;
  semanaAnterior: SemanaAnterior;
}

export interface AgenteSemanal {
  agente: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  semanaActual: {
    totalRegistros: number;
    consultasRecibidas: number;
    muestrasRealizadas: number;
    operacionesCerradas: number;
    propiedadesTokko: number;
    promedioConsultas: number;
    promedioMuestras: number;
    promedioOperaciones: number;
    promedioPropiedades: number;
  };
  semanaAnterior: {
    totalRegistros: number;
    consultasRecibidas: number;
    muestrasRealizadas: number;
    operacionesCerradas: number;
    propiedadesTokko: number;
  };
  cambios: {
    consultas: CambioMetrica;
    muestras: CambioMetrica;
    operaciones: CambioMetrica;
    propiedades: CambioMetrica;
  };
}

export interface WeeklyAgentsStats {
  semana: SemanaInfo;
  agentes: AgenteSemanal[];
  totalAgentes: number;
}

export interface EquipoSemanal {
  totalAgentes: number;
  totalRegistros: number;
  consultasRecibidas: number;
  muestrasRealizadas: number;
  operacionesCerradas: number;
  propiedadesTokko: number;
  promedioPorAgente: {
    consultas: number;
    muestras: number;
    operaciones: number;
    propiedades: number;
  };
}

export interface TasasConversion {
  consultasToMuestras: number;
  muestrasToOperaciones: number;
  consultasToOperaciones: number;
}

export interface RankingAgente {
  agente: {
    name: string;
    email: string;
  };
  consultas: number;
  muestras: number;
  operaciones: number;
  propiedades: number;
  registros: number;
}

export interface WeeklyTeamStats {
  semana: SemanaInfo;
  equipo: EquipoSemanal;
  tasasConversion: TasasConversion;
  cambios: CambiosSemanal;
  ranking: RankingAgente[];
  semanaAnterior: SemanaAnterior;
}

export interface WeeklyExportData {
  success: boolean;
  data: {
    metadata: {
      semana: SemanaInfo;
      generado: string;
      formato: string;
    };
    resumen: ResumenSemanal;
    agentes: AgenteSemanal[];
  };
  message: string;
  instructions: {
    frontend: string;
    campos: string[];
  };
}