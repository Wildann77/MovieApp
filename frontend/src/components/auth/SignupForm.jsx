import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { registerUser } from "@/lib/service";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isValidEmail, isValidPassword, isValidUsername } from "@/lib/validators";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created successfully! Please log in.");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      console.error("Signup error:", error);
      // The axios interceptor customizes the error object
      const errorMessage = error?.message || error?.response?.data?.message || "Something went wrong. Please try again.";
      
      setErrorMessage(errorMessage);
      toast.error(errorMessage);
    },
  });

  const onSubmit = (values) => {
    if (isPending) return;
    
    // Clear any previous error messages
    setErrorMessage("");
    
    // Validate form data
    if (!values.username || !values.email || !values.password) {
      const errorMsg = "Please fill in all required fields.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    if (!isValidUsername(values.username)) {
      const errorMsg = "Username must be 3-20 characters long and contain only letters, numbers, and underscores.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    if (!isValidEmail(values.email)) {
      const errorMsg = "Please enter a valid email address.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    if (!isValidPassword(values.password)) {
      const errorMsg = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {errorMessage && (
          <p className="text-destructive text-center">{errorMessage}</p>
        )}

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}
