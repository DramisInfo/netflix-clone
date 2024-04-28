import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";

import prismadb from "@/lib/prismadb";

export default NextAuth({
	providers: [
		Credentials({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "text",
				},
				password: {
					label: "Password",
					type: "password",
				},
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Missing credentials");
				}

				const user = await prismadb.user.findUnique({
					where: { email: credentials.email },
				});

				if (!user || !user.hashPassword) {
					throw new Error("Invalid credentials");
				}
			},
		}),
	],
});
