import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { createProject } from '@/services/projectService';

interface NewProjectModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: () => void;
}

export function NewProjectModal({ isOpen, onOpenChange, onProjectCreated }: NewProjectModalProps) {
  const [projectName, setProjectName] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectStatus, setProjectStatus] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [expectedEndDate, setExpectedEndDate] = useState<Date | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName || !siteAddress || !clientName || !projectStatus || !startDate || !expectedEndDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const project = {
        projectName,
        siteAddress,
        clientName,
        projectStatus,
        description,
        startDate: format(startDate, 'yyyy-MM-dd'),
        expectedEndDate: format(expectedEndDate, 'yyyy-MM-dd'),
        actualEndDate: null,
        status: 1, // Active
        orderId: null,
        siteEngineerId: null,
        clientId: null,
        stageId: null,
      };

      await createProject(project);
      onOpenChange(false);
      onProjectCreated?.();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="projectName">Project Name *</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="siteAddress">Site Address *</Label>
            <Input
              id="siteAddress"
              value={siteAddress}
              onChange={(e) => setSiteAddress(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="clientName">Client Name *</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="projectStatus">Project Status *</Label>
            <select
              id="projectStatus"
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              className="w-full rounded-md border p-2"
              required
            >
              <option value="">Select status...</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                className="rounded-md border"
              />
            </div>
            
            <div>
              <Label htmlFor="expectedEndDate">Expected End Date *</Label>
              <Calendar
                mode="single"
                selected={expectedEndDate}
                onSelect={setExpectedEndDate}
                className="rounded-md border"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
