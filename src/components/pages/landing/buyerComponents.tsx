import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { Badge } from "@/src/components/ui/badge";
import { TimelineLayout } from "@/src/components/ui/timeline-layout";
import { ElevenLabsChatBotDemo } from "@/src/components/userAndAi/aiChatbot";
import { ComparisonTable } from "@/src/routes";
import { usePropertyFilterStore } from "@/src/routes/__root";
import { useTRPC } from "@/trpc/react";
import { authClient } from "@/utils/auth-client";
import { PropertiesView } from "../propertiesView";

// Buyer Demo Section Component
export const BuyerDemoSection = ({ token }: { token: string }) => {
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
		<section id="demo" className="md:py-10 ">
			<div className="max-w-7xl mx-auto px-2 md:px-6 flex flex-col items-center">
				{/* Try Demo Section */}
				<div className="text-center bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg p-2 md:p-8 max-w-5xl w-full mx-auto">
					<h3 className="text-2xl font-semibold text-white mb-4">{t("landing-page.demo.buyer.tryDemo.title")}</h3>

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
							{t("landing-page.demo.tabs.results")}
						</button>
					</div>

					<div className="flex flex-row text-start gap-6 items-center h-[500px]">
						<div className={`${tab === "agent" ? "block" : "md:block hidden"} md:w-[30%] w-full h-full`}>
							<ElevenLabsChatBotDemo user={undefined} conversationToken={token} demoVersion userType="buyer" />
						</div>
						<div
							className={`${tab === "results" ? "block" : "md:block hidden"} md:w-[70%] w-full max-h-full flex flex-col overflow-y-scroll`}
						>
							{/* {JSON.stringify(demoPropertyFilters)} */}
							<div className="max-h-full overflow-y-scroll">
								<PropertiesView searchParams={demoPropertyFilters ?? {}} demoVersion />
							</div>
						</div>
					</div>
				</div>

				<Link
					to={data ? "/app" : "/auth/$path"}
					params={data ? {} : { path: "sign-in" }}
					className="inline-block bg-gradient-to-r mx-auto mt-5 text-center from-blue-500 to-purple-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl"
				>
					{t("landing-page.finalCta.buyerButton")}
				</Link>
			</div>
		</section>
	);
};

