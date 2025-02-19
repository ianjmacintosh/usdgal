[![Coverage Status](https://coveralls.io/repos/github/ianjmacintosh/usdgal/badge.svg)](https://coveralls.io/github/ianjmacintosh/usdgal)

# Gas Co.st ([website](https://www.gasco.st/))

Instantly convert gasoline prices listed in foreign units and currencies

## Why

During a long road trip through the Americas, when I wanted to know what I was paying for gas (in USD per US gallon) I'd have to look up the conversion rate for liters per gallon, remember that number, then check the conversion rate from the local currency to USD, then enter it all into a calculator.

I made this app to give myself and other folks an easier alternative.

## How it works

I built this solution as a statically generated app using React and Vite.

The app guesses the user wants to...

- Convert a gas price expressed in units and currency common in their physical location, as determined by a Cloudflare Worker I built to provide IP-based geolocation
- See a gas price expressed in language, units, and currency most likely based on their browser settings

The user can update any of these assumptions using controls on the page, which I implemented using [Ariakit](https://www.ariakit.org/), an accessibility-first library of components built on Radix UI.

I scheduled a nightly GitHub Action to update the repo with the latest exchange rates from [Exchangerate API](https://exchangeratesapi.io/), and I configured Cloudflare Pages to automatically redeploy any repo updates to [https://gasco.st/](https://gasco.st/)

## Getting Started

### Use a Development Container

Open this project's `main` branch using your IDE's local development container extension, or with your favorite cloud development environment service like [GitHub Codespaces](https://docs.github.com/en/codespaces/overview), [Gitpod](https://gitpod.io/), or [CodeSandbox](https://codesandbox.io/).

Any of these services can use the `.devcontainer/devcontainer.json` file I've provided to build a shiny new development environment in minutes (if not seconds). Destroy it and start over from scratch whenever you feel like.

### Use Your Local System

You can also set up this project locally, installing its dependencies alongside your other apps.

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

> NOTE: If you need to test behavior specific to how Cloudflare Pages works, you need to use Wrangler, Cloudflare's CLI tool for developers:
>
> ```
> npm run dev:wrangler
> ```
>
> 🚨 Geolocation will not work! The app will try to access `https://gasco.st/workers/getLocation` and get blocked due to CORS

### Run the Tests

Unit and Integration Tests (uses [Vitest](https://vitest.dev/))

```bash
npm test
```

End-to-End ("E2E") Tests (uses [Playwright](https://playwright.dev/))

```bash
npm run e2e
```
