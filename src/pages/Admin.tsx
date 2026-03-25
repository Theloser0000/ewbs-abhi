import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Upload, Trash2, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { type StudyMaterial } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Admin = () => {
  const { isAdmin } = useAuth();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'notes' | 'slides'>('pdf');

  const handleUpload = () => {
    if (!title || !subject || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    const newMaterial: StudyMaterial = {
      id: Date.now().toString(),
      title,
      subject,
      description,
      type: fileType,
      uploadedAt: new Date().toISOString().split('T')[0],
      fileSize: '1.2 MB',
      downloads: 0,
    };

    setMaterials((prev) => [newMaterial, ...prev]);
    setTitle('');
    setSubject('');
    setDescription('');
    toast.success('Material uploaded successfully!');
  };

  const handleDelete = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    toast.success('Material deleted');
  };

  if (!isAdmin) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl text-foreground md:text-4xl">Admin Panel</h1>
        <p className="mt-2 text-muted-foreground">Upload and manage study materials</p>

        {/* Upload form */}
        <div className="mt-8 max-w-lg rounded-xl border bg-card p-6 shadow-sm">
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
                <label className="mb-1.5 block text-sm font-medium text-foreground">Subject</label>
                <Input
                  placeholder="e.g. Mathematics, Physics"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Type</label>
                <Select value={fileType} onValueChange={(v) => setFileType(v as 'pdf' | 'notes' | 'slides')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="notes">Notes</SelectItem>
                    <SelectItem value="slides">Slides</SelectItem>
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

            <Button onClick={handleUpload} className="w-full gap-2">
              <Upload className="h-4 w-4" />
              Upload Material
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
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{m.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.subject} · {m.type.toUpperCase()} · {m.fileSize}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(m.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
