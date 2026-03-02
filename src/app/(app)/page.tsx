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
    <>
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
      <div className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Conversations
          </h1>
          <p className="mt-3 md:mt-4 text-base">
            Explore Mystery Message - Where your identity remains a secret
          </p>
        </section>
        <Carousel
          className="w-full max-w-[12rem] sm:max-w-xs"
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
                  <Card>
                    <CardHeader>{message.title}</CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-lg">{message.content}</span>
                    </CardContent>
                    <CardFooter>
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
      <div className="flex justify-center mt-8 mb-15">
        <div className="flex justify-center button-bg w-full max-w-[13rem] rounded-full p-0.5 hover:scale-105 transition duration-300 active:scale-100">
          <Link href="/dashboard" className="flex justify-center px-6 w-full max-w-[13rem] text-bold text-2xl py-2.5 text-white rounded-full font-medium bg-gray-800">
            Get Started
          </Link>
        </div>
      </div>
      <footer className="text-center p-4 md:p-6">
        © 2026 Mystery Message. All rights reserved.
      </footer>
    </>
  );
}
