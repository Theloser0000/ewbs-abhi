import { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import MaterialCard from '@/components/MaterialCard';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('materials')
        .select('*')
        .order('downloads', { ascending: false })
        .limit(4);
      if (data) setFeatured(data);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />

      {/* Featured materials */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-serif text-2xl text-foreground md:text-3xl">
                  Popular materials
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">Most downloaded this month</p>
              </div>
              <Link to="/materials">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((m, i) => (
                <div key={m.id} className={`animate-fade-up stagger-${i + 1}`}>
                  <MaterialCard material={m} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Creator section */}
      <section className="border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">Created by</p>
          <a
            href="https://theloser0000.github.io/abhi/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block font-serif text-lg text-primary underline-offset-4 hover:underline"
          >
            Abhi — View Portfolio
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 StudyShare. Built for students, by students.
        </div>
      </footer>
    </div>
  );
};

export default Index;
