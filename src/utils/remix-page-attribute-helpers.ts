import { MetaDescriptor } from "react-router";

// React Router uses various objects (meta, links, scripts, etc.) to build pages
// This file defines the defaults for those objects, which are used in `home-*.tsx`

import { getMessage } from "@/context/i18n";

export const defaultLinks = () => {
  // This implements the advice of:
  // * Each page lists every alternate language version of the page
  // * Each page is self-canonicalized
  // * Each page uses absolute URLs
  // (Source: [Portent blog](https://portent.com/blog/seo/implement-hreflang-canonical-tags-correctly.htm))
  return [
    { rel: "alternate", hrefLang: "en", href: "https://gasco.st/" },
    { rel: "alternate", hrefLang: "de", href: "https://gasco.st/de/" },
    { rel: "alternate", hrefLang: "pt", href: "https://gasco.st/pt/" },
    { rel: "alternate", hrefLang: "es", href: "https://gasco.st/es/" },
    { rel: "alternate", hrefLang: "hi", href: "https://gasco.st/hi/" },
    { rel: "alternate", hrefLang: "x-default", href: "https://gasco.st/" },
  ];
};

export const getMetaTags = (language: string): MetaDescriptor[] => {
  return [
    {
      name: "description",
      content: getMessage({ id: "meta_description", language }),
    },
    { title: getMessage({ id: "meta_title", language }) },
    {
      property: "og:title",
      content: getMessage({ id: "meta_title", language }),
    },
    {
      property: "og:description",
      content: getMessage({ id: "meta_description", language }),
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:image:type",
      content: "image/png",
    },
    {
      property: "og:image:width",
      content: "1920",
    },
    {
      property: "og:image:height",
      content: "1080",
    },
    {
      property: "og:url",
      content: getMessage({ id: "meta_canonical_url", language }),
    },
    {
      property: "og:image",
      content: getMessage({ id: "meta_og_image_url", language }),
    },
    {
      property: "og:image:secure_url",
      content: getMessage({ id: "meta_og_image_url", language }),
    },
  ];
};
