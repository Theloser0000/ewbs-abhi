import { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, ChevronRight, GraduationCap, Calendar, Layers } from 'lucide-react';
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
  course: string;
}

const courses = [
  { name: 'BCA', icon: '💻', desc: 'Bachelor of Computer Applications' },
  { name: 'BCom', icon: '📊', desc: 'Bachelor of Commerce' },
  { name: 'BSc', icon: '🔬', desc: 'Bachelor of Science' },
  { name: 'PUC', icon: '📚', desc: 'Pre-University Course' },
  { name: 'BA', icon: '📖', desc: 'Bachelor of Arts' },
  { name: 'Other', icon: '📁', desc: 'Other Courses' },
];

const categories = ['Textbook', 'Question Paper', 'Other'];

// Derive year from semester
const getYear = (sem: number) => Math.ceil(sem / 2);
const getSemestersForYear = (year: number) => [year * 2 - 1, year * 2];

const Materials = () => {
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  // Available years for selected course
  const years = useMemo(() => {
    if (!selectedCourse) return [];
    const courseMats = materials.filter((m) => m.course === selectedCourse);
    const unique = [...new Set(courseMats.map((m) => getYear(m.semester)))];
    return unique.sort();
  }, [materials, selectedCourse]);

  // Available semesters for selected year
  const semesters = useMemo(() => {
    if (!selectedCourse || selectedYear === null) return [];
    const [s1, s2] = getSemestersForYear(selectedYear);
    const courseMats = materials.filter((m) => m.course === selectedCourse);
    const available = [s1, s2].filter((s) => courseMats.some((m) => m.semester === s));
    return available;
  }, [materials, selectedCourse, selectedYear]);

  // Subjects for selected semester
  const subjects = useMemo(() => {
    if (!selectedCourse || selectedSemester === null) return [];
    const filtered = materials.filter(
      (m) => m.course === selectedCourse && m.semester === selectedSemester
    );
    return [...new Set(filtered.map((m) => m.subject))].sort();
  }, [materials, selectedCourse, selectedSemester]);

  // Final filtered materials
  const filtered = useMemo(() => {
    return materials.filter((m) => {
      if (selectedCourse && m.course !== selectedCourse) return false;
      if (selectedSemester !== null && m.semester !== selectedSemester) return false;
      if (selectedSubject && m.subject !== selectedSubject) return false;
      if (selectedCategory && m.type !== selectedCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!m.title.toLowerCase().includes(q) && !m.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, selectedCourse, selectedSemester, selectedSubject, selectedCategory, materials]);

  // Count materials per course
  const courseCount = (name: string) => materials.filter((m) => m.course === name).length;

  const goBack = () => {
    if (selectedSubject) setSelectedSubject(null);
    else if (selectedSemester !== null) { setSelectedSemester(null); setSelectedSubject(null); }
    else if (selectedYear !== null) { setSelectedYear(null); setSelectedSemester(null); }
    else if (selectedCourse) { setSelectedCourse(null); setSelectedYear(null); }
  };

  // Reset downstream filters on upstream change
  useEffect(() => { setSelectedYear(null); setSelectedSemester(null); setSelectedSubject(null); setSelectedCategory(null); }, [selectedCourse]);
  useEffect(() => { setSelectedSemester(null); setSelectedSubject(null); }, [selectedYear]);
  useEffect(() => { setSelectedSubject(null); }, [selectedSemester]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl text-foreground md:text-4xl">Study Materials</h1>
        <p className="mt-2 text-muted-foreground">Browse and download study resources by course, year & semester</p>

        {/* Breadcrumb */}
        {selectedCourse && (
          <div className="mt-4 flex items-center gap-1.5 text-sm">
            <button onClick={() => { setSelectedCourse(null); }} className="text-primary hover:underline">
              All Courses
            </button>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <button
              onClick={() => { setSelectedYear(null); setSelectedSemester(null); setSelectedSubject(null); }}
              className={selectedYear !== null ? 'text-primary hover:underline' : 'text-foreground font-medium'}
            >
              {selectedCourse}
            </button>
            {selectedYear !== null && (
              <>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <button
                  onClick={() => { setSelectedSemester(null); setSelectedSubject(null); }}
                  className={selectedSemester !== null ? 'text-primary hover:underline' : 'text-foreground font-medium'}
                >
                  Year {selectedYear}
                </button>
              </>
            )}
            {selectedSemester !== null && (
              <>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <button
                  onClick={() => setSelectedSubject(null)}
                  className={selectedSubject ? 'text-primary hover:underline' : 'text-foreground font-medium'}
                >
                  Semester {selectedSemester}
                </button>
              </>
            )}
            {selectedSubject && (
              <>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium text-foreground">{selectedSubject}</span>
              </>
            )}
          </div>
        )}

        {/* STEP 1: Course Selection */}
        {!selectedCourse && (
          <div className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {courses.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCourse(c.name)}
                className="group flex flex-col items-center gap-2 rounded-2xl border-2 border-border bg-card p-6 text-center transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg"
              >
                <span className="text-3xl">{c.icon}</span>
                <span className="text-lg font-bold text-foreground">{c.name}</span>
                <span className="text-xs text-muted-foreground leading-tight">{c.desc}</span>
                <span className="mt-1 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
                  {courseCount(c.name)} materials
                </span>
              </button>
            ))}
          </div>
        )}

        {/* STEP 2: Year Selection */}
        {selectedCourse && selectedYear === null && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-6">
              <Button variant="ghost" size="sm" onClick={goBack}>← Back</Button>
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                {selectedCourse} — Select Year
              </h2>
            </div>
            {years.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 max-w-2xl">
                {[1, 2, 3].map((year) => {
                  const [s1, s2] = getSemestersForYear(year);
                  const count = materials.filter(
                    (m) => m.course === selectedCourse && (m.semester === s1 || m.semester === s2)
                  ).length;
                  return (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className="group flex flex-col items-center gap-2 rounded-2xl border-2 border-border bg-card p-8 text-center transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg"
                    >
                      <Calendar className="h-8 w-8 text-primary" />
                      <span className="text-xl font-bold text-foreground">Year {year}</span>
                      <span className="text-xs text-muted-foreground">Semester {s1} & {s2}</span>
                      <span className="mt-1 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
                        {count} materials
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <p className="mt-3 text-lg font-medium text-foreground">No materials for {selectedCourse} yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Materials will appear once the admin uploads them</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Semester Selection */}
        {selectedCourse && selectedYear !== null && selectedSemester === null && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-6">
              <Button variant="ghost" size="sm" onClick={goBack}>← Back</Button>
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                {selectedCourse} Year {selectedYear} — Select Semester
              </h2>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 max-w-lg">
              {getSemestersForYear(selectedYear).map((sem) => {
                const count = materials.filter(
                  (m) => m.course === selectedCourse && m.semester === sem
                ).length;
                const semSubjects = [...new Set(
                  materials.filter((m) => m.course === selectedCourse && m.semester === sem).map((m) => m.subject)
                )];
                return (
                  <button
                    key={sem}
                    onClick={() => setSelectedSemester(sem)}
                    className="group flex flex-col items-start gap-2 rounded-2xl border-2 border-border bg-card p-6 text-left transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-6 w-6 text-primary" />
                      <span className="text-lg font-bold text-foreground">Semester {sem}</span>
                    </div>
                    {semSubjects.length > 0 && (
                      <p className="text-xs text-muted-foreground">{semSubjects.join(', ')}</p>
                    )}
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
                      {count} materials
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Materials View (with subject & category filters) */}
        {selectedCourse && selectedSemester !== null && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={goBack}>← Back</Button>
              <h2 className="text-xl font-semibold text-foreground">
                {selectedCourse} — Semester {selectedSemester}
              </h2>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
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
                {subjects.map((subj) => (
                  <Button
                    key={subj}
                    variant={selectedSubject === subj ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedSubject(subj)}
                  >
                    {subj}
                  </Button>
                ))}
              </div>
            )}

            {/* Results */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((m, i) => (
                <div key={m.id} className={`animate-fade-up stagger-${Math.min(i + 1, 5)}`}>
                  <MaterialCard material={m} />
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="mt-12 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <p className="mt-3 text-lg font-medium text-foreground">No materials found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials;
