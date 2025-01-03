import { I18nWrapper } from "@/I18nWrapper";
import { createIntl } from "react-intl";
export { links } from "./home-defaults.ts";
import es from "../languages/es.ts";

const language = "es";

const intl = createIntl({
  locale: language,
  messages: es,
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
