import { useState, useEffect } from 'react';
import { FolderLock, Upload, Trash2, FileText, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 60 * 1024 * 1024;

interface HeadFile {
  id: string;
  name: string;
  file_path: string;
  file_size: string | null;
  uploaded_by: string | null;
  created_at: string;
}

const HeadAdminFiles = ({ adminUsername }: { adminUsername: string | null }) => {
  const [files, setFiles] = useState<HeadFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('head_files')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setFiles((data as any) || []);
    } catch {
      toast.error('Failed to load head admin files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File too large. Max 60MB.');
      return;
    }

    setUploading(true);
    let uploadedPath: string | null = null;
    try {
      const fileName = `head/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { error: storageError } = await supabase.storage
        .from('materials')
        .upload(fileName, file);
      if (storageError) throw storageError;
      uploadedPath = fileName;

      const { error: dbError } = await supabase.from('head_files').insert({
        name: file.name,
        file_path: fileName,
        file_size: formatFileSize(file.size),
        uploaded_by: adminUsername,
      });

      if (dbError) {
        if (uploadedPath) await supabase.storage.from('materials').remove([uploadedPath]);
        throw dbError;
      }

      toast.success('File uploaded!');
      setFile(null);
      const input = document.getElementById('head-file-input') as HTMLInputElement;
      if (input) input.value = '';
      fetchFiles();
    } catch (error: any) {
      toast.error(error?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (f: HeadFile) => {
    try {
      await supabase.storage.from('materials').remove([f.file_path]);
      const { error } = await supabase.from('head_files').delete().eq('id', f.id);
      if (error) throw error;
      toast.success('File deleted');
      fetchFiles();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleDownload = async (f: HeadFile) => {
    const { data } = supabase.storage.from('materials').getPublicUrl(f.file_path);
    if (data?.publicUrl) window.open(data.publicUrl, '_blank');
  };

  return (
    <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 font-sans text-lg font-semibold text-foreground">
        <FolderLock className="h-5 w-5 text-primary" />
        Head Admin Files (Private)
      </h2>

      <div className="mb-4 flex gap-2">
        <Input
          id="head-file-input"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button onClick={handleUpload} disabled={uploading} className="gap-1 shrink-0">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-4 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading...
        </div>
      ) : files.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">No files yet.</p>
      ) : (
        <div className="space-y-2">
          {files.map((f) => (
            <div key={f.id} className="flex items-center justify-between rounded-lg border px-4 py-2.5">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{f.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {f.file_size || 'N/A'} · {new Date(f.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleDownload(f)} className="text-muted-foreground hover:text-primary">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(f)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeadAdminFiles;
