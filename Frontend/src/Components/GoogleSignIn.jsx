import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";

const GoogleSignIn = ({ isSignUp }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        // Fetch user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { 'Authorization': `Bearer ${codeResponse.access_token}` },
        });

        const userInfo = await userInfoResponse.json();
        console.log("Google user info:", userInfo);

        // Send access token to backend
        const res = await fetch("http://127.0.0.1:8000/api/auth/social/google/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: codeResponse.access_token }),
          credentials: "include",  // Ensures backend sets cookies in response
        });

        if (res.ok) {
          const data = await res.json();
          console.log("API response:", data);

          // Check if the response contains the required tokens
          if (data.access && data.refresh) {
            dispatch(loginSuccess({
              user: data.user || { name: userInfo.name },
              authToken: data.access,
              refreshToken: data.refresh,
              email: userInfo.email || data.user?.email || "",
              role: data.user?.role || "student",
              is_block: data.user?.is_block || false,
            }));

            toast.success("Google Login Successful!");
            navigate("/");
          } else {
            throw new Error("Missing tokens in response.");
          }
        } else {
          const errorData = await res.json();
          toast.error(errorData?.message || "Google login failed!");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error(error?.message || "Something went wrong!");
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      toast.error("Google login failed!");
    },
    ux_mode: "redirect",  // Specify the UX mode (popup or redirect)
    signInFlow: "redirect",  // Sign-in flow type (popup or redirect)
  });

  return (
    <button
      onClick={login}
      className="flex items-center justify-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md mt-3 w-full text-sm"
    >
      <span className="text-gray-600">G+</span> {isSignUp ? "Sign up with Google" : "Sign in with Google"}
    </button>
  );
};

export default GoogleSignIn;
