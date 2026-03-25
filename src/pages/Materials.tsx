import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import MaterialCard from '@/components/MaterialCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Material {
  id: string;
  title: string;
  subject: string;
  description: string;
  type: string;
  file_size: string | null;
  file_path: string | null;
  downloads: number;
  created_at: string;
}

const Materials = () => {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      const { data } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setMaterials(data);
    };
    fetchMaterials();
  }, []);

  // Get unique subjects from materials
  const subjects = useMemo(() => {
    const unique = [...new Set(materials.map((m) => m.subject))];
    return unique.sort();
  }, [materials]);

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      const matchesSearch =
        !search ||
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = !selectedSubject || m.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [search, selectedSubject, materials]);

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

        {/* Subject filters (dynamic from uploaded materials) */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            variant={selectedSubject === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSubject(null)}
          >
            All
          </Button>
          {subjects.map((subject) => (
            <Button
              key={subject}
              variant={selectedSubject === subject ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSubject(subject)}
            >
              {subject}
            </Button>
          ))}
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
