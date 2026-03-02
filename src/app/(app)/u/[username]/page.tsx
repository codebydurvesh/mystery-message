"use client";
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
import { messageSchema } from "@/schemas/messageSchema";

const page = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();


  // zod implementation
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post("/api/send-message", {
        username: params.username,
        content: data.content,
      });
      console.log("Message sent response:", response.data);
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Sending message error:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message || "Error during sending message";
      toast.error(errorMessage);
    }
  };
  return (
    <div className="m-10">
      <Form {...form}>
        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-4xl font-bold mb-4 font-geist-mono">
                Send an Anonymous Message to {params.username}
              </FormLabel>
              <FormLabel className="text-sm text-gray-500 mb-2">
                Enter the message you want to send below
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter message content"
                  {...field}
                  className="w-full max-w-2xl"
                />
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
          Send Message
        </Button>
      </Form>
    </div>
  );
};

export default page;
