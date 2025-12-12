import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/src/components/pages/landing/headerLanding";

export const Route = createFileRoute("/terms-of-service/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<Header />
			<TermsAndConditions />
		</>
	);
}

function TermsAndConditions() {
	return (
		<div className="container mx-auto px-6 py-8 mt-10 max-w-4xl">
			<div
				className="absolute w-[1000px] h-[1000px] rounded-full blur-[100px] pointer-events-none -z10"
				style={{
					left: `50%`,
					top: `30%`,
					background: "radial-gradient(circle, rgba(138, 64, 182, 0.25) 0%, transparent 70%)",
					transform: "translate(-50%, -50%)",
				}}
			/>
			<div className="rounded-lg shadow-lg p-8">
				<h1 className="text-3xl font-bold text-center mb-2">
					DOORS – Termeni și Condiții și Politica de Confidențialitate
				</h1>
				<h2 className="text-xl">Termeni și Condiții</h2>
				<p className="mb-8">
					Operator: URMA CONSULTING S.R.L., denumire comercială „DOORS” Sediu social: Municipiul Cluj-Napoca, Strada
					Pavel Roșca, Nr. 4, Ap. 28, Jud. Cluj CUI: 49841499 | Nr. ordine: J12/1582/27.03.2024 | EUID:
					ROONRC.J12/1582/2024 Email: doorsimobiliare@gmail.com Ultima actualizare: [08/12/2025]
				</p>

				<div className="space-y-8 text-sm leading-relaxed">
					<section>
						<h2 className="text-xl font-bold mb-4">1. Părți și obiectul documentului</h2>
						<p className="mb-4">
							Prezentul document reglementează termenii și condițiile de utilizare a platformei www.doorsimobiliare.ro
							(„Platforma”), operată de URMA CONSULTING S.R.L., denumită comercial „DOORS”. Platforma permite
							utilizatorilor să publice și să caute anunțuri imobiliare, să interacționeze cu agenți virtuali și să
							gestioneze oferte și cereri.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-bold mb-4">2. Acceptarea termenilor</h2>
						<p className="mb-4">
							Prin accesarea sau utilizarea Platformei, utilizatorul declară că a citit, a înțeles și acceptă prezentul
							set de Termeni și Condiții. Dacă nu este de acord, utilizatorul trebuie să înceteze utilizarea imediat.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-bold mb-4">3. Crearea și administrarea contului</h2>
						<p className="mb-4">
							Pentru a utiliza funcționalitățile principale ale Platformei, utilizatorul trebuie să își creeze un cont
							personal. Acesta este responsabil pentru confidențialitatea datelor de acces (nume utilizator, parolă) și
							pentru activitatea desfășurată prin intermediul contului. În caz de suspiciune privind acces neautorizat,
							utilizatorul trebuie să notifice imediat operatorul
						</p>
					</section>

					<section>
						<h2 className="text-xl font-bold mb-4">4. Drepturile și obligațiile utilizatorilor</h2>
						<p className="mb-4">
							Utilizatorii se angajează să furnizeze informații reale, complete și actualizate privind proprietățile
							listate sau cererile de achiziție. Este interzisă publicarea de conținut fals, ofensator, defăimător,
							discriminatoriu sau care încalcă legislația în vigoare. Platforma poate suspenda sau șterge conturile care
							încalcă aceste reguli.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-bold mb-4">5. Conținut generat de utilizatori</h2>
						<p className="mb-4">
							Anunțurile, fotografiile și descrierile publicate de utilizatori rămân proprietatea acestora, însă
							utilizatorii acordă operatorului o licență neexclusivă, gratuită, pentru utilizarea, afișarea și stocarea
							acestui conținut în scopul funcționării platformei.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-bold mb-4">6. Servicii și plată</h2>
						<p className="mb-4">
							Platforma DOORS poate oferi funcționalități gratuite și funcționalități premium (abonamente, tokeni etc.).
							Plățile se efectuează prin intermediul partenerilor autorizați, iar operatorul nu stochează date de card.
							Detaliile și costurile vor fi afișate transparent în interfața utilizatorului
						</p>
					</section>

					<section>
						<h2 className="text-xl font-bold mb-4">7. Limitarea răspunderii</h2>
						<p className="mb-4">
							Operatorul nu garantează acuratețea tuturor informațiilor publicate de utilizatori și nu răspunde pentru
							tranzacțiile derulate între aceștia. URMA CONSULTING S.R.L. nu este parte în contractele dintre vânzători
							și cumpărători
						</p>
					</section>

					<section>
						<h2 className="text-xl font-bold mb-4">8. Suspendare și reziliere</h2>
						<p className="mb-4">
							Operatorul își rezervă dreptul de a suspenda sau închide conturile utilizatorilor care încalcă termenii
							prezentați. Utilizatorul poate solicita oricând ștergerea contului și a datelor personale, conform
							Politicii de Confidențialitate
						</p>
					</section>

					<section>
						<h2 className="text-xl font-bold mb-4">9. Proprietate intelectuală</h2>
						<p className="mb-4">
							Întreg conținutul Platformei (design, cod sursă, logo, elemente grafice, texte) este proprietatea URMA
							CONSULTING S.R.L. Reproducerea fără acord scris este interzisă.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-bold mb-4">10. Legea aplicabilă și soluționarea litigiilor</h2>
						<p className="mb-4">
							Prezentul document este guvernat de legea română. Orice dispută va fi soluționată pe cale amiabilă, iar în
							lipsa unui acord, litigiile vor fi înaintate instanțelor competente din municipiul Cluj-Napoca
						</p>
					</section>

					<section>
						<h2 className="text-xl font-bold mb-4">11. Modificarea termenilor</h2>
						<p className="mb-4">
							Operatorul poate modifica periodic acești termeni. Versiunea actualizată va fi publicată pe Platformă și
							va intra în vigoare la data afișării. Utilizarea continuă a Platformei implică acceptarea modificărilor.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-bold mb-4">12. Contact</h2>
						<p className="mb-4">
							URMA CONSULTING S.R.L. – denumire comercială DOORS Email: doorsimobiliare@gmail.com Adresă: Str. Pavel
							Roșca nr. 4, Ap. 28, Cluj-Napoca, Jud. Clu
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}

