"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        if (result.error.toLowerCase().includes("verify")) {
          toast.error(
            "Account not verified. Redirecting to verification page...",
          );
          router.replace(`/verify/${encodeURIComponent(data.identifier)}`);
          return;
        }

        if (result.error === "CredentialsSignin") {
          toast.error("Invalid email/username or password");
        } else {
          toast.error(result.error);
        }
        return;
      }

      if (result?.ok) {
        toast.success("Signed in successfully!");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        router.refresh();
        router.replace("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-md space-y-8 rounded-xl border border-border/60 bg-card/80 p-8 shadow-sm">
          <h1 className="mb-3 text-center text-5xl font-black font-geist-mono tracking-tight">
            Mystery Message
          </h1>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Sign in to continue your anonymous adventure!
          </p>
          <div>
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  name="identifier"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email or Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email or username"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </Form>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Don't have an Account?{" "}
            <Link href="/signup" className="text-foreground underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
