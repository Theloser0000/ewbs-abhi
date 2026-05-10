import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />

      {/* College & Links section */}
      <section className="border-t bg-secondary/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-xl text-foreground md:text-2xl">
            EAST WEST BUSINESS SCHOOL
          </h2>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
            <a
              href="https://theloser0000.github.io/abhi/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Created by Abhi — View Portfolio
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 StudyShare. Built for students, by student.
        </div>
      </footer>
    </div>
  );
};

export default Index;
