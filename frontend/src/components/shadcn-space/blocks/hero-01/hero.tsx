import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Star } from "lucide-react";

type HeroSectionProps = {
  className?: string;
  onCtaClick?: () => void;
};

function HeroSection({ className, onCtaClick }: HeroSectionProps) {
  const reduceMotion = useReducedMotion();
  const offset = reduceMotion ? 0 : 24;

  return (
    <section className={className}>
      <div className="relative w-full h-full">
        <div className="relative w-full pt-0 md:pt-20 pb-6 md:pb-10">
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col max-w-5xl mx-auto gap-8">
              <div className="relative flex flex-col text-center items-center sm:gap-6 gap-4">
                <motion.h1
                  initial={{ opacity: 0, y: offset }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="font-display lg:text-8xl md:text-7xl text-5xl font-medium leading-14 md:leading-20 lg:leading-24"
                >
                  Instrumentos para{" "}
                  <span className="italic tracking-tight text-primary">
                    hacer música
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: offset }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
                  className="text-base font-normal max-w-2xl text-muted-foreground"
                >
                  En Symphoniac encontrá el instrumento que te acompaña, desde
                  el primer acorde hasta el último concierto.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: offset }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                className="flex items-center flex-col md:flex-row justify-center gap-8"
              >
                <Button
                  type="button"
                  onClick={onCtaClick}
                  className="relative text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-300 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer"
                >
                  <span className="relative z-10 transition-all duration-300">
                    Ver catálogo
                  </span>
                  <span className="absolute right-1 w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-300 group-hover:right-[calc(100%-44px)] group-hover:rotate-45 motion-reduce:transition-none">
                    <ArrowUpRight size={16} />
                  </span>
                </Button>
                <div className="flex items-center flex-col sm:flex-row sm:gap-7 gap-3">
                  <div className="flex gap-1" aria-label="5 de 5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        className="fill-warning text-warning"
                      />
                    ))}
                  </div>
                  <p className="sm:text-sm text-xs font-normal text-muted-foreground">
                    Elegido por músicos de todo el país
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
