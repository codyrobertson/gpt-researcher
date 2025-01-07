import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/shared/button';
import { ScrollArea } from '@/components/ui/shared/scroll-area';
import { Settings, Search, FileText } from 'lucide-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12 w-64 border-r", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Research Parameters</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Search className="mr-2 h-4 w-4" />
              New Research
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              History
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Active Research</h2>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1">
              {/* Active research items will be mapped here */}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
} 