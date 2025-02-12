import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);

  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });

  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(e) {
    e.preventDefault();
    const data = await registerService(signUpFormData);

    // console.log(data);
  }
  async function handleLoginUser(e) {
    e.preventDefault();
    const data = await loginService(signInFormData);
    // console.log(data);

    if (data.success) {
      sessionStorage.setItem(
        "accessToken",
        JSON.stringify(data.data.accessToken)
      );

      setAuth({
        isAuthenticated: true,
        user: data.data.user,
      });
    } else {
      setAuth({
        isAuthenticated: false,
        user: null,
      });
    }
  }

  //check auth user on load
  async function checkAuthUser() {
    try {
      const data = await checkAuthService();

      if (data.success) {
        setAuth({
          isAuthenticated: true,
          user: data.data.user,
        });
        setLoading(false);
      } else {
        setAuth({
          isAuthenticated: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (!error.response?.data?.success) {
        setAuth({
          isAuthenticated: false,
          user: null,
        });
        setLoading(false);
      }
    }
  }

  function resetCredentials() {
    setAuth({
      isAuthenticated: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  // console.log(auth);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton className="h-screen" /> : children}
    </AuthContext.Provider>
  );
}