export const ProblemSolutionBuyer = () => {
	const { t } = useTranslation();

	return (
		<>
			{/* Problem Statement */}
			<div className="text-center mb-24">
				<h2 className="text-3xl font-semibold text-white mb-6">{t("landing-page.benefits.buyer.beforeDoorsTitle")}</h2>
				<h3 className="text-lg text-white mb-6">{t("landing-page.benefits.buyer.title")}</h3>

				{/* Problem List */}
				<div className="bg-[#120826] rounded-lg p-8 mb-6 text-left max-w-4xl mx-auto">
					<ul className="space-y-3 text-[#919EAB]">
						{((t("landing-page.benefits.buyer.problemList", { returnObjects: true }) as string[]) || []).map(
							(problem, index) => (
								<li key={index} className="flex items-center text-sm">
									<span className="text-red-400 mr-3 mt-1">•</span>
									{problem}
								</li>
							),
						)}
					</ul>

					<p className="text-slate-300 mt-5 ">{t("landing-page.benefits.buyer.subtitle")}</p>
				</div>

				<p className="text-md font-semibold text-blue-400">{t("landing-page.benefits.buyer.conclusion")}</p>
			</div>

			{/* Solution */}
			<div className="text-center mb-20">
				<section id="about" className="max-w-4xl mx-auto">
					<div className="grid lg:grid-cols-2 gap-12 items-stretch mx-4">
						{/* Left side - Blue card */}
						<div className="bg-gradient-to-br from-blue-500/50 to-purple-600/50 rounded-lg p-6 text-white">
							<h2 className="text-3xl text-white mb-3">{t("landing-page.benefits.buyer.whyDoorsTitle")}</h2>
							<h3 className="text-lg text-white mb-6">{t("landing-page.benefits.buyer.solutionTitle")}</h3>
							<p className="text text-slate-300 mb-6 mt-4 max-w-3xl mx-auto">
								{t("landing-page.benefits.buyer.solutionDescription")}
							</p>
						</div>

						<div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg p-8 max-w-4xl mx-auto">
							<h3 className="text-2xl font-semibold text-white mb-6">
								{t("landing-page.benefits.buyer.realBenefits.title")}
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-1 gap-4 text-left">
								{((t("landing-page.benefits.buyer.realBenefits.items", { returnObjects: true }) as string[]) || []).map(
									(benefit, index) => (
										<div key={index} className="flex text-sm items-start text-white">
											<CheckCircle className="text-green-400 mr-3 mt-1 w-5 h-5 flex-shrink-0" />
											{benefit}
										</div>
									),
								)}
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
};

// About Section Component
export const FoundSomethingYouLikeSection: React.FC = () => {
	const { t } = useTranslation();
	const servicesData = t("landing-page.about.services", { returnObjects: true });
	const services = Array.isArray(servicesData)
		? (servicesData as Array<{ icon: string; title: string; description: string; comingSoon?: boolean }>)
		: [];

	return (
		<section id="about" className="mt-20 max-w-6xl mx-auto">
			<div className="mx-4 text-center">
				{/* Subtitle Question */}
				<p className="text-xl text-slate-300 mb-6">{t("landing-page.about.subtitle")}</p>

				{/* Main Title */}
				<h2 className="text-3xl font-semibold text-white mb-8">{t("landing-page.about.title")}</h2>

				{/* Description */}
				<p className="text-lg text-slate-300 mb-12 max-w-3xl mx-auto">{t("landing-page.about.description")}</p>

				{/* Services Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
					{services.map((service, index) => (
						<div key={index} className="bg-[#120826] rounded-lg p-6 text-center relative">
							{service.comingSoon && (
								<Badge variant="destructive" className="absolute top-1.5 right-1.5">
									Coming Soon
								</Badge>
							)}
							<div className="text-4xl mb-4">{service.icon}</div>
							<h3 className="text-lg font-semibold text-white mb-3">{service.title}</h3>
							<p className="text-sm text-slate-300 leading-relaxed">{service.description}</p>
						</div>
					))}
				</div>

				{/* Conclusion */}
				<p className="text-xl text-blue-400 font-medium max-w-3xl mx-auto">{t("landing-page.about.conclusion")}</p>
			</div>
		</section>
	);
};

export const FromLookingToFound = () => {
	const { t } = useTranslation();

	const stepsData = t("landing-page.demo.buyer.steps", { returnObjects: true });
	const steps = Array.isArray(stepsData) ? (stepsData as Array<{ number: string; text: string }>) : [];
	return (
		<>
			<h2 className="text-3xl font-semibold text-white mb-7 md:mb-12 text-center mx-auto ">
				{t("landing-page.demo.buyer.title")}
			</h2>

			{/* Steps */}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
				<img src="/landing/demo.png" className="w-full max-w-[800px] mx-auto h-auto mb-16 relative" />
				<TimelineLayout
					hideDate
					items={steps.reverse().map((step, index) => ({
						id: index,
						date: step.number,
						title: `Pasul ${4 - index}`,
						description: step.text,
						status: "completed",
						color: "primary",
						size: "sm",
					}))}
					size="sm"
					iconColor="primary"
					animate={false}
					connectorColor="primary"
					className=""
				/>
			</div>

			{/* CTA Button */}
			<div className="text-center ">
				<button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl">
					{t("landing-page.finalCta.buyerButton")}
				</button>
			</div>
		</>
	);
};

// Buyer Pricing Section Component
export const BuyerPricingSection: React.FC = () => {
	const { t } = useTranslation();

	return (
		<section id="pricing" className="py-12 md:py-20 max-w-6xl mx-auto w-full px-4">
			<div className="text-center mb-12">
				<h2 className="text-3xl font-medium text-white mb-6">{t("landing-page.pricing.buyer.title")}</h2>
				<p className="text-lg text-slate-300 max-w-4xl mx-auto mb-4">{t("landing-page.pricing.buyer.subtitle")}</p>
				<p className="text-xl font-semibold text-blue-400">{t("landing-page.pricing.buyer.highlights")}</p>
			</div>

			{/* Comparison Table */}
			<ComparisonTable />

			{/* Plan Card */}
			<div className="max-w-md mx-auto">
				<div className="bg-gradient-to-br from-blue-500/50 to-purple-600/50 rounded-lg p-8 text-center text-white">
					<h3 className="text-2xl font-semibold mb-4">{t("landing-page.pricing.buyer.plan.name")}</h3>
					<span className="text-4xl font-bold">{t("landing-page.pricing.buyer.plan.price")}</span>
					<p className="text-blue-100 mt-3 mb-6">{t("landing-page.pricing.buyer.plan.features")}</p>
					<Link
						to={"/auth/$path"}
						params={{ path: "sign-in" }}
						className="bg-white text-blue-900 px-8 py-3 rounded-md font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl w-full"
					>
						{t("landing-page.pricing.buyer.plan.name")}
					</Link>
				</div>
			</div>
		</section>
	);
};

// Buyer Benefits Section Component
export const BuyerBenefitsSection: React.FC = () => {
	return (
		<section id="benefits" className="py-16">
			<div className="max-w-6xl mx-auto px-6">
				<ProblemSolutionBuyer />
				<FromLookingToFound />
				<FoundSomethingYouLikeSection />
			</div>
		</section>
	);
};
