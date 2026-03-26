import { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
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
  semester: number;
}

const semesters = [1, 2, 3, 4, 5, 6];
const categories = ['Textbook', 'Question Paper', 'Other'];

const Materials = () => {
  const [search, setSearch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      const { data } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setMaterials(data as Material[]);
    };
    fetchMaterials();
  }, []);

  // Subjects for the selected semester
  const subjects = useMemo(() => {
    const semMaterials = materials.filter((m) => m.semester === selectedSemester);
    const unique = [...new Set(semMaterials.map((m) => m.subject))];
    return unique.sort();
  }, [materials, selectedSemester]);

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      const matchesSemester = m.semester === selectedSemester;
      const matchesSearch =
        !search ||
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = !selectedSubject || m.subject === selectedSubject;
      const matchesCategory = !selectedCategory || m.type === selectedCategory;
      return matchesSemester && matchesSearch && matchesSubject && matchesCategory;
    });
  }, [search, selectedSemester, selectedSubject, selectedCategory, materials]);

  // Reset subject filter when semester changes
  useEffect(() => {
    setSelectedSubject(null);
    setSelectedCategory(null);
  }, [selectedSemester]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl text-foreground md:text-4xl">Study Materials</h1>
        <p className="mt-2 text-muted-foreground">Browse and download study resources by semester & subject</p>

        {/* Semester Navigation */}
        <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {semesters.map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`group relative flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-4 text-center transition-all duration-200 ${
                selectedSemester === sem
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-primary/5'
              }`}
            >
              <BookOpen
                className={`h-5 w-5 ${
                  selectedSemester === sem ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                }`}
              />
              <span
                className={`text-xs font-semibold ${
                  selectedSemester === sem ? 'text-primary' : 'text-foreground'
                }`}
              >
                Sem {sem}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {materials.filter((m) => m.semester === sem).length} files
              </span>
            </button>
          ))}
        </div>

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

        {/* Category tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Subject filters */}
        {subjects.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant={selectedSubject === null ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedSubject(null)}
            >
              All Subjects
            </Button>
            {subjects.map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </Button>
            ))}
          </div>
        )}

        {/* Breadcrumb */}
        <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
          <span>Semester {selectedSemester}</span>
          {selectedSubject && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span>{selectedSubject}</span>
            </>
          )}
          {selectedCategory && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span>{selectedCategory}</span>
            </>
          )}
        </div>

        {/* Results */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m, i) => (
            <div key={m.id} className={`animate-fade-up stagger-${Math.min(i + 1, 5)}`}>
              <MaterialCard material={m} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 text-lg font-medium text-foreground">No materials in Semester {selectedSemester}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Materials will appear here once the admin uploads them
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials;
