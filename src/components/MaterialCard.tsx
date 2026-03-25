import { FileText, Download, StickyNote, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const typeConfig: Record<string, { icon: typeof FileText; label: string; color: string }> = {
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
      .getPublicUrl(material.file_path);

    window.open(data.publicUrl, '_blank');
    toast.success(`Downloading "${material.title}"...`);
  };

  return (
    <div className="group rounded-xl border bg-card p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          <Icon className={`h-3.5 w-3.5 ${config.color}`} />
          {config.label}
        </span>
        <span className="text-xs text-muted-foreground">{material.file_size || ''}</span>
      </div>

      <h3 className="mb-1.5 font-sans text-base font-semibold leading-snug text-foreground">
        {material.title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
        {material.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-primary">{material.subject}</span>
          <span className="text-[11px] text-muted-foreground">
            {material.downloads.toLocaleString()} downloads
          </span>
        </div>
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
