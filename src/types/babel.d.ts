declare module '@babel/core' {
  export interface TransformOptions {
    [key: string]: any;
  }
  
  export function transform(code: string, options?: TransformOptions): any;
  export function transformSync(code: string, options?: TransformOptions): any;
  export function transformAsync(code: string, options?: TransformOptions): Promise<any>;
}

declare module 'babel__core' {
  export * from '@babel/core';
}
