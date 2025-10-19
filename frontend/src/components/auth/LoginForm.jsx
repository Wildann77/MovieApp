import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

import { loginUser } from "@/lib/service";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useStore } from "@/store/store";
import { isValidEmail } from "@/lib/validators";


export default function LoginForm() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const queryClient = useQueryClient();

  const setAuth = useStore.use.setAuth();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  // React Query mutation
  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      try {
        // The axios interceptor already extracts the data field
        // So response is the user object directly: { _id, username, email, profilePic, token }
        const { token, ...user } = response;
        const accessToken = token;

        setAuth(accessToken, user);

        // Invalidate and refetch auth user query to update navbar immediately
        queryClient.invalidateQueries({ queryKey: ["authUser"] });

        // Show success message
        toast.success("Login successful! Welcome back.");

        // Navigate to home page
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Error processing login response:", error);
        toast.error("Login successful but there was an error processing your session. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      // The axios interceptor customizes the error object
      const errorMessage = error?.message || error?.response?.data?.message || "Login failed. Please check your credentials.";
      
      setErrorMessage(errorMessage);
      toast.error(errorMessage);
    },
  });

  const onSubmit = (values) => {
    if (isPending) return;
    
    // Clear any previous error messages
    setErrorMessage("");
    
    // Validate form data
    if (!values.email || !values.password) {
      const errorMsg = "Please fill in all required fields.";
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
          {isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}
