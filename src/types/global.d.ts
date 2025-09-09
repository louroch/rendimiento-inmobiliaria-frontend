// Declaraciones globales de tipos para evitar errores de TypeScript
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// Variables de entorno
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_URL?: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
