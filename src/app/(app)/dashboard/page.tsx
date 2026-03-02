"use client";

import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import MessageCard from "@/components/MessageCard";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SWITCH_COOLDOWN_MS = 10000;

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownCountdownRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id.toString() !== messageId),
    );
  };

  const { data: session, status, update } = useSession();
  console.log("API Session: ", session);

  useEffect(() => {
    if (session?.user) return;

    const retryInterval = setInterval(() => {
      void update();
    }, 1500);

    return () => clearInterval(retryInterval);
  }, [session?.user, update]);

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse, any>(
        "/api/accept-messages",
        {
          withCredentials: true,
        },
      );
      setValue(
        "acceptMessages",
        Boolean(response.data.isAcceptingMessage ?? false),
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response) {
        toast.error(
          axiosError.response.data.message || "Failed to fetch accept messages",
        );
      }
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse, any>("/api/get-messages");
        setMessages(response.data.messages || []);
        console.log("Fetched Messages: ", response.data.messages); //console log, REMOVE LATER
        if (refresh) {
          toast.success("Showing latest Messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response) {
          toast.error(
            axiosError.response.data.message || "Failed to fetch messages",
          );
        }
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages],
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  //handle switch change
  const handleSwitchChange = async () => {
    if (cooldownActive) {
      toast.error("Please wait before toggling again");
      return;
    }

    setConfirmOpen(true);
  };

  const handleConfirmSwitch = async () => {
    setConfirmOpen(false);
    try {
      const response = await axios.post<ApiResponse>(
        "/api/accept-messages",
        {
          acceptMessages: !acceptMessages,
        },
        {
          withCredentials: true,
        },
      );
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message);

      // Activate cooldown with countdown
      setCooldownActive(true);
      setCooldownRemaining(SWITCH_COOLDOWN_MS / 1000);

      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (cooldownCountdownRef.current)
        clearInterval(cooldownCountdownRef.current);

      cooldownCountdownRef.current = setInterval(() => {
        setCooldownRemaining((prev) => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            if (cooldownCountdownRef.current)
              clearInterval(cooldownCountdownRef.current);
            if (cooldownTimerRef.current)
              clearTimeout(cooldownTimerRef.current);
            setCooldownActive(false);
            return 0;
          }
          return newValue;
        });
      }, 1000);

      cooldownTimerRef.current = setTimeout(() => {
        setCooldownActive(false);
        setCooldownRemaining(0);
        if (cooldownCountdownRef.current)
          clearInterval(cooldownCountdownRef.current);
      }, SWITCH_COOLDOWN_MS);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response) {
        toast.error(
          axiosError.response.data.message ||
            "Failed to update accept messages",
        );
      }
    }
  };

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (cooldownCountdownRef.current)
        clearInterval(cooldownCountdownRef.current);
    };
  }, []);

  //   console.log("Session: ", session?.user);
  //   const { username } = session?.user as User;
  // const username = session?.user?.username;
  // const baseUrl = `${window.location.protocol}//${window.location.host}`; //showing error

  // const profileUrl = username ? `${baseUrl}/u/${username}` : "";

  // const copyToClipboard = () => {
  //   navigator.clipboard.writeText(profileUrl);
  //   toast.success("Profile URL copied to clipboard");
  // };
  const username = session?.user?.username;
  const profilePath = username ? `/u/${username}` : "";

  const copyToClipboard = () => {
    if (!username) return;

    const fullUrl = `${window.location.origin}${profilePath}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Profile URL copied to clipboard");
  };

  if (!session || !session.user) {
    return (
      <div className="mt-40 flex items-center justify-center gap-2 text-center text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {status === "loading"
          ? "Loading your dashboard..."
          : "Looking for your account..."}
      </div>
    );
  }

  return (
    <>
      <div className="mx-4 my-8 w-full max-w-6xl rounded-xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur md:mx-8 lg:mx-auto">
        <h1 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
          User Dashboard
        </h1>
        <div className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">Copy Your Unique Link</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              value={
                username
                  ? `${typeof window !== "undefined" ? window.location.origin : ""}${profilePath}`
                  : ""
              }
              disabled
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            />
            <Button
              onClick={copyToClipboard}
              variant="default"
              className="cursor-pointer sm:w-auto"
            >
              Copy
            </Button>
          </div>
        </div>
        <div className="mb-5 flex items-center">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading || cooldownActive}
          />
          <span className="ml-2 text-sm text-muted-foreground">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
          {cooldownActive && (
            <span className="ml-3 text-xs font-semibold text-yellow-500">
              Cooldown: {cooldownRemaining}s
            </span>
          )}
        </div>
        <Separator />
        {/* <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
        }}
      ></Button> */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
              No messages to display.
            </p>
          )}
        </div>
      </div>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {acceptMessages
                ? "Turn off message acceptance?"
                : "Turn on message acceptance?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {acceptMessages
                ? "You will stop receiving new anonymous messages."
                : "You will start receiving anonymous messages from others."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSwitch}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default page;
