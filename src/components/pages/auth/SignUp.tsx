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
import { useRegister } from "../../features/server/auth/api/auth/useRegister";
import { signUpSchema } from "../../features/server/auth/schemas/sign-up-schema";

function SignUp() {
	const { mutate, isPending } = useRegister();

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});
	const onSubmit = (values: z.infer<typeof signUpSchema>) => {
		mutate({ json: values });
	};
	return (
		<main>
			<section className="min-h-[90vh] grid place-items-center">
				<Card className="w-[390px] px-3">
					<CardHeader>
						<CardTitle className="text-3xl">Sign Up</CardTitle>
						<CardDescription>
							By signing up, you agree to our{" "}
							<Link href={"/privacy"} className="hover:underline">
								<span className="text-blue-700">Privacy Policy</span>
							</Link>
							and{" "}
							<Link href={"/terms"} className="hover:underline">
								<span className="text-blue-700">Terms of Service</span>
							</Link>
						</CardDescription>
					</CardHeader>
					<Separator />
					<CardContent className="flex flex-col gap-3">
						<Form {...form}>
							<form
								action="submit"
								onSubmit={form.handleSubmit(onSubmit)}
								className="flex flex-col gap-4"
							>
								<FormField
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="text"
													placeholder="Enter username"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									name="email"
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
								<Button
									className="w-full mt-2 hover:cursor-pointer"
									disabled={isPending}
								>
									Sign up
								</Button>
							</form>
						</Form>
						<footer className="text-sm flex justify-center items-center">
							<span>
								Already signed up?{" "}
								<Link
									href={"/sign-in"}
									className="text-blue-700 hover:underline"
								>
									Login
								</Link>
							</span>
						</footer>
					</CardContent>
					<Separator />
					<CardFooter className="flex flex-col gap-2 max-w-[250px] mx-auto">
						<Button
							disabled={isPending}
							variant="secondary"
							className="w-full border-slate-300 border-[1px] hover:cursor-pointer"
							size="lg"
						>
							<FcGoogle />
							Sign up with Google
						</Button>
						<Button
							disabled={isPending}
							variant="secondary"
							className="w-full border-slate-300 border-[1px] hover:cursor-pointer"
							size="lg"
						>
							<FaGithub />
							Sign up with Github
						</Button>
					</CardFooter>
				</Card>
			</section>
		</main>
	);
}

export default SignUp;
