import { ofetch, type FetchContext } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

const publicPaths = ["/", "/about", "/about-us", "/login", "/register", "/contact"];

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",

  async onResponseError(context: FetchContext): Promise<void> {
    const { request, response, options } = context;

    const requestUrl =
      typeof request === "string" ? request : (request as any)?.url || "";

    if (
      response?.status === 401 &&
      !requestUrl.includes("/auth/refresh-token") &&
      !requestUrl.includes("/auth/login")
    ) {
      if (requestUrl.includes("/user/me")) {
        return;
      }

      if ((options as any)?._retry) {
        return;
      }

      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = ofetch(`${BASE_URL}/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
        })
          .catch((err) => {
            if (typeof window !== "undefined") {
              const pathname = window.location.pathname;
              if (!publicPaths.includes(pathname)) {
                window.location.href = "/login";
              }
            }
            throw err;
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      try {
        await refreshPromise;

        const retryResponse = await ofetch.raw(request, {
          ...options,
          credentials: "include",
          baseURL: BASE_URL,
          _retry: true,
        } as any);

        context.response = retryResponse;
      } catch {
      }
    }
  },
});

export default apiClient;