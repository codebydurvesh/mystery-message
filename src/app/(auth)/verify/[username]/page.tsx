"use client";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  // zod implementation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });
      toast.success("Account verified successfully");
      router.replace("/signin");
    } catch (error) {
      console.error("Verification error:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message || "Error during verification";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          {/* shadcn form */}
          <Form {...form}>
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-4xl font-bold mb-4 font-geist-mono">
                    Verify Your Account
                  </FormLabel>
                  <FormLabel className="text-sm text-gray-500 mb-2">
                    Enter the verification code sent to your email
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter verification code" {...field} />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-5"
              onClick={form.handleSubmit(onSubmit)}
            >
              Verify Account
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
