import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Button } from './ui/button';

interface ResearchResultsProps {
  results: string;
  onNewSearch: () => void;
}

export const ResearchResults: React.FC<ResearchResultsProps> = ({ results, onNewSearch }) => {
  const [reportType, setReportType] = useState('Detailed');
  const [aiModel, setAiModel] = useState('GPT-4o');
  const [researchTone, setResearchTone] = useState('Objective');
  const [agentMode, setAgentMode] = useState(false);
  const [followGuidelines, setFollowGuidelines] = useState(false);
  const [verboseLogging, setVerboseLogging] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-6 bg-background text-foreground">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Research Results</h2>
        <Button variant="outline" onClick={onNewSearch}>New Search</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue>{reportType}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Detailed">Detailed</SelectItem>
                <SelectItem value="Summary">Summary</SelectItem>
                <SelectItem value="Bullet Points">Bullet Points</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">AI Model</label>
            <Select value={aiModel} onValueChange={setAiModel}>
              <SelectTrigger>
                <SelectValue>{aiModel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GPT-4o">GPT-4o</SelectItem>
                <SelectItem value="GPT-4">GPT-4</SelectItem>
                <SelectItem value="GPT-3.5">GPT-3.5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Research Tone</label>
            <Select value={researchTone} onValueChange={setResearchTone}>
              <SelectTrigger>
                <SelectValue>{researchTone}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Objective">Objective</SelectItem>
                <SelectItem value="Casual">Casual</SelectItem>
                <SelectItem value="Academic">Academic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Agent Mode</label>
            <Switch
              checked={agentMode}
              onCheckedChange={setAgentMode}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Follow Guidelines</label>
            <Switch
              checked={followGuidelines}
              onCheckedChange={setFollowGuidelines}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Verbose Logging?</label>
            <Switch
              checked={verboseLogging}
              onCheckedChange={setVerboseLogging}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-muted p-4 rounded-lg">
        <pre className="whitespace-pre-wrap text-sm">{results}</pre>
      </div>
    </div>
  );
}; 