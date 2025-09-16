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