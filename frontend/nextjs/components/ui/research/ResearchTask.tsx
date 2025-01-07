import React from 'react';
import { Card } from '@/components/ui/shared/card';
import { Badge } from '@/components/ui/shared/badge';
import { Progress } from '@/components/ui/shared/progress';
import { cn } from '@/lib/utils';

interface ResearchTaskProps {
  title: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  progress?: number;
  message?: string;
  className?: string;
}

export function ResearchTask({
  title,
  status,
  progress = 0,
  message,
  className
}: ResearchTaskProps) {
  const statusColors = {
    idle: 'bg-gray-500',
    running: 'bg-blue-500',
    completed: 'bg-green-500',
    error: 'bg-red-500'
  };

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{title}</h3>
        <Badge className={statusColors[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
      {message && (
        <p className="text-sm text-muted-foreground mb-2">{message}</p>
      )}
      {status === 'running' && (
        <Progress value={progress} className="h-2" />
      )}
    </Card>
  );
} 