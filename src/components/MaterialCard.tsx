import { FileText, Download, StickyNote, Presentation, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const typeConfig: Record<string, { icon: typeof FileText; label: string; color: string }> = {
  Textbook: { icon: FileText, label: 'Textbook', color: 'text-primary' },
  'Question Paper': { icon: StickyNote, label: 'Question Paper', color: 'text-destructive' },
  Other: { icon: Presentation, label: 'Other', color: 'text-accent' },
  pdf: { icon: FileText, label: 'PDF', color: 'text-destructive' },
  notes: { icon: StickyNote, label: 'Notes', color: 'text-accent' },
  slides: { icon: Presentation, label: 'Slides', color: 'text-primary' },
};

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
  uploaded_by?: string | null;
  course?: string;
  semester?: number;
}

const MaterialCard = ({ material }: { material: Material }) => {
  const config = typeConfig[material.type] || typeConfig.pdf;
  const Icon = config.icon;

  const handleDownload = () => {
    if (!material.file_path) {
      toast.error('No file available for download');
      return;
    }

    const { data } = supabase.storage
      .from('materials')
      .getPublicUrl(material.file_path, { download: material.title });

    const a = document.createElement('a');
    a.href = data.publicUrl;
    a.download = material.title;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`Downloading "${material.title}"...`);
  };

  const formattedDate = new Date(material.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="group rounded-xl border bg-card p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          <Icon className={`h-3.5 w-3.5 ${config.color}`} />
          {config.label}
        </span>
        {material.file_size && (
          <span className="text-xs text-muted-foreground">{material.file_size}</span>
        )}
      </div>

      <h3 className="mb-1 text-base font-semibold leading-snug text-foreground line-clamp-2">
        {material.title}
      </h3>
      <p className="mb-2 text-sm font-medium text-primary">{material.subject}</p>

      {(material.course || material.semester !== undefined) && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {material.course && (
            <span className="rounded-full bg-secondary/70 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
              {material.course}
            </span>
          )}
          {material.semester !== undefined && (
            <span className="rounded-full bg-secondary/70 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
              Sem {material.semester}
            </span>
          )}
        </div>
      )}

      {material.description && (
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {material.description}
        </p>
      )}

      <div className="mb-4 space-y-1 text-xs text-muted-foreground">
        {material.uploaded_by && (
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3" />
            <span>Uploaded by {material.uploaded_by}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={handleDownload}
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default MaterialCard;
