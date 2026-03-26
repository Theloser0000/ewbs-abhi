import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Upload, Trash2, FileText, Pencil, Check, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

const courses = ['BCA', 'BCom', 'BSc', 'PUC', 'BA', 'Other'];

const Admin = () => {
  const { isAdmin } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState('Textbook');
  const [course, setCourse] = useState('BCA');
  const [semester, setSemester] = useState('1');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const fetchMaterials = async () => {
    const { data } = await supabase
      .from('materials')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMaterials(data as Material[]);
  };

  useEffect(() => {
    if (isAdmin) fetchMaterials();
  }, [isAdmin]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleUpload = async () => {
    if (!title || !subject || !description) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: storageError } = await supabase.storage
        .from('materials')
        .upload(fileName, file);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase.from('materials').insert({
        title,
        subject,
        description,
        type: fileType,
        course,
        semester: parseInt(semester),
        file_size: formatFileSize(file.size),
        file_path: fileName,
      });

      if (dbError) throw dbError;

      toast.success('Material uploaded successfully!');
      setTitle('');
      setSubject('');
      setDescription('');
      setFile(null);
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchMaterials();
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (material: Material) => {
    if (material.file_path) {
      await supabase.storage.from('materials').remove([material.file_path]);
    }
    const { error } = await supabase.from('materials').delete().eq('id', material.id);
    if (error) {
      toast.error('Failed to delete');
      return;
    }
    toast.success('Material deleted');
    fetchMaterials();
  };

  const handleRename = async (id: string) => {
    if (!editTitle.trim()) {
      toast.error('Title cannot be empty');
      return;
    }
    const { error } = await supabase.from('materials').update({ title: editTitle.trim() }).eq('id', id);
    if (error) {
      toast.error('Failed to rename');
      return;
    }
    toast.success('Renamed successfully');
    setEditingId(null);
    fetchMaterials();
  };

  if (!isAdmin) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl text-foreground md:text-4xl">Admin Panel</h1>
        <p className="mt-2 text-muted-foreground">Upload and manage study materials</p>

        {/* Upload form */}
        <div className="mt-8 max-w-xl rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-sans text-lg font-semibold text-foreground">
            <Upload className="h-5 w-5 text-primary" />
            Upload New Material
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Title</label>
              <Input
                placeholder="e.g. Calculus Chapter 5 Notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Course</label>
                <Select value={course} onValueChange={(v) => setCourse(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Semester</label>
                <Select value={semester} onValueChange={(v) => setSemester(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((s) => (
                      <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Subject</label>
                <Input
                  placeholder="e.g. Mathematics"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Category</label>
                <Select value={fileType} onValueChange={(v) => setFileType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Textbook">Textbook</SelectItem>
                    <SelectItem value="Question Paper">Question Paper</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
              <Textarea
                placeholder="Briefly describe this material..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">File</label>
              <Input
                id="file-input"
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            <Button onClick={handleUpload} className="w-full gap-2" disabled={uploading}>
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Material'}
            </Button>
          </div>
        </div>

        {/* Materials list */}
        <div className="mt-10">
          <h2 className="mb-4 font-sans text-lg font-semibold text-foreground">
            All Materials ({materials.length})
          </h2>

          <div className="space-y-2">
            {materials.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-secondary/50"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    {editingId === m.id ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="h-7 text-sm"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleRename(m.id)}
                      />
                    ) : (
                      <p className="text-sm font-medium text-foreground truncate">{m.title}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {m.course} · Sem {m.semester} · {m.subject} · {m.type} · {m.file_size || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {editingId === m.id ? (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleRename(m.id)} className="text-primary">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditingId(null)} className="text-muted-foreground">
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditingId(m.id); setEditTitle(m.title); }}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(m)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
