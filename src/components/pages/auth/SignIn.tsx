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
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

function SignIn() {
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
					<CardContent className="flex flex-col gap-4">
						<Input
							required
							type="text"
							value={""}
							placeholder="Enter username"
							onChange={() => {}}
						/>
						<Input
							required
							type="email"
							value={""}
							placeholder="Enter email address"
							onChange={() => {}}
						/>
						<Input
							required
							type="password"
							value={""}
							placeholder="Enter password"
							onChange={() => {}}
							min={8}
							max={256}
						/>
						<Button className="w-full mt-2 hover:cursor-pointer">Login</Button>
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
