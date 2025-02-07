"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string(),
  host: z.string(),
  port: z.number().optional().default(22),
});
interface ILoginProps {
  setSSHCradintials: (data: z.infer<typeof formSchema>) => void;
  errorMsg: string;
}
const Login = (props: ILoginProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      port: 22,
      host: "localhost",
      username: "myboot",
      password: "141541",
    },
  });

  function handleSubmit(data: z.infer<typeof formSchema>) {
    props.setSSHCradintials(data);
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-teal-600  ">
      <header className="md:flex justify-between bg-slate-800 p-0 md:p-2">
        <h1 className="text-xl md:text-4xl text-white">Linux WebGUI</h1>
      </header>
      <div className="w-full h-64  bg-slate-700 flex items-center flex-col justify-center ">
        <h1 className="text-xl md:tetxt-3xl text-yellow-50">
          Connect To your server
        </h1>
        <p className="text-red-500">{props.errorMsg}</p>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-96 w-full mx-auto space-y-1 border border-transparent focus-within::border-teal-800"
        >
          <Form {...form}>
            <div className="flex">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem className="space-y-0 w-full">
                    <FormLabel />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Host"
                        className="text-white bg-black border-transparent focus:border-blue-800 rounded-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem className="space-y-0 w-14">
                    <FormLabel />
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value));
                        }}
                        placeholder="Port"
                        className="text-white p-0 text-center bg-black border-transparent focus:border-blue-800 rounded-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-0 w-full">
                  <FormLabel />
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Username"
                      className="text-white bg-black border-transparent focus:border-blue-800 rounded-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-0 w-full">
                  <FormLabel />
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Password"
                      type="password"
                      className="text-white   bg-black border-transparent focus:border-blue-800 rounded-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-blue-900 w-full rounded-none">
              Connect
            </Button>
          </Form>
        </form>
      </div>
      <div className="container">
       <p className="text-4xl text-slate-50 text-center">Use the web application to manage linux server using graphical user interface.</p>
      </div>
    </div>
  );
};

export default Login;
