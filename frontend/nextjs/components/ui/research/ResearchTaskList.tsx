import React from 'react';
import { ResearchTask } from './ResearchTask';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/shared/accordion';
import { ScrollArea } from '@/components/ui/shared/scroll-area';

interface Task {
  id: string;
  title: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  progress?: number;
  message?: string;
  subtasks?: Task[];
}

interface ResearchTaskListProps {
  tasks: Task[];
}

export function ResearchTaskList({ tasks }: ResearchTaskListProps) {
  const renderTask = (task: Task) => (
    <div className="mb-4">
      <ResearchTask
        key={task.id}
        title={task.title}
        status={task.status}
        progress={task.progress}
        message={task.message}
      />
      {task.message && task.status === 'completed' && (
        <div className="mt-4 p-4 bg-card rounded-lg">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {task.message}
          </pre>
        </div>
      )}
    </div>
  );

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-4">
        {tasks.map(renderTask)}
      </div>
    </ScrollArea>
  );
} 