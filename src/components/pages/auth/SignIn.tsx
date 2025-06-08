"use client";
import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import type { z } from "zod";
import { useLogin } from "../../features/server/auth/api/auth/useLogin";
import { signInSchema } from "../../features/server/auth/schemas/sign-in-schema";

function SignIn() {
	const { mutate } = useLogin();

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const onSubmit = (values: z.infer<typeof signInSchema>) => {
		mutate({ json: values });
	};
	return (
		<main className="h-auto">
			<section className="grid place-items-center min-h-[90vh]">
				<Card className="w-[390px] px-3">
					<CardHeader>
						<CardTitle className="text-3xl font-medium">Welcome Back</CardTitle>
						<CardDescription>
							Sign in to access your dashboard and keep your work on track.
						</CardDescription>
					</CardHeader>
					<Separator />
					<CardContent className="flex flex-col gap-2">
						<Form {...form}>
							<form
								action="submit"
								onSubmit={form.handleSubmit(onSubmit)}
								className="flex flex-col gap-4"
							>
								<FormField
									name="email"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="email"
													placeholder="Enter email address"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									name="password"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="password"
													placeholder="Enter password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button className="w-full mt-2 hover:cursor-pointer">
									Login
								</Button>
							</form>
						</Form>
						<footer className="flex flex-col text-sm items-center">
							<span>Or</span>
							<Link href={"/sign-up"} className="text-blue-700 hover:underline">
								Sign up
							</Link>
						</footer>
					</CardContent>
					<Separator />
					<CardFooter className="flex flex-col gap-2 max-w-[250px] mx-auto">
						<Button
							disabled={false}
							variant="secondary"
							className="w-full border-slate-300 border-[1px] hover:cursor-pointer"
							size="lg"
						>
							<FcGoogle />
							Login with Google
						</Button>
						<Button
							disabled={false}
							variant="secondary"
							className="w-full border-slate-300 border-[1px] hover:cursor-pointer"
							size="lg"
						>
							<FaGithub />
							Login with Github
						</Button>
					</CardFooter>
				</Card>
			</section>
		</main>
	);
}

export default SignIn;
