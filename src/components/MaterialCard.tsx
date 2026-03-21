import { FileText, Download, StickyNote, Presentation } from 'lucide-react';
import type { StudyMaterial } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const typeConfig = {
  pdf: { icon: FileText, label: 'PDF', color: 'text-destructive' },
  notes: { icon: StickyNote, label: 'Notes', color: 'text-accent' },
  slides: { icon: Presentation, label: 'Slides', color: 'text-primary' },
} as const;

const MaterialCard = ({ material }: { material: StudyMaterial }) => {
  const config = typeConfig[material.type];
  const Icon = config.icon;

  return (
    <div className="group rounded-xl border bg-card p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          <Icon className={`h-3.5 w-3.5 ${config.color}`} />
          {config.label}
        </span>
        <span className="text-xs text-muted-foreground">{material.fileSize}</span>
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
          onClick={() => toast.success(`Downloading "${material.title}"...`)}
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default MaterialCard;
