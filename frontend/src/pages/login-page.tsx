import { LoginForm } from "@/components/login-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = async (credentials: {
    username: string;
    password: string;
  }) => {
    await axios
      .post(`${import.meta.env.VITE_API_PATH || ""}/api/v1/auth/login`, credentials)
      .then((response) => {
        localStorage.setItem("Authorization", `Bearer ${response.data}`);
        navigate("/");
      })
      .catch(() => {
        console.error("an error uccured during login");
      });
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            Cinetra
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm handleSubmit={handleSubmit} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/images/login-placeholder.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
