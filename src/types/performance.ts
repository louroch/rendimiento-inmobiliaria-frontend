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
