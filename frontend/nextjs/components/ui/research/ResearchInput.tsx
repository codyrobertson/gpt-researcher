import React from 'react';
import { Button } from '@/components/ui/shared/button';
import { Textarea } from '@/components/ui/shared/textarea';
import { Send, Paperclip } from 'lucide-react';

interface ResearchInputProps {
  onSubmit: (query: string, files?: FileList) => void;
  isLoading?: boolean;
  source: string;
}

export function ResearchInput({ onSubmit, isLoading = false, source }: ResearchInputProps) {
  const [query, setQuery] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query, selectedFiles || undefined);
      setQuery('');
      setSelectedFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 bg-background p-4 border-t">
      <div className="container mx-auto max-w-3xl">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your research query..."
              className="min-h-[60px] pr-10 resize-none"
              disabled={isLoading}
            />
            {(source === 'documents' || source === 'hybrid') && (
              <>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 bottom-2"
                  onClick={handleFileClick}
                  disabled={isLoading}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                />
              </>
            )}
          </div>
          <Button type="submit" size="icon" disabled={isLoading || !query.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {selectedFiles && selectedFiles.length > 0 && (
          <div className="mt-2 text-sm text-muted-foreground">
            Selected files: {Array.from(selectedFiles).map(f => f.name).join(', ')}
          </div>
        )}
      </div>
    </form>
  );
} 