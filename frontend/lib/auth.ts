import { setCookie, destroyCookie, parseCookies } from "nookies";

export const setToken = (token: string) => {
  setCookie(null, "token", token, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/", // Accessible across all routes
  });
};

export const getToken = () => {
  const cookies = parseCookies();
  return cookies.token || null;
};

export const clearToken = () => {
  destroyCookie(null, "token", { path: "/" });
};

export const clearTokenAndRedirect = (onLoadingStart?: () => void) => {
  if (onLoadingStart) {
    onLoadingStart();
  }

  destroyCookie(null, "token", { path: "/" });
  
  setTimeout(() => {
    window.location.href = '/';
  }, 1000); 
};
