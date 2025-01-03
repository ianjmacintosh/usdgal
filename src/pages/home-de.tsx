import { I18nWrapper } from "@/I18nWrapper";
import { createIntl } from "react-intl";
import de from "../languages/de.ts";

const language = "de";

const intl = createIntl({
  locale: language,
  messages: de,
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
