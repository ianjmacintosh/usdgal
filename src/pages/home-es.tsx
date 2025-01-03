import { I18nWrapper } from "@/I18nWrapper";
import { createIntl } from "react-intl";
import { links as defaultLinks } from "./home-defaults.ts";
import es from "../languages/es.ts";

const language = "es";

const intl = createIntl({
  locale: language,
  messages: es,
});

export const links = () => {
  return [...defaultLinks(), { rel: "canonical", href: "https://gasco.st/es" }];
};

export function meta() {
  return [
    { title: intl.formatMessage({ id: "meta_title" }) },
    {
      property: "og:title",
      content: intl.formatMessage({ id: "meta_title" }),
    },
    {
      name: "description",
      content: intl.formatMessage({ id: "meta_description" }),
    },
  ];
}

export default function Component() {
  return <I18nWrapper language={language} />;
}
