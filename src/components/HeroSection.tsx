import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background accent */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, hsl(172, 50%, 96%) 0%, hsl(40, 30%, 96%) 60%, hsl(28, 60%, 95%) 100%)',
        }}
      />

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 animate-fade-up text-sm font-semibold uppercase tracking-widest text-primary">
            Free study resources
          </p>
          <h1 className="animate-fade-up stagger-1 text-balance font-serif text-4xl leading-[1.1] text-foreground md:text-5xl lg:text-6xl">
            Study smarter, share knowledge
          </h1>
          <p className="mx-auto mt-5 max-w-lg animate-fade-up stagger-2 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Access quality textbooks , PDFs, and study materials across every subject and also request the materials in below link .
          </p>

          <div className="mt-8 flex animate-fade-up stagger-3 flex-wrap justify-center gap-3">
            <Link to="/materials">
              <Button variant="hero">
                Browse Materials
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" size="lg">
                Upload Material
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
