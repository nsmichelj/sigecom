import { Container } from "@/components/container";
import Image from "next/image";

export function Hero() {
  return (
    <section>
      <Container className="py-12">
        <div className="relative w-full h-150 bg-primary/10 rounded-2xl overflow-hidden">
          <Image
            src="/hero-background.jpg"
            alt="Hero Background"
            fill
            sizes="100%"
            className="absolute inset-0 h-full w-full object-cover z-1"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/40 z-2"></div>
          <div className="relative z-3 flex flex-col items-center justify-center h-full text-center px-4 py-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-3xl text-balance leading-tight">
              Unidos por nuestra comunidad
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl text-balance">
              Trabajando juntos para construir un mejor futuro, fortalecer lazos
              y mejorar la calidad de vida de cada vecino.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
