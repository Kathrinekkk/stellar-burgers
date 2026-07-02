// Говорим TypeScript, что обычные .css файлы можно импортировать
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Говорим TypeScript, что .module.css возвращают объект с классами
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
