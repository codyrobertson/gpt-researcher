"use client";

import React from 'react';
import { ResearchInput } from '@/components/ui/research/ResearchInput';
import { ResearchTaskList } from '@/components/ui/research/ResearchTaskList';
import { Card } from '@/components/ui/shared/card';
import { Button } from '@/components/ui/shared/button';
import { Download, FileText, Maximize2, Settings } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  progress?: number;
  message?: string;
  subtasks?: Task[];
  date?: string;
  summary?: string;
}

export default function ResearchPage() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reportType, setReportType] = React.useState('detailed');
  const [source, setSource] = React.useState('web');
  const [researchTone, setResearchTone] = React.useState('objective');
  const [maxSections, setMaxSections] = React.useState(256);
  const [agentMode, setAgentMode] = React.useState(true);
  const [followGuidelines, setFollowGuidelines] = React.useState(true);
  const [verboseLogging, setVerboseLogging] = React.useState(false);
  const [aiModel, setAiModel] = React.useState('gpt-4');

  const handleResearchSubmit = async (query: string, files?: FileList) => {
    setIsLoading(true);
    try {
      const newTask: Task = {
        id: Date.now().toString(),
        title: query,
        status: 'running',
        progress: 0,
        date: new Date().toLocaleDateString(),
        summary: 'Initializing research...'
      };
      setTasks(prev => [newTask, ...prev]);

      // Create FormData and append all values
      const formData = new FormData();
      formData.append('query', query);
      formData.append('source', source);
      formData.append('report_type', reportType);
      formData.append('research_tone', researchTone);
      formData.append('max_sections', maxSections.toString());
      formData.append('agent_mode', String(agentMode));
      formData.append('follow_guidelines', String(followGuidelines));
      formData.append('verbose_logging', String(verboseLogging));
      formData.append('ai_model', aiModel);

      // Append files if they exist
      if (files) {
        Array.from(files).forEach(file => {
          formData.append('files', file);
        });
      }
      
      const response = await fetch('/api/research', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Research request failed: ${errorData.detail}`);
      }

      // Check if it's a streaming response
      const contentType = response.headers.get('Content-Type');
      if (contentType?.includes('text/event-stream')) {
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader available');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Decode and parse the chunk
          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n').filter(Boolean);

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));
              setTasks(prev => prev.map(task => 
                task.id === newTask.id 
                  ? { 
                      ...task, 
                      progress: data.progress || task.progress,
                      message: data.message || task.message,
                      summary: data.summary || task.summary,
                      status: data.done ? 'completed' : 'running'
                    } 
                  : task
              ));
            }
          }
        }
      } else {
        const data = await response.json();
        setTasks(prev => prev.map(task => 
          task.id === newTask.id 
            ? { 
                ...task, 
                status: 'completed', 
                progress: 100, 
                message: data.result,
                summary: data.summary || 'Research completed'
              } 
            : task
        ));
      }
    } catch (error) {
      console.error('Research Error:', error);
      setTasks(prev => prev.map(task => 
        task.id === tasks[0].id 
          ? { ...task, status: 'error', message: error.message } 
          : task
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Recent Research */}
      <div className="w-64 border-r bg-background p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Research</h2>
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="border-b pb-2">
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-muted-foreground">{task.date}</p>
              <p className="text-sm">{task.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Research New Topic</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost">Research</Button>
            <Button variant="ghost">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4">
          <div className="max-w-4xl mx-auto">
            <ResearchInput 
              onSubmit={handleResearchSubmit} 
              isLoading={isLoading}
              source={source}
            />
            <ResearchTaskList tasks={tasks} />
          </div>
        </main>
      </div>

      {/* Right Sidebar - Settings */}
      <div className="w-80 border-l bg-background p-4">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              Report Type
              <span className="ml-2 text-muted-foreground">ⓘ</span>
            </h3>
            <select 
              className="w-full bg-background border rounded p-2"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="detailed">Detailed</option>
              <option value="summary">Summary</option>
              <option value="resource">Resource Report</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              AI Model
              <span className="ml-2 text-muted-foreground">ⓘ</span>
            </h3>
            <div className="flex items-center gap-2">
              <select 
                className="flex-1 bg-background border rounded p-2"
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
              >
                <option value="gpt-4">GPT-4o</option>
                <option value="gpt-3.5">GPT-3.5</option>
              </select>
              <span className="px-2 py-1 bg-secondary text-xs rounded">SMART</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              Research Tone
              <span className="ml-2 text-muted-foreground">ⓘ</span>
            </h3>
            <div className="flex items-center gap-2">
              <select 
                className="flex-1 bg-background border rounded p-2"
                value={researchTone}
                onChange={(e) => setResearchTone(e.target.value)}
              >
                <option value="objective">Objective</option>
                <option value="analytical">Analytical</option>
                <option value="critical">Critical</option>
                <option value="formal">Formal</option>
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              Research Sources
              <span className="ml-2 text-muted-foreground">ⓘ</span>
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>tavily-ai</span>
                <span className="text-green-500">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span>my local path</span>
                <Button variant="ghost" size="sm">+</Button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              Maximum Sections
              <span className="ml-2 text-muted-foreground">ⓘ</span>
            </h3>
            <input 
              type="range" 
              min="1" 
              max="512"
              value={maxSections}
              onChange={(e) => setMaxSections(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-right text-sm text-muted-foreground">
              {maxSections}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between">
              <span className="text-sm">Agent Mode</span>
              <input 
                type="checkbox" 
                checked={agentMode}
                onChange={(e) => setAgentMode(e.target.checked)}
                className="rounded border-gray-300"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-sm">Follow Guidelines</span>
              <input 
                type="checkbox" 
                checked={followGuidelines}
                onChange={(e) => setFollowGuidelines(e.target.checked)}
                className="rounded border-gray-300"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-sm">Verbose Logging?</span>
              <input 
                type="checkbox" 
                checked={verboseLogging}
                onChange={(e) => setVerboseLogging(e.target.checked)}
                className="rounded border-gray-300"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}