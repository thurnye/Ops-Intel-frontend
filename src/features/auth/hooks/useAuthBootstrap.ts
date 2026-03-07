import { useEffect } from "react";
import { useAppDispatch } from "@app/hooks/app.hooks";
import { bootstrapComplete, setSession } from "@features/auth/redux/slices/auth.slice";
import { mockSession } from "@features/auth/mock/auth.mock";

export function useAuthBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      dispatch(setSession({ ...mockSession, token }));
      return;
    }

    dispatch(bootstrapComplete());
  }, [dispatch]);
}
