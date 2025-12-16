import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { authClient } from "@/utils/auth-client";
import "../components/i18n";
import { useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import Youtube from "react-youtube";
import { useShallow } from "zustand/react/shallow";
import {
	BuyerBenefitsSection,
	BuyerDemoSection,
	BuyerPricingSection,
} from "@/src/components/pages/landing/buyerComponents";
import { Header } from "@/src/components/pages/landing/headerLanding";
import { PropertyAddView } from "@/src/components/pages/propertyAddView";
import { TimelineLayout } from "@/src/components/ui/timeline-layout";
import { ElevenLabsChatBotDemo } from "@/src/components/userAndAi/aiChatbot";
import { useSize } from "@/utils/hooks/useSize";
import { usePropertyFilterStore } from "./__root";

export const Route = createFileRoute("/")({
	component: LandingPage,
	loader: async () => {
		return await getRootObjectsServerFn();
	},
});

export const getRootObjectsServerFn = createServerFn().handler(async ({ data: filters }) => {
	const response = await fetch(
		`https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${process.env.VITE_AGENT_ID}`,
		{ headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY } as any },
	);
	const body = await response.json();

	return { token: body.token as string };
});

function LandingPage() {
	const [selectedAction, setSelectedAction] = useState<"buy" | "sell">("buy");
	const navigate = useNavigate();
	const { data: session } = authClient.useSession();
	const queryClient = useQueryClient();

	const size = useSize(true);

	const { token } = Route.useLoaderData();

	useEffect(() => {
		if (session?.user) {
			navigate({ to: "/app" });
		}
	}, [session]);

	const blobs = Array.from({ length: 10 }, (_, i) => ({
		id: i,
		x: i % 2 === 0 ? 10 : 90, // alternates left (20%) and right (80%)
		y: (size.gmd ? 0 : 1000) + i * 600, // fixed spacing, 400px apart
	}));

	const { t } = useTranslation();

	return (
		<div className="bg-[#0B0014] text-white overflow-x-clip overflow-y-clip relative">
			{blobs.map((blob) => (
				<div
					key={blob.id}
					className="absolute w-[700px] h-[700px] rounded-full blur-[100px] pointer-events-none -z10"
					style={{
						left: `${blob.x}%`,
						top: `calc(${blob.y}px + ${"150dvh"})`,
						background: "radial-gradient(circle, rgba(138, 64, 182, 0.3) 0%, transparent 70%)",
						transform: "translate(-50%, -50%)",
					}}
				/>
			))}

			<Header hideOnScroll />
			<HeroSection
				selectedAction={selectedAction}
				setSelectedAction={(e) => {
					queryClient.invalidateQueries({ queryKey: ["auth.getToken"] });
					return setSelectedAction(e);
				}}
			/>

			{selectedAction === "buy" ? <BuyerDemoSection token={token} /> : <SellerDemoSection token={token} />}
			{selectedAction === "buy" ? <BuyerBenefitsSection /> : <SellerBenefitsSection />}
			{selectedAction === "buy" ? <BuyerPricingSection /> : <SellerPricingSection />}
			<SecuritySection />
			{/* <FAQSection /> */}
			{/* <FinalCTASection selectedAction={selectedAction} /> */}
			<Footer />
		</div>
	);
}

