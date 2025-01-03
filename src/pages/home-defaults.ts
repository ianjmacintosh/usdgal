// React Router uses various objects (meta, links, scripts, etc.) to build pages
// This file defines the defaults for those objects

export const links = () => {
  return [
    { rel: "alternate", hrefLang: "en", href: "https://gasco.st/" },
    { rel: "alternate", hrefLang: "de", href: "https://gasco.st/de" },
    { rel: "alternate", hrefLang: "pt", href: "https://gasco.st/pt" },
    { rel: "alternate", hrefLang: "es", href: "https://gasco.st/es" },
    { rel: "alternate", hrefLang: "hi", href: "https://gasco.st/hi" },
    { rel: "alternate", hrefLang: "x-default", href: "https://gasco.st/" },
  ];
};
