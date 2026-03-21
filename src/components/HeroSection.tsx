import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { icon: FileDown, value: '1,900+', label: 'Downloads' },
  { icon: BookOpen, value: '8', label: 'Subjects' },
  { icon: Users, value: '420+', label: 'Students' },
];

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
            Access quality notes, PDFs, and study materials shared by students across every subject.
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

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-md animate-fade-up stagger-4 grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="font-sans text-xl font-bold tabular-nums text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
