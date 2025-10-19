import { Link } from "react-router-dom";
import signupImage from "../../assets/signup-image.jpg"; // sesuaikan path
import SignUpForm from "@/components/auth/SignupForm";

export default function SignUp() {
  return (
    <main className="relative flex h-screen items-center justify-center p-5 overflow-hidden bg-background">
      {/* Background Glow Effects - Same as Footer */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-2/10 opacity-50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 bg-card flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl shadow-2xl border border-border/50">
        
        {/* Left Content */}
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold text-foreground">Sign Up to MovieApp</h1>
            <p className="text-muted-foreground">
              Join us to discover and manage your favorite movies.
            </p>
          </div>

          <div className="space-y-5">
            <SignUpForm />
            <Link to="/login" className="block text-center text-muted-foreground hover:text-primary transition-colors">
              Already have an account? Log in
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="hidden w-1/2 md:block">
          <img
            src={signupImage}
            alt="Sign Up"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </main>
  );
}
