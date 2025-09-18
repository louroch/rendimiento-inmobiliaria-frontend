/**
 * Utilidades para manejo de fechas en el frontend
 * Soluciona el problema de fechas que se muestran como día anterior
 */

/**
 * Convierte una fecha UTC a fecha local formateada
 * @param dateString - Fecha en formato ISO string
 * @param options - Opciones de formateo
 * @returns Fecha formateada en zona horaria local
 */
export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
  if (!dateString) return '';
  
  // Crear objeto Date desde la fecha UTC
  const date = new Date(dateString);
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    console.warn('Fecha inválida:', dateString);
    return '';
  }
  
  // Formatear con opciones por defecto
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return date.toLocaleDateString('es-ES', defaultOptions);
};

/**
 * Convierte una fecha UTC a fecha local formateada para gráficos
 * @param dateString - Fecha en formato ISO string
 * @returns Fecha formateada para gráficos (ej: "18 sep")
 */
export const formatDateForChart = (dateString: string): string => {
  return formatDate(dateString, { 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Convierte una fecha UTC a fecha local formateada para tablas
 * @param dateString - Fecha en formato ISO string
 * @returns Fecha formateada para tablas (ej: "18/09/2025")
 */
export const formatDateForTable = (dateString: string): string => {
  return formatDate(dateString, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Convierte una fecha UTC a fecha local formateada para exportación
 * @param dateString - Fecha en formato ISO string
 * @returns Fecha formateada para exportación (ej: "18/09/2025")
 */
export const formatDateForExport = (dateString: string): string => {
  return formatDate(dateString, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Prepara una fecha para envío al backend
 * Convierte una fecha local a mediodía UTC para evitar problemas de zona horaria
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @returns Fecha en formato ISO string con mediodía UTC
 */
export const prepareDateForBackend = (dateString: string): string => {
  if (!dateString) return '';
  
  // Agregar mediodía UTC para evitar problemas de zona horaria
  return new Date(dateString + 'T12:00:00.000Z').toISOString();
};

/**
 * Obtiene la fecha de hoy en formato YYYY-MM-DD
 * @returns Fecha de hoy en formato YYYY-MM-DD
 */
export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};
