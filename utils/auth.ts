import { autumn } from "autumn-js/better-auth";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { phoneNumber } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";
import { MongoClient } from "mongodb";
import { authAdditionalFields } from "./constants";
import { sendPasswordResetEmail } from "./resend";

const client = new MongoClient(process.env.MONGODB_CONNECTION_URI!);
const db = client.db();

export const auth = betterAuth({
	database: mongodbAdapter(db, {}),
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url, token }, request) => {
			// await sendEmail({
			//   to: user.email,
			//   subject: "Reset your password",
			//   text: `Click the link to reset your password: ${url}`,
			// });
			sendPasswordResetEmail(user.email, url, "en", user.name);
		},
		onPasswordReset: async ({ user }, request) => {
			// your logic here
			console.log(`Password for user ${user.email} has been reset.`);
		},
	},
	plugins: [
		phoneNumber({
			sendOTP: async ({ phoneNumber, code }) => {
				// In production, integrate with SMS provider like Twilio
				console.log(`SMS to ${phoneNumber}: Your OTP is ${code}`);
			},
			signUpOnVerification: {
				getTempEmail: (phoneNumber) => {
					return `${phoneNumber}@my-site.com`;
				},
				//optionally, you can also pass `getTempName` function to generate a temporary name for the user
				getTempName: (phoneNumber) => {
					return phoneNumber; //by default, it will use the phone number as the name
				},
			},
		}),
		autumn({ secretKey: process.env.AUTUMN_SECRET_KEY, customerScope: "user" }),
		reactStartCookies(),
	],

	user: { additionalFields: authAdditionalFields },

	logger: {
		disabled: false,
		level: "info",
		log: (level, message, ...args) => {
			console.log(`[${level}]`, message, ...args);
		},
	},
	socialProviders: {
		google: {
			prompt: "select_account",
			clientId: process.env.VITE_GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
});
