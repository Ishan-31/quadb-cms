import React from "react";
import Login from "../components/Login";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

function LoginPage() {
  const { authenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (authenticated) {
      router.push('/');
    }
  }, [authenticated]);

  return <Login />;
}

export default LoginPage;
