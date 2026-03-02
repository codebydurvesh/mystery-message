"use client";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useParams } from "next/navigation";
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
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const page = () => {
  const params = useParams<{ username: string }>();
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestCooldown, setSuggestCooldown] = useState(0);

  // zod implementation
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    if (!params.username) {
      toast.error("Invalid profile link");
      return;
    }

    try {
      const response = await axios.post("/api/send-message", {
        username: params.username,
        content: data.content,
      });
      console.log("Message sent response:", response.data);
      toast.success(response.data.message || "Message sent successfully");
      form.reset({ content: "" });
    } catch (error) {
      console.error("Sending message error:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message || "Error during sending message";
      toast.error(errorMessage);
    }
  };

  const fetchSuggestedMessages = async () => {
    if (suggestCooldown > 0) {
      toast.error(`Please wait ${suggestCooldown}s before requesting again`);
      return;
    }

    setIsSuggesting(true);
    try {
      const response = await axios.get<ApiResponse>("/api/suggest-messages");
      setSuggestedMessages(response.data.questions ?? []);
      if ((response.data.questions ?? []).length === 0) {
        toast.error("No suggestions available right now");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch suggestions",
      );
    } finally {
      setIsSuggesting(false);
      setSuggestCooldown(3);
    }
  };

  useEffect(() => {
    if (suggestCooldown <= 0) return;

    const interval = setInterval(() => {
      setSuggestCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [suggestCooldown]);

  const useSuggestion = (message: string) => {
    form.setValue("content", message, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <>
      <div className="mx-auto my-10 w-full max-w-4xl rounded-xl border border-border/60 bg-card/70 p-6 shadow-sm md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 block text-3xl font-bold tracking-tight font-geist-mono md:text-4xl">
                    Send an Anonymous Message to {params.username}
                  </FormLabel>
                  <FormLabel className="mb-3 block text-sm text-muted-foreground">
                    Enter the message you want to send below
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter message content"
                      {...field}
                      className="w-full max-w-2xl"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <div className="max-w-2xl text-right text-xs text-muted-foreground">
                    {field.value.length}/300
                  </div>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-1"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <div className="mx-auto my-10 w-full max-w-4xl rounded-xl border border-border/60 bg-card/70 p-6 shadow-sm md:p-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl mb-2 text-bold font-semibold tracking-tight">
              Suggested Messages
            </h2>
            <p className="text-sm text-muted-foreground">
              Generate ideas and click any suggestion to use it.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={fetchSuggestedMessages}
            disabled={isSuggesting || suggestCooldown > 0}
          >
            {isSuggesting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Fetching...
              </>
            ) : suggestCooldown > 0 ? (
              `Wait ${suggestCooldown}s`
            ) : (
              "Get Suggestions"
            )}
          </Button>
        </div>

        {suggestedMessages.length > 0 ? (
          <div className="flex flex-col gap-3">
            {suggestedMessages.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => useSuggestion(suggestion)}
                className="w-full  cursor-pointer rounded-lg border border-border bg-background p-3 text-center font-bold text-md text-foreground transition-colors hover:bg-accent"
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
            No suggestions yet. Click "Get Suggestions" to load message ideas.
          </p>
        )}
      </div>
    </>
  );
};

export default page;
