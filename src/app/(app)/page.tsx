"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/data/messages";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <style>{`
                @keyframes shine {
                    0% {
                        background-position: 0% 50%;
                    }
            
                    50% {
                        background-position: 100% 50%;
                    }
            
                    100% {
                        background-position: 0% 50%;
                    }
                }
            
                .button-bg {
                    background: conic-gradient(from 0deg, #00F5FF, #000, #000, #00F5FF, #000, #000, #000, #00F5FF);
                    background-size: 300% 300%;
                    animation: shine 6s ease-out infinite;
                }
            `}</style>
      <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-background via-background to-muted/20 px-4 py-10 md:px-24">
        <div className="w-full max-w-5xl rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm md:p-10">
          <section className="mb-10 text-center md:mb-12">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              Dive into the World of Anonymous Feedbacks
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground md:mt-4">
              Explore Mystery Message - Where your identity remains a secret
            </p>
          </section>

          <div className="flex justify-center">
            <Carousel
              className="w-full max-w-[14rem] sm:max-w-xs lg:max-w-sm"
              plugins={[
                Autoplay({
                  delay: 2000,
                }),
              ]}
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="border-border/60 bg-card/80 py-4 shadow-sm">
                        <CardHeader className="pb-2 text-sm font-medium text-muted-foreground">
                          {message.title}
                        </CardHeader>
                        <CardContent className="flex min-h-40 items-center justify-center p-5 sm:min-h-44 lg:min-h-48">
                          <span className="text-center text-base leading-relaxed">
                            {message.content}
                          </span>
                        </CardContent>
                        <CardFooter className="text-xs text-muted-foreground">
                          <span>{message.received}</span>
                        </CardFooter>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex w-full max-w-[13rem] justify-center rounded-full p-0.5 transition duration-300 button-bg hover:scale-105 active:scale-100">
              <Link
                href="/dashboard"
                className="flex w-full max-w-[13rem] justify-center rounded-full bg-card px-6 py-2.5 text-2xl font-medium text-foreground"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="mt-auto border-t border-border/60 p-4 text-center text-sm text-muted-foreground md:p-6">
        © 2026 Mystery Message. All rights reserved.
      </footer>
    </div>
  );
}
