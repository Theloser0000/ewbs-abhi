import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Upload, Trash2, FileText, Pencil, Check, X, Loader2, UserPlus, Users, Shield } from 'lucide-react';
import HeadAdminFiles from '@/components/HeadAdminFiles';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Material } from '@/types/material';

const MAX_FILE_SIZE = 60 * 1024 * 1024;
const courses = ['BCA', 'BCom', 'BSc', 'PUC', 'BA', 'Other'];

interface Admin {
  id: string;
  username: string;
  role: string;
  created_at: string;
}

const Admin = () => {
  const { isAdmin, isHead, adminUsername } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState('Textbook');
  const [course, setCourse] = useState('BCA');
  const [semester, setSemester] = useState('1');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Admin management state (head only)
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdminUser, setNewAdminUser] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setMaterials(data as any);
    } catch {
      toast.error('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    const { data, error } = await supabase.from('admins').select('*').order('created_at', { ascending: true });
    if (!error && data) setAdmins(data);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchMaterials();
      if (isHead) fetchAdmins();
    }
  }, [isAdmin, isHead]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleUpload = async () => {
    if (!title.trim() || !subject.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File too large. Max allowed size is 60MB.');
      return;
    }

    setUploading(true);
    let uploadedFilePath: string | null = null;
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { error: storageError } = await supabase.storage
        .from('materials')
        .upload(fileName, file);
      if (storageError) throw storageError;
      uploadedFilePath = fileName;

      const { error: dbError } = await supabase.from('materials').insert({
        title: title.trim(),
        subject: subject.trim(),
        description: description.trim(),
        type: fileType,
        course,
        semester: parseInt(semester),
        file_size: formatFileSize(file.size),
        file_path: fileName,
        uploaded_by: adminUsername,
      });

      if (dbError) {
        if (uploadedFilePath) {
          await supabase.storage.from('materials').remove([uploadedFilePath]);
        }
        throw dbError;
      }

      toast.success('Material uploaded successfully!');
      setTitle('');
      setSubject('');
      setDescription('');
      setFile(null);
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchMaterials();
    } catch (error: any) {
      toast.error(error?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (material: Material) => {
    try {
      if (material.file_path) {
        await supabase.storage.from('materials').remove([material.file_path]);
      }
      const { error } = await supabase.from('materials').delete().eq('id', material.id);
      if (error) throw error;
      toast.success('Material deleted');
      fetchMaterials();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleRename = async (id: string) => {
    if (!editTitle.trim()) {
      toast.error('Title cannot be empty');
      return;
    }
    try {
      const { error } = await supabase.from('materials').update({ title: editTitle.trim() }).eq('id', id);
      if (error) throw error;
      toast.success('Renamed successfully');
      setEditingId(null);
      fetchMaterials();
    } catch {
      toast.error('Failed to rename');
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminUser.trim() || !newAdminPass.trim()) {
      toast.error('Please enter username and password');
      return;
    }
    try {
      const { error } = await supabase.from('admins').insert({
        username: newAdminUser.trim(),
        password: newAdminPass.trim(),
        role: 'admin',
      });
      if (error) {
        if (error.code === '23505') toast.error('Username already exists');
        else throw error;
        return;
      }
      toast.success(`Admin "${newAdminUser.trim()}" added!`);
      setNewAdminUser('');
      setNewAdminPass('');
      fetchAdmins();
    } catch {
      toast.error('Failed to add admin');
    }
  };

  const handleRemoveAdmin = async (admin: Admin) => {
    if (admin.role === 'head') {
      toast.error('Cannot remove head admin');
      return;
    }
    try {
      const { error } = await supabase.from('admins').delete().eq('id', admin.id);
      if (error) throw error;
      toast.success(`Admin "${admin.username}" removed`);
      fetchAdmins();
    } catch {
      toast.error('Failed to remove admin');
    }
  };

  if (!isAdmin) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl text-foreground md:text-4xl">Admin Panel</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Logged in as <span className="font-semibold text-primary">{adminUsername}</span>
              {isHead && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"><Shield className="h-3 w-3" /> Head Admin</span>}
            </p>
          </div>
          {isHead && (
            <Button variant="outline" onClick={() => setShowAdminPanel(!showAdminPanel)} className="gap-2">
              <Users className="h-4 w-4" />
              Manage Admins
            </Button>
          )}
        </div>

        {/* Admin Management (Head Only) */}
        {isHead && showAdminPanel && (
          <div className="mt-6 max-w-xl rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 font-sans text-lg font-semibold text-foreground">
              <Users className="h-5 w-5 text-primary" />
              Admin Management
            </h2>

            <div className="mb-4 flex gap-2">
              <Input placeholder="Username" value={newAdminUser} onChange={(e) => setNewAdminUser(e.target.value)} />
              <Input placeholder="Password" type="password" value={newAdminPass} onChange={(e) => setNewAdminPass(e.target.value)} />
              <Button onClick={handleAddAdmin} className="gap-1 shrink-0">
                <UserPlus className="h-4 w-4" /> Add
              </Button>
            </div>

            <div className="space-y-2">
              {admins.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border px-4 py-2">
                  <div>
                    <span className="text-sm font-medium text-foreground">{a.username}</span>
                    {a.role === 'head' && (
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Head</span>
                    )}
                  </div>
                  {a.role !== 'head' && (
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveAdmin(a)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Head Admin Files (Head Only) */}
        {isHead && <HeadAdminFiles adminUsername={adminUsername} />}

        {/* Upload form */}
        <div className="mt-8 max-w-xl rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-sans text-lg font-semibold text-foreground">
            <Upload className="h-5 w-5 text-primary" />
            Upload New Material
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Title</label>
              <Input placeholder="e.g. Calculus Chapter 5 Notes" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Course</label>
                <select value={course} onChange={(e) => setCourse(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  {courses.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Semester</label>
                <select value={semester} onChange={(e) => setSemester(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  {[1, 2, 3, 4, 5, 6].map((s) => (<option key={s} value={String(s)}>Semester {s}</option>))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Subject</label>
                <Input placeholder="e.g. Mathematics" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Category</label>
                <select value={fileType} onChange={(e) => setFileType(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="Textbook">Textbook</option>
                  <option value="Question Paper">Question Paper</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
              <Textarea placeholder="Briefly describe this material..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">File</label>
              <Input id="file-input" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.webp" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <p className="mt-1 text-xs text-muted-foreground">Supported: PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, PNG, WEBP</p>
            </div>

            <Button onClick={handleUpload} className="w-full gap-2" disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? 'Uploading...' : 'Upload Material'}
            </Button>
          </div>
        </div>

        {/* Materials list */}
        <div className="mt-10">
          <h2 className="mb-4 font-sans text-lg font-semibold text-foreground">
            All Materials ({materials.length})
          </h2>

          {loading ? (
            <div className="flex items-center gap-2 py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading materials...
            </div>
          ) : materials.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No materials uploaded yet.</p>
          ) : (
            <div className="space-y-2">
              {materials.map((m: any) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-secondary/50">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      {editingId === m.id ? (
                        <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="h-7 text-sm" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleRename(m.id)} />
                      ) : (
                        <p className="text-sm font-medium text-foreground truncate">{m.title}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {m.course} · Sem {m.semester} · {m.subject} · {m.type} · {m.file_size || 'N/A'}
                        {m.uploaded_by && (
                          <span className="ml-1 text-primary"> · by {m.uploaded_by}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {editingId === m.id ? (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => handleRename(m.id)} className="text-primary"><Check className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditingId(null)} className="text-muted-foreground"><X className="h-4 w-4" /></Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => { setEditingId(m.id); setEditTitle(m.title); }} className="text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(m)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
