import { ofetch, type FetchContext } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

const publicPaths = ["/", "/about", "/about-us", "/login", "/register", "/contact"];

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",

  onRequest({ options }) {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        options.headers = {
          ...(options.headers as any),
          Authorization: `Bearer ${token}`,
        };
      }
    }
  },

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
          .then((res: any) => {
            const newToken = res?.data?.accessToken;
            if (newToken && typeof window !== "undefined") {
              localStorage.setItem("accessToken", newToken);
            }
            return res;
          })
          .catch((err) => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("accessToken");
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

        const currentToken =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;
        const retryHeaders: Record<string, string> = {
          ...(options.headers as any),
        };
        if (currentToken) {
          retryHeaders.Authorization = `Bearer ${currentToken}`;
        }

        const retryResponse = await ofetch.raw(request, {
          ...options,
          headers: retryHeaders,
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
