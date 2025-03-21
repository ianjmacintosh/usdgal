import {
  defaultLinks,
  getMetaTags,
} from "../utils/remix-page-attribute-helpers.ts";
import { data } from "react-router";
import { getMessage } from "@/context/i18n.tsx";

const language = "en";

export const links = () => {
  return [
    ...defaultLinks(),
    {
      rel: "canonical",
      href: getMessage({ id: "meta_canonical_url", language }),
    },
  ];
};

export function meta() {
  // Create meta tags with no title
  const metaTags = getMetaTags(language).filter(
    (node) => !Object.keys(node).includes("title"),
  );

  // Add a title
  metaTags.push({ title: "404 Not Found" });

  return metaTags;
}

export async function loader() {
  return data({ message: "Not Found" }, { status: 404 });
}

export default function Component() {
  return <p>404 Not Found</p>;
}
