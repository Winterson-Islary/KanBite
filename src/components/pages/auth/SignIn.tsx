"use client";
import { z } from "zod";

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
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

/* Zod Schema for sign-in input form */
const signInSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(256),
});
/*END*/

function SignIn() {
	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const onSubmit = (values: z.infer<typeof signInSchema>) => {
		console.log({ values });
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
					<CardContent className="">
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
