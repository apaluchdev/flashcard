"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Roboto } from "next/font/google";
import { toast } from "../ui/use-toast";
import { IUser } from "@/models/User";
//import { useSession } from "next-auth/react";
import userClient from "@/clients/user-client";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
});

export default function UpdateUsername() {
  //const { data: session } = useSession();
  const router = useRouter();
  const formSchema = z.object({
    username: z.string().min(2).max(80),
  });

  function UpdateUsernameForm() {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: "",
      },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        const user = {
          username: values.username,
          email: "", // Retrieved from token on server side
        };

        let savedUser = await userClient.UpsertUser(user as IUser);

        if (!savedUser) throw new Error("Error occurred adding user");

        toast({
          variant: "success",
          description: "Username successfully updated.",
        });
        router.push(`/topics`);
      } catch {
        toast({
          variant: "destructive",
          description: "An error occurred.",
        });
      }
    }

    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-10">
        <h1 className="text-red-600">
          You must set a username for your account.
        </h1>
        <Form {...form}>
          <form
            className={`${roboto.className} w-2/6 space-y-8`}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Set Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    );
  }

  return <UpdateUsernameForm />;
}
