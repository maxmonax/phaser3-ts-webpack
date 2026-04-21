declare const __DEV__: boolean;

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