// Hero Section Component
const HeroSection = ({
	setSelectedAction,
	selectedAction,
}: {
	setSelectedAction: (str: "sell" | "buy") => void;
	selectedAction: string;
}) => {
	const { data } = authClient.useSession();
	const { t } = useTranslation();

	const { startConversation } = usePropertyFilterStore(
		useShallow((state) => ({
			startConversation: state.startConversation,
		})),
	);

	return (
		<section className="min-h-[95dvh] flex items-center justify-end relative md:overflow-hidden h-fit">
			<img
				src="/landing/chat.png"
				className="absolute hidden md:block z-40 top-0 bottom-0 my-auto left-10 w-[30vw] opacity-50"
			/>
			<img
				src="/landing/hero.png"
				className="absolute md:hidden brightness-75 right-0 top-0 md:left-[15%] md:w-[90%] bg-black/50 object-cover h-[70dvh] md:h-auto"
			/>
			<img
				src="/landing/heroDesktop.webp"
				className="absolute brightness-100 hidden md:block z-20 right-0 -top-10 md:left-[20%] md:w-[80%] object-cover h-[70dvh] md:h-auto "
			/>

			<div className="bg-gradient-to-r hidden md:block from-[#0B0014]/90 from-20% to-black/0 to-33% absolute z-30 inset-0"></div>
			<div className="bg-gradient-to-t from-[#0B0014] from-10% to-black/0 to-50% absolute z-30 inset-0"></div>

			<div className="md:w-[47vw] absolute bottom-30 w-[95%] left-0 md:left-auto right-0 md:mt-0 md:top-[28vw] md:right-[11vw] mx-auto">
				<div className="z-10 md:px-3 text-center md:hidden pr-2 md:pr-0 md:pl-5">
					<h1 className={`text-7xl font-extrabold text-cente text-white mb-4`}>{t("landing-page.hero.title.main")}</h1>
					<span className={`text-3xl text-center font-light text-white mb-4`}>
						{t("landing-page.hero.title.subtitle1")}
					</span>
					<span className="text-3xl md:text-[13rem]/15 font-semibold text-white mb-8 ml-2 md:ml-0">
						{t("landing-page.hero.title.subtitle2")}
					</span>
				</div>
				<div className="z-40 relative md:absolute md:px-3 w-full">
					<p className="md:text-sm text-center md:text-start font-light mt-6 md:mt-0 mb-6 md:mb-4 mx-auto w-full text-[#C4CDD5]">
						{t("landing-page.hero.description")}
					</p>

					<div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
						{/* Action Selector */}
						<div className="flex flex-col md:flex-row justify-center mb-6 mt-6">
							<div className="bg-white/10 backdrop-blur-sm rounded-full p-1 flex">
								<button
									onClick={() => setSelectedAction("buy")}
									className={`px-7 py-3 rounded-full text-sm font-medium transition-all ${
										selectedAction === "buy" ? "bg-white text-purple-900" : "text-white hover:bg-white/10"
									}`}
								>
									{t("landing-page.hero.actionSelector.buy")}
								</button>
								<button
									onClick={() => setSelectedAction("sell")}
									className={`px-7 py-3 rounded-full text-sm font-medium transition-all ${
										selectedAction === "sell" ? "bg-white text-purple-900" : "text-white hover:bg-white/10"
									}`}
								>
									{t("landing-page.hero.actionSelector.sell")}
								</button>
							</div>
						</div>

						<button
							onClick={() => {
								startConversation();
								return document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
							}}
							className="bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] text-white text-base rounded-[6px] flex flex-row items-center justify-center gap-2 hover:to-[#6A2BC4]/50 hover:from-[#4C7CED]/50 cursor-pointer px-10 py-3"
						>
							{t("landing-page.hero.startConversation")}
						</button>
					</div>

					{/* Micro Benefits */}
					{/* <div className="mb-8 space-y-2"> */}
					{/*     {(() => { */}
					{/*         const benefitsData = t('landing-page.hero.microBenefits', { returnObjects: true }); */}
					{/*         const benefits = Array.isArray(benefitsData) ? benefitsData as string[] : []; */}
					{/*         return benefits.map((benefit, index) => ( */}
					{/*             <div key={index} className="flex items-center justify-center text-sm text-white/80"> */}
					{/*                 <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div> */}
					{/*                 {benefit} */}
					{/*             </div> */}
					{/*         )); */}
					{/*     })()} */}
					{/* </div> */}

					{false && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 justify-center items-center">
							<Link
								to={data ? "/app" : "/auth/$path"}
								params={data ? {} : { path: "sign-in" }}
								reloadDocument
								className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 md:py-[9px] rounded-sm text-lg md:text-base hover:from-blue-600 hover:to-purple-700 transition-all transform shadow-2xl text-center"
							>
								{t("landing-page.hero.buttons.register")}
							</Link>
							<Link
								to={data ? "/app" : "/auth/$path"}
								reloadDocument
								params={data ? {} : { path: "sign-in" }}
								className="outline-1 outline-white text-white px-4 py-3 md:py-2 rounded-sm text-lg md:text-base hover:outline-slate-400 hover:bg-slate-800/50 transition-all text-center"
							>
								{t("landing-page.hero.buttons.login")}
							</Link>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

// Seller Benefits Section Component
const SellerBenefitsSection = () => {
	const { t } = useTranslation();
	const { data } = authClient.useSession();

	return (
		<section id="benefits" className="py-16 ">
			<div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
				{/* Problem Statement */}
				<div className="text-center mb-20">
					<h2 className="text-3xl font-semibold text-white mb-6">{t("landing-page.benefits.seller.title")}</h2>
					<p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">{t("landing-page.benefits.seller.subtitle")}</p>

					{/* Problem List */}
					<div className="bg-[#120826] rounded-lg p-8 mb-6 text-left max-w-4xl mx-auto">
						<ul className="space-y-3 text-[#919EAB]">
							{((t("landing-page.benefits.seller.problemList", { returnObjects: true }) as string[]) || []).map(
								(problem, index) => (
									<li key={index} className="flex items-start">
										<span className="text-red-400 mr-3 mt-1">•</span>
										{problem}
									</li>
								),
							)}
						</ul>
					</div>

					<p className="text-lg font-semibold text-blue-400">{t("landing-page.benefits.seller.conclusion")}</p>
				</div>

				{/* Solution */}

				<div className="grid lg:grid-cols-2 gap-12 items-stretch mx-4 text-center">
					{/* Left side - Blue card */}
					<div className="bg-gradient-to-br from-blue-500/50 to-purple-600/50 rounded-lg p-6 text-white">
						<h2 className="text-3xl text-white mb-3">{t("landing-page.benefits.seller.whyDoorsTitle")}</h2>
						<h3 className="text-lg text-white mb-6">{t("landing-page.benefits.seller.solutionTitle")}</h3>
						<p className="text text-slate-300 mb-6 mt-4 max-w-3xl mx-auto">
							{t("landing-page.benefits.seller.solutionDescription")}
						</p>
					</div>

					<div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg p-8 max-w-4xl mx-auto">
						<h3 className="text-2xl font-semibold text-white mb-6">
							{t("landing-page.benefits.buyer.realBenefits.title")}
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-1 gap-4 text-left">
							{((t("landing-page.benefits.seller.realBenefits.items", { returnObjects: true }) as string[]) || []).map(
								(benefit, index) => (
									<div key={index} className="flex items-start text-white">
										<CheckCircle className="text-green-400 mr-3 mt-1 w-5 h-5 flex-shrink-0" />
										{benefit}
									</div>
								),
							)}
						</div>
					</div>
				</div>
				<Link
					to={data ? "/app" : "/auth/$path"}
					params={data ? {} : { path: "sign-in" }}
					className="bg-gradient-to-r text-center mt-10 from-blue-500 to-purple-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform shadow-2xl"
				>
					{t("landing-page.finalCta.button")}
				</Link>
			</div>
		</section>
	);
};

// Seller Demo Section Component
const SellerDemoSection = ({ token }: { token: string }) => {
	const { t } = useTranslation();

	const { data } = authClient.useSession();

	const { demoPropertyFilters, setDemoPropertyFilters } = usePropertyFilterStore(
		useShallow((state) => ({
			demoPropertyFilters: state.demoPropertyFilters,
			setDemoPropertyFilters: state.setDemoPropertyFilters,
		})),
	);

	const [tab, setTab] = useState<"agent" | "results">("agent");

	return (
		<section className="md:py-10 ">
			<div className="max-w-7xl mx-auto px-2 w-full md:px-6 flex flex-col items-center">
				{/* Watch Tutorial Section */}
				<div className="mx-auto mb-4">
					<h2 className="text-3xl text-center font-medium mb-3">{t("landing-page.demo.watch.title")}</h2>
					<Youtube
						videoId={"f0Li9JZzhds"}
						id="video"
						className={"rounded-2xl border-2 w-[95vw] md:w-auto aspect-video"}
						iframeClassName="rounded-2xl w-[95vw] md:w-auto aspect-video"
						opts={{
							playerVars: {
								showinfo: 0,
								modestbranding: 1,
								rel: 0,
							},
						}}
					/>

					<p className="mx-auto w-fit mt-5 mb-3 text-xl">{t("landing-page.demo.or")}</p>
				</div>

				{/* Try Demo Section */}
				<h2 className="text-3xl text-center font-medium mb-3">{t("landing-page.demo.try.title")}</h2>
				<div
					id="demo"
					className="text-center bg-gradient-to-br from-green-500/20 to-blue-600/20 rounded-lg p-2 md:p-8 max-w-5xl w-full mx-auto"
				>
					<h3 className="text-xl font-semibold text-white mb-4">{t("landing-page.demo.seller.tryDemo.title")}</h3>
					<div className="flex md:hidden flex-row items-center w-fit mx-auto gap-6 rounded-lg p-2 bg-gradient-to-br from-green-500/20 to-blue-600/20 text-white">
						<button
							onClick={() => setTab("agent")}
							className={`${tab === "agent" ? "bg-white text-green-900" : "bg-gradient-to-br from-green-500/20 to-blue-600/20"} rounded-lg p-2 text-sm`}
						>
							{t("landing-page.demo.tabs.agent")}
						</button>
						<button
							onClick={() => setTab("results")}
							className={`${tab === "results" ? "bg-white text-green-900" : "bg-gradient-to-br from-green-500/20 to-blue-600/20"} rounded-lg p-2 text-sm`}
						>
							{t("landing-page.demo.tabs.result")}
						</button>
					</div>
					<div className="flex flex-row text-start gap-6 items-center h-[500px]">
						<div className={`${tab === "agent" ? "block" : "md:block hidden"} md:w-[30%] w-full h-full`}>
							<ElevenLabsChatBotDemo user={undefined} conversationToken={token} demoVersion userType="seller" />
						</div>
						<div
							className={`${tab === "results" ? "block" : "md:block hidden"} md:w-[70%] w-full max-h-full flex flex-col overflow-y-scroll`}
						>
							{/* {JSON.stringify(demoPropertyFilters)} */}
							<div className="max-h-full w-full h-full overflow-y-scroll overflow-x-clip relative">
								<PropertyAddView demoVersion />
							</div>
						</div>
					</div>
				</div>

				<Link
					to={data ? "/app" : "/auth/$path"}
					params={data ? {} : { path: "sign-in" }}
					className="inline-block bg-gradient-to-r mx-auto mt-5 text-center from-blue-500 to-purple-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl"
				>
					{t("landing-page.finalCta.sellerButton")}
				</Link>
			</div>
		</section>
	);
};

export const ComparisonTable = () => {
	const { t } = useTranslation();

	return (
		<div className="mb-12">
			<div className="grid grid-cols-7 max-w-5xl mx-auto">
				<div className=" md:p-6">
					<div className="h-[38px]"></div>
					{((t("landing-page.pricing.comparison.features", { returnObjects: true }) as string[]) || []).map(
						(feature, index) => (
							<div key={index} className="flex items-center justify-end h-7 md:h-12 text-[10px] md:text-base">
								{feature}
							</div>
						),
					)}
				</div>

				<div className="bg-white/5 rounded-l-2xl shadow-sm p-2 md:p-6 mx-1 md:mx-4 col-span-3">
					<h3 className="text-xs md:text-xl mb-1 md:mb-3">{t("landing-page.pricing.comparison.traditional.title")}</h3>
					{((t("landing-page.pricing.comparison.traditional.values", { returnObjects: true }) as string[]) || []).map(
						(feature, index) => (
							<div key={index} className="flex items-center justify-start h-7 md:h-12 text-[11px] md:text-base">
								<div className="w-1 h-1 md:w-2 md:h-2 bg-green-400 rounded-full mr-3"></div>
								{feature}
							</div>
						),
					)}
				</div>

				<div className="bg-gradient-to-br to-[#120826] from-[#26408F]/60 mr-1 md:mr-4 rounded-2xl shadow-sm p-2 md:p-6 -m-4 col-span-3">
					<h3 className="text-xs md:text-xl mb-3 md:mb-3">{t("landing-page.pricing.comparison.doors.title")}</h3>
					{((t("landing-page.pricing.comparison.doors.values", { returnObjects: true }) as string[]) || []).map(
						(feature, index) => (
							<div key={index} className="flex items-center justify-start h-7 md:h-12 text-[11px] md:text-base">
								<div className="w-1 h-1 md:w-2 md:h-2 bg-purple-400 rounded-full mr-3"></div>
								{feature}
							</div>
						),
					)}
				</div>
			</div>
		</div>
	);
};

// Seller Pricing Section Component
const SellerPricingSection: React.FC = () => {
	const { t } = useTranslation();

	return (
		<section id="pricing" className="py-12 md:py-20 max-w-6xl mx-auto w-full px-4">
			<h2 className="text-3xl font-semibold text-white mb-6 text-center mx-auto ">
				{t("landing-page.demo.seller.title")}
			</h2>
			<h3 className="text-xl font-medium text-slate-300 mb-8 text-center mx-auto ">
				{t("landing-page.demo.seller.subtitle")}
			</h3>

			<p className="text-lg text-slate-300 mb-8 max-w-3xl mx-auto text-center">
				{t("landing-page.demo.seller.description")}
			</p>

			{/* Analytics List */}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
				<img src="/landing/demo.png" className="w-full max-w-[800px] mx-auto h-auto mb-16 relative" />
				<TimelineLayout
					customIcon={<CheckCircle className="text-green-400 w-5 h-5 flex-shrink-0" />}
					items={((t("landing-page.demo.seller.analytics", { returnObjects: true }) as string[]) || []).map(
						(step, index) => ({
							id: index,
							date: (4 - index).toString(),
							title: step,
							description: "",
							status: "completed",
							color: "muted",
							size: "sm",
						}),
					)}
					size="sm"
					iconColor="muted"
					animate={false}
					connectorColor="muted"
					className=""
				/>
			</div>

			<p className="text-lg text-blue-400 mb-12 max-w-3xl mx-auto text-center">
				{t("landing-page.demo.seller.conclusion")}
			</p>
			<div className="text-center mb-12">
				<h2 className="text-3xl font-medium text-white mb-6">{t("landing-page.pricing.seller.title")}</h2>
				<p className="text-lg text-slate-300 max-w-4xl mx-auto mb-4">{t("landing-page.pricing.seller.subtitle")}</p>

				{/* Features List */}
				<div className="max-w-4xl mx-auto mb-8">
					<ul className="space-y-3 text-slate-300">
						{((t("landing-page.pricing.seller.features", { returnObjects: true }) as string[]) || []).map(
							(feature, index) => (
								<li key={index} className="flex items-center justify-center">
									<CheckCircle className="text-green-400 mr-3 w-5 h-5" />
									{feature}
								</li>
							),
						)}
					</ul>
				</div>

				<p className="text-xl font-semibold text-green-400">{t("landing-page.pricing.seller.highlights")}</p>
			</div>

			{/* Comparison Table */}
			<ComparisonTable />

			{/* Plan Card */}
			<div className="max-w-md mx-auto">
				<div className="bg-gradient-to-br from-green-500/50 to-blue-600/50 rounded-lg p-8 text-center text-white">
					<h3 className="text-2xl font-semibold mb-4">{t("landing-page.pricing.seller.plan.name")}</h3>
					<span className="text-4xl font-bold">{t("landing-page.pricing.seller.plan.price")}</span>
					<p className="text-green-100 mt-3 mb-6">{t("landing-page.pricing.seller.plan.features")}</p>
					<button className="bg-white text-green-900 px-8 py-3 rounded-md font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl w-full">
						{t("landing-page.pricing.seller.plan.name")}
					</button>
				</div>
			</div>
		</section>
	);
};

// Security Section Component
const SecuritySection: React.FC = () => {
	const { t } = useTranslation();

	return (
		<section className="py-12 md:py-20 max-w-5xl mx-auto px-4">
			<div className="text-center">
				<h2 className="text-3xl font-semibold text-white mb-6">{t("landing-page.security.title")}</h2>
				<p className="text-lg text-slate-300 max-w-4xl mx-auto leading-relaxed">
					{t("landing-page.security.description")}
				</p>
			</div>
		</section>
	);
};

// FAQ Section Component
const FAQSection: React.FC = () => {
	const { t } = useTranslation();

	const seeAllButton = (
		<button className="border-1 border-white text-white w-full md:w-fit px-16 py-2.5 rounded-md font-semibold text-md hover:border-purple-500 hover:bg-slate-800/50 transition-all">
			{t("landing-page.faq.seeAll")}
		</button>
	);

	return (
		<section id="faq" className="py-12 md:py-20 mx-4">
			<div className="max-w-4xl mx-auto text-center">
				<h2 className="text-3xl font-medium text-white mb-8">{t("landing-page.faq.title")}</h2>
				<div className="flex justify-center">{seeAllButton}</div>
			</div>
		</section>
	);
};

// Final CTA Section Component
const FinalCTASection = ({ selectedAction }: { selectedAction: "buy" | "sell" }) => {
	const { data } = authClient.useSession();
	const { t } = useTranslation();

	return (
		<section className="py-12 md:py-20 max-w-5xl mx-auto px-4">
			<div className="text-center">
				<h2 className="text-3xl font-medium text-white mb-6 leading-tight">{t("landing-page.finalCta.title")}</h2>

				<p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto">{t("landing-page.finalCta.subtitle")}</p>

				{/* General CTA */}
				{selectedAction === "buy" ? (
					<Link
						to={data ? "/app" : "/auth/$path"}
						params={data ? {} : { path: "sign-in" }}
						className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl"
					>
						Înregistrează-te acum
					</Link>
				) : (
					<Link
						to={data ? "/app" : "/auth/$path"}
						params={data ? {} : { path: "sign-in" }}
						className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl"
					>
						{t("landing-page.finalCta.button")}
					</Link>
				)}
			</div>
		</section>
	);
};

// Footer Component
const Footer: React.FC = () => {
	const { t } = useTranslation();
	return (
		<footer className="bg-black relative py-5">
			<img
				src="/landing/footerAnimation.gif"
				loading="lazy"
				className="absolute z-0 top-0 left-0 right-0 mx-auto max-w-5xl w-full h-full object-cover object-center scale-[0.9] opacity-30"
			/>
			<div className="max-w-5xl mx-auto px-6 relative">
				<div className="flex flex-row justify-between md:items-center mb-8">
					{/* Logo */}
					<div className="flex items-center space-x-2 -ml-4">
						<img
							src="/doors-logo.png"
							className="w-28 h-16 object-cover object-center flex items-center justify-center"
						/>
					</div>

					{/* Navigation */}
					<div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-5">
						{[
							{ text: t("landing-page.footer.navigation.benefits"), href: "#benefits" },
							{ text: t("landing-page.footer.navigation.demo"), href: "#demo" },
							{ text: t("landing-page.footer.navigation.pricing"), href: "#pricing" },
							{ text: t("landing-page.footer.navigation.faq"), href: "#faq" },
						].map(({ text, href }, index) => (
							<a key={index} href={href} className="text-white hover:text-slate-400 text-sm transition-colors">
								{text}
							</a>
						))}
					</div>
				</div>

				<h3 className="text-2xl font-bold text-white mt-16 mb-12">{t("landing-page.footer.slogan")}</h3>

				<div className="border-t border-slate-700 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-white text-xs mb-4 md:mb-0">{t("landing-page.footer.copyright")}</p>
						<div className="flex space-x-6">
							<a href="#" className="hover:text-slate-400 text-white text-xs transition-colors">
								{t("landing-page.footer.legal.terms")}
							</a>
							<a href="#" className="hover:text-slate-400 text-white text-xs transition-colors">
								{t("landing-page.footer.legal.privacy")}
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};
