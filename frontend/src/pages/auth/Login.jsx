import loginImage from "@/assets/login-image.jpg";
import LoginForm from "@/components/auth/LoginForm";
import { Link } from "react-router-dom"; // pakai react-router-dom
// import GoogleSignInButton from "./google/GoogleSignInButton";

export default function LoginPage() {
  return (
    <main className="relative flex h-screen items-center justify-center p-5 overflow-hidden bg-background">
      {/* Background Glow Effects - Same as Footer */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-2/10 opacity-50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 bg-card flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl shadow-2xl border border-border/50">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <h1 className="text-center text-3xl font-bold text-foreground">Sign In to MovieApp</h1>
          <div className="space-y-5">
            {/* <GoogleSignInButton /> */}
            <div className="flex items-center gap-3">
              <div className="bg-muted h-px flex-1" />
              <span className="text-muted-foreground">OR</span>
              <div className="bg-muted h-px flex-1" />
            </div>
            <LoginForm />
            <Link to="/signup" className="block text-center text-muted-foreground hover:text-primary transition-colors">
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
        <img
          src={loginImage}
          alt="Login"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
