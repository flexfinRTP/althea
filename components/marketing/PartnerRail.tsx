const partners = [
  {
    role: "Liveness",
    name: "World ID",
    logo: "/partners/world.png",
    body: "Selfie Check is one signal against automated claims on a limited charitable fund. It is never used to decide hospital assistance.",
  },
  {
    role: "Control",
    name: "Privy",
    logo: "/partners/privy.png",
    body: "The Relief treasury, policy, and approval sit with the organization. The agent does not get an open hand.",
  },
  {
    role: "Execution",
    name: "Circle",
    logo: "/partners/circle.png?v=3",
    body: "The Agent Stack carries out a grant that has already been approved. It does not choose who receives help.",
  },
  {
    role: "Settlement",
    name: "Arc",
    logo: "/partners/arc.png",
    body: "USDC in. Grant out. Public proof that funds moved. No medical file on the transaction.",
  },
];

export function PartnerRail() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold-deep">Relief Rail</p>
        <h2 className="mt-4 max-w-3xl text-3xl leading-tight tracking-tight md:text-5xl">Built on Arc.</h2>
        <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
          Powered by Circle. Controlled with Privy. Liveness from World.
        </p>
        <div className="mt-12 border-t border-line md:grid md:grid-cols-4 md:divide-x md:divide-line">
          {partners.map((partner) => (
            <article
              key={partner.name}
              className="border-b border-line py-8 last:border-b-0 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">{partner.role}</p>
              <div className="mt-6 h-28 w-28 overflow-hidden rounded-full">
                <img
                  src={partner.logo}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-5 text-2xl">{partner.name}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{partner.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-10 text-sm leading-6 text-muted">
          Hospital financial assistance never touches these rails. The patient never holds a wallet.
        </p>
        <p className="mt-4 text-sm leading-6 text-muted">
          Althea turns independent charitable funds into a programmable relief network.
        </p>
      </div>
    </section>
  );
}
