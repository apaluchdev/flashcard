"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ITopic } from "@/models/Topic";
import { Roboto } from "next/font/google";
import { PackagePlus } from "lucide-react";
import { useSession } from "next-auth/react";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
});

export default function AddDeck() {
  const router = useRouter();
  const { data: session } = useSession();
  const formSchema = z.object({
    topicTitle: z.string().min(2).max(80),
  });

  function AddDeckForm() {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        topicTitle: "",
      },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        const topic = {
          topicTitle: values.topicTitle,
          userId: "",
        };
        //   // Fix for middleware not redirecting - TODO, DEBUG THAT
        //   // if (!session?.user.username) {
        //   //   router.push(`/username`);
        //   // }
        const response = await fetch(`/api/topic`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(topic),
        });
        const insertedTopic: ITopic = (await response.json()).topic;
        if (!insertedTopic) throw new Error("Error occurred adding topic");
        else router.push(`/flashcard/${insertedTopic._id}`);
      } catch {
        toast({
          variant: "destructive",
          description: "An error occurred.",
        });
      }
    }

    return (
      <Form {...form}>
        <form
          className={`${roboto.className} space-y-8`}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="topicTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deck Title</FormLabel>
                <FormControl>
                  <Input placeholder="Macroeconomics Exam" {...field} />
                </FormControl>
                <FormDescription>
                  This is the topic title of your deck.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button disabled={!Boolean(session?.user)} variant="outline">
          <PackagePlus />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <AddDeckForm />
      </PopoverContent>
    </Popover>
  );
}
