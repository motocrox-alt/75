// Placeholder mínimo de sección (título NES + "Próximamente").
export function Placeholder({ titulo }: { titulo: string }) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="font-press text-lg text-cloud drop-shadow-[3px_3px_0_var(--ink)]">
        {titulo}
      </h1>
      <p className="font-silk text-ink/70">Próximamente</p>
    </section>
  );
}
