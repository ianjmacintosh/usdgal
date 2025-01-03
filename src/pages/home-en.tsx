import { I18nWrapper } from "@/I18nWrapper";
import { createIntl } from "react-intl";
import en from "../languages/en.ts";

const language = "en";

const intl = createIntl({
  locale: language,
  messages: en,
});

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
