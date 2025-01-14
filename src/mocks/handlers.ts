import { http, HttpResponse } from "msw";

export const getGeolocationHandlers = (country: string) => {
  return [
    http.get("https://gasco.st/workers/getLocation", () => {
      return HttpResponse.json({ ipData: { country } });
    }),

    http.get("http://localhost:5173/workers/getLocation", () => {
      return HttpResponse.json({ ipData: { country: country } });
    }),
  ];
};

export const handlers = [...getGeolocationHandlers("FR")];
