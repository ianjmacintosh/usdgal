import { I18nWrapper } from "@/I18nWrapper";
import { createIntl } from "react-intl";
import { links as defaultLinks } from "./home-defaults.ts";
import en from "../languages/en.ts";

const language = "en";

const intl = createIntl({
  locale: language,
  messages: en,
});

export const links = () => {
  return [...defaultLinks(), { rel: "canonical", href: "https://gasco.st/" }];
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
