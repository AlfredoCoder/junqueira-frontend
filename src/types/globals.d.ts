// CSS Module declarations
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.module.sass' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.module.less' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.module.styl' {
  const classes: Record<string, string>;
  export default classes;
}

// Global CSS declarations (for side-effect imports)
declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';
declare module '*.styl';