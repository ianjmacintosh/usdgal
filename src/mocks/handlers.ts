import { http, HttpResponse } from "msw";

export const getGeolocationHandlers = (country: string) => {
  return [
    http.get("https://gasco.st/workers/getLocation", () => {
      return HttpResponse.json({ ipData: { country } });
    }),
  ];
};

export const handlers = [...getGeolocationHandlers("FR")];
