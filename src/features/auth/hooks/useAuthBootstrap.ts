import { useEffect } from "react";
import { useAppDispatch } from "@app/hooks/app.hooks";
import { setAuth, bootstrapComplete } from "@features/auth/redux/slices/auth.slice";
import { authApi } from "@features/auth/services/auth.api.service";

export function useAuthBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      dispatch(bootstrapComplete());
      return;
    }

    authApi
      .getProfile()
      .then((response) => {
        if (response.data) {
          dispatch(
            setAuth({
              user: response.data,
              accessToken: token,
              accessTokenExpiresAtUtc: localStorage.getItem("access_token_expires") ?? ""
            })
          );
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("access_token_expires");
          dispatch(bootstrapComplete());
        }
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("access_token_expires");
        dispatch(bootstrapComplete());
      });
  }, [dispatch]);
}
