import { I18nWrapper } from "@/I18nWrapper";
import { createIntl } from "react-intl";
import { links as defaultLinks } from "./home-defaults.ts";
import pt from "../languages/pt.ts";

const language = "pt";

const intl = createIntl({
  locale: language,
  messages: pt,
});

export const links = () => {
  return [...defaultLinks(), { rel: "canonical", href: "https://gasco.st/pt" }];
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
