import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, X } from 'lucide-react';

const WelcomePopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('ewbs_welcomed')) return;
    sessionStorage.setItem('ewbs_welcomed', '1');

    const t = setTimeout(() => {
      setOpen(true);
      blast();
    }, 350);
    return () => clearTimeout(t);
  }, []);

  const blast = () => {
    const colors = ['#0d9488', '#14b8a6', '#f59e0b', '#ef4444', '#ffffff'];
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors });
    setTimeout(
      () => confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0 }, colors }),
      200
    );
    setTimeout(
      () => confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1 }, colors }),
      400
    );
  };

  const close = () => setOpen(false);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 px-4 backdrop-blur-sm animate-fade-in"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border bg-card p-8 text-center shadow-2xl animate-scale-in"
        style={{
          background:
            'linear-gradient(135deg, hsl(172, 60%, 96%) 0%, hsl(40, 40%, 97%) 60%, hsl(28, 70%, 95%) 100%)',
        }}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-8 w-8 animate-pulse" />
        </div>

        <h2 className="font-serif text-2xl text-foreground md:text-3xl">
          Welcome to our EWBS Study Material
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Browse, download and share quality resources curated for East West Business School students.
        </p>

        <button
          onClick={() => {
            blast();
            setTimeout(close, 600);
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-105"
        >
          Let's Go 🎉
        </button>
      </div>
    </div>
  );
};

export default WelcomePopup;
