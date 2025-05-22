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

function SignUp() {
	return (
		<main>
			<section className="min-h-[90vh] grid place-items-center">
				<Card className="w-[390px] px-3">
					<CardHeader>
						<CardTitle className="text-3xl">Sign Up</CardTitle>
						<CardDescription>
							By signing up, you agree to our{" "}
							<Link href={"/privacy"}>
								<span className="text-blue-700">Privacy Policy</span>
							</Link>
							and{" "}
							<Link href={"/terms"}>
								<span className="text-blue-700">Terms of Service</span>
							</Link>
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
						<Button className="w-full mt-2 hover:cursor-pointer">
							Sign up
						</Button>
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

export default SignUp;
