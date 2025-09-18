/**
 * Utilidades para manejo de agentes con diferentes tipos de trabajo
 */

/**
 * Lista de agentes que no realizan muestras
 * Estos agentes se evalúan por consultas y captaciones únicamente
 */
const AGENTS_WITHOUT_SAMPLES = [
  'agente3@inmobiliaria.com',
  'agente4@inmobiliaria.com'
];

/**
 * Verifica si un agente no realiza muestras
 * @param email - Email del agente
 * @returns true si el agente no realiza muestras
 */
export const isAgentWithoutSamples = (email: string): boolean => {
  return AGENTS_WITHOUT_SAMPLES.includes(email);
};

/**
 * Obtiene el mensaje informativo para agentes sin muestras
 * @returns Mensaje explicativo
 */
export const getAgentWithoutSamplesMessage = (): string => {
  return 'Este agente no realiza muestras - se evaluará por consultas y captaciones';
};

/**
 * Obtiene el placeholder para el campo de muestras
 * @param email - Email del agente
 * @returns Placeholder apropiado
 */
export const getMuestrasPlaceholder = (email: string): string => {
  return isAgentWithoutSamples(email) ? 'No aplica' : 'Ingrese cantidad';
};
