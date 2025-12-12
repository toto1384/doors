import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/src/components/pages/landing/headerLanding";

export const Route = createFileRoute("/privacy-policy/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="">
			<Header />
			<PrivacyPolicy />
		</div>
	);
}

function PrivacyPolicy() {
	return (
		<div className="container mx-auto mt-16 px-6 py-8">
			<div
				className="absolute w-[1000px] h-[1000px] rounded-full blur-[100px] pointer-events-none -z10"
				style={{
					left: `50%`,
					top: `30%`,
					background: "radial-gradient(circle, rgba(138, 64, 182, 0.25) 0%, transparent 70%)",
					transform: "translate(-50%, -50%)",
				}}
			/>
			<div className="max-w-4xl mx-auto">
				<div className="text-left space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Politica de Confidențialitate</h1>
					</div>

					<div className="text-gray-700 dark:text-gray-300">
						Operator: URMA CONSULTING S.R.L. – denumire comercială „DOORS” Sediu: Municipiul Cluj-Napoca, Strada Pavel
						Roșca, Nr. 4, Ap. 28, Jud. Cluj CUI: 49841499 | Nr. ordine: J12/1582/27.03.2024 | EUID: ROONRC.J12/1582/2024
						Email contact: doorsimobiliare@gmail.com Ultima actualizare: [08/12/2025]
					</div>

					<div className="space-y-4">
						<div>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">1. Introducere</h2>
							<p className="text-gray-700 dark:text-gray-300">
								URMA CONSULTING S.R.L. respectă confidențialitatea și protecția datelor personale ale utilizatorilor, în
								conformitate cu Regulamentul (UE) 2016/679 (GDPR). Această politică explică ce date colectăm, de ce le
								colectăm și cum le utilizăm.
							</p>
						</div>

						<div>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">2. Date colectate</h2>
							<p className="text-gray-700 dark:text-gray-300">Colectăm următoarele categorii de date:</p>
							<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-6">
								<li>Date de identificare (nume, prenume, e-mail, telefon)</li>
								<li>Date de cont (autentificare, preferințe)</li>
								<li>Date despre proprietăți (fotografii, descrieri, adrese)</li>
								<li>Date tehnice (IP, loguri, cookies)</li>
								<li>Date de plată (prin procesatori autorizați, fără stocare locală)</li>
							</ul>
						</div>

						<div>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">3. Scopurile prelucrării</h2>
							<p className="text-gray-700 dark:text-gray-300">Datele sunt colectate pentru:</p>
							<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-6">
								<li>furnizarea și îmbunătățirea serviciilor</li>
								<li>comunicarea notificărilor și ofertelor</li>
								<li>asigurarea securității platformei</li>
								<li>marketing (doar cu consimțământ)</li>
								<li>respectarea obligațiilor legale</li>
							</ul>
						</div>

						<div>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">4. Destinatari și partajare</h2>
							<p className="text-gray-700 dark:text-gray-300">
								Putem partaja datele către furnizori de servicii (hosting, email, plată, hărți), autorități publice (la
								cerere legală) și parteneri tehnici. Nu vindem datele personale către terți.
							</p>
						</div>

						<div>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">5. Durata stocării</h2>
							<p className="text-gray-700 dark:text-gray-300">
								Păstrăm datele doar cât timp este necesar pentru scopurile indicate sau conform cerințelor legale. După
								expirarea termenelor, datele sunt șterse sau anonimizate.
							</p>
						</div>

						<div>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
								6. Drepturile utilizatorilor
							</h2>
							<p className="text-gray-700 dark:text-gray-300">
								Utilizatorii au dreptul de acces, rectificare, ștergere, restricționare, opoziție, portabilitate și
								retragere a consimțământului. Solicitările se pot trimite la doorsimobiliare@gmail.com.
							</p>
						</div>

						<div>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">7. Securitatea datelor</h2>
							<p className="text-gray-700 dark:text-gray-300">
								Implementăm măsuri de protecție tehnice și organizatorice: criptare, servere securizate, control acces,
								back-up periodic.
							</p>
						</div>

						<div>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
								8. Cookies și tehnologii similare
							</h2>
							<p className="text-gray-700 dark:text-gray-300">
								Platforma utilizează cookie-uri pentru funcționalitate, analiză trafic și personalizarea experienței.
								Utilizatorul poate modifica setările cookie-urilor din browser. Pentru detalii suplimentare, consultați
								Politica de Cookie-uri disponibilă pe site.
							</p>
						</div>

						<div>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
								9. Transferuri internaționale
							</h2>
							<p className="text-gray-700 dark:text-gray-300">
								Dacă furnizorii noștri utilizează servere în afara UE, ne asigurăm că există garanții adecvate (Clauze
								Contractuale Standard sau decizii de adecvare GDPR).
							</p>
						</div>

						<div>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
								10. Modificări ale politicii
							</h2>
							<p className="text-gray-700 dark:text-gray-300">
								URMA CONSULTING S.R.L. poate actualiza această politică periodic. Versiunea curentă este publicată pe
								www.doorsimobiliare.ro.
							</p>
						</div>

						<div>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
								11. Autoritate de supraveghere
							</h2>
							<p className="text-gray-700 dark:text-gray-300">
								Utilizatorii pot depune plângeri la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu
								Caracter Personal (www.dataprotection.ro).
							</p>
						</div>

						<div>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">12. Contact</h2>
							<div className="text-gray-700 dark:text-gray-300">
								<p>
									<strong>URMA CONSULTING S.R.L. – DOORS</strong>
								</p>
								<p>Str. Pavel Roșca nr. 4, Ap. 28, Cluj-Napoca, Jud. Cluj</p>
								<p>Email: doorsimobiliare@gmail.com</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
