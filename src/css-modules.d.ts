// for CSS Modules
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// for global side-effect imports like import '../../styles/global.css'
declare module '*.css' {
  const content: any;
  export default content;
}