import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthenticationContext";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setIsAuth } = useContext(AuthContext);

  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user.user);
      toast.success("Đăng nhập thành công");
      setIsAuth(true);
      navigate("/dashboard", { replace: true });
    },
    onError: (err) => {
      console.log("ERROR", err);
      toast.error("Email hoặc mật khẩu không chính xác");
    },
  });

  return { login, isLoading };
}
