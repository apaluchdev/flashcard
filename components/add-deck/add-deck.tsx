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
import topicClient from "@/clients/topic-client";
import { Roboto } from "next/font/google";
import { PackagePlus } from "lucide-react";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
});

export default function AddDeck() {
  const router = useRouter();
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
        const topic: ITopic = {
          topicTitle: values.topicTitle,
          userId: "Adrian",
        };

        let savedTopic = await topicClient.UpsertTopic(topic);

        if (!savedTopic) throw new Error("Error occurred adding topic");
        else
          router.push(
            `/flashcard/${savedTopic.userId}/${savedTopic.topicTitle}`,
          );
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
        <Button className="w-15" variant="outline">
          <PackagePlus />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <AddDeckForm />
      </PopoverContent>
    </Popover>
  );
}
