import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { I18nProvider } from "./context/i18n";

/*

(via https://reactrouter.com/upgrading/component-routes#5-shuffle-stuff-around):

In general:
* `root.tsx` contains any rendering things like context providers, 
  layouts, styles, etc.
* `entry.client.tsx` should be as minimal as possible
* Remember to not try to render your existing `<App/>` component yet, 
  we'll do that in a later step

Note that your `root.tsx` file will be statically generated and served 
as the entry point of your app, so just that module will need to be 
compatible with server rendering. This is where most of your trouble 
will come.

*/

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="root">
          <I18nProvider siteLanguage="en">{children}</I18nProvider>
        </div>
        <ScrollRestoration />
        <Scripts />
        {/* <!-- 100% privacy-first analytics --> */}
        <script
          data-collect-dnt="true"
          async
          src="https://scripts.simpleanalyticscdn.com/latest.js"
        ></script>
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
