import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import MaterialCard from '@/components/MaterialCard';
import SubjectFilter from '@/components/SubjectFilter';
import { sampleMaterials } from '@/lib/data';
import { Input } from '@/components/ui/input';

const Materials = () => {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return sampleMaterials.filter((m) => {
      const matchesSearch =
        !search ||
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = !selectedSubject || m.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [search, selectedSubject]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl text-foreground md:text-4xl">Study Materials</h1>
        <p className="mt-2 text-muted-foreground">Browse and download study resources by subject</p>

        {/* Search */}
        <div className="relative mt-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="mt-5">
          <SubjectFilter selected={selectedSubject} onSelect={setSelectedSubject} />
        </div>

        {/* Results */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m, i) => (
            <div key={m.id} className={`animate-fade-up stagger-${Math.min(i + 1, 5)}`}>
              <MaterialCard material={m} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg font-medium text-foreground">No materials found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials;
