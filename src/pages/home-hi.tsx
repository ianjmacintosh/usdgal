import { I18nWrapper } from '@/components/i18n-wrapper/i18n-wrapper.tsx';
import { createIntl } from "react-intl";
import { defaultLinks } from "./home-defaults.ts";
import hi from "../languages/hi.ts";

const language = "hi";

const intl = createIntl({
  locale: language,
  messages: hi,
});

export const links = () => {
  return [...defaultLinks(), { rel: "canonical", href: "https://gasco.st/hi" }];
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
