declare module 'vite-plugin-compression' {
  interface CompressionOptions {
    algorithm?: 'gzip' | 'brotli' | 'deflate';
    ext?: string;
    threshold?: number;
    deleteOriginFile?: boolean;
    filter?: (file: string) => boolean;
  }

  function compression(options?: CompressionOptions): any;
  export default compression;
} 