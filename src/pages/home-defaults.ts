// React Router uses various objects (meta, links, scripts, etc.) to build pages
// This file defines the defaults for those objects

export const links = () => {
  return [
    { rel: "alternate", hrefLang: "en", href: "/" },
    { rel: "alternate", hrefLang: "de", href: "/de" },
    { rel: "alternate", hrefLang: "pt", href: "/pt" },
    { rel: "alternate", hrefLang: "es", href: "/es" },
    { rel: "alternate", hrefLang: "hi", href: "/hi" },
    { rel: "alternate", hrefLang: "x-default", href: "/" },
  ];
};
