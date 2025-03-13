import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { fetchGoogleUserInfo,authenticateWithGoogle } from "../api/authapi";

const GoogleSignIn = ({ isSignUp, userType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        if (!userType) {
          toast.error("Please select whether you are a Student or a Teacher.");
          return;
        }

        const userInfo = await fetchGoogleUserInfo(codeResponse.access_token);
        const authData = await authenticateWithGoogle(codeResponse.access_token, userType, isSignUp);

        if (authData.access && authData.refresh) {
          dispatch(
            loginSuccess({
              user: authData.user || { name: userInfo.name },
              authToken: authData.access,
              refreshToken: authData.refresh,
              email: userInfo.email || authData.user?.email || "",
              role: authData.user?.role || userType.toLowerCase(),
              is_active: authData.user?.is_active || true,
            })
          );

          toast.success("Google Login Successful!");
          navigate("/");
        }
      } catch (error) {
        toast.error(error.message || "Something went wrong!");
      }
    },
    onError: () => {
      toast.error("Google login failed!");
    },
    ux_mode: "redirect",
    responseType: "code",
  });

  return (
    <button
      onClick={login}
      className="flex items-center justify-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md mt-3 w-full text-sm"
    >
      <span className="text-gray-600">G+</span>{" "}
      {isSignUp ? "Sign up with Google" : "Sign in with Google"}
    </button>
  );
};

export default GoogleSignIn;
