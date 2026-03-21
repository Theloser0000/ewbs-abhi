import { subjects } from '@/lib/data';
import { Button } from '@/components/ui/button';

interface SubjectFilterProps {
  selected: string | null;
  onSelect: (subject: string | null) => void;
}

const SubjectFilter = ({ selected, onSelect }: SubjectFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selected === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSelect(null)}
      >
        All
      </Button>
      {subjects.map((subject) => (
        <Button
          key={subject}
          variant={selected === subject ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(subject)}
        >
          {subject}
        </Button>
      ))}
    </div>
  );
};

export default SubjectFilter;
