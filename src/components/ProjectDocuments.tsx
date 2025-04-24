
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Download, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import DocumentCard from '@/components/documents/DocumentCard';

interface ProjectDocumentsProps {
  project: {
    id: number;
    projectName: string;
  };
}

const ProjectDocuments = ({ project }: ProjectDocumentsProps) => {
  const navigate = useNavigate();

  // Mock documents data - replace with actual API call
  const documents = [
    { 
      id: 1, 
      name: 'Project Contract.pdf', 
      type: 'pdf',
      size: '2.5 MB', 
      dateModified: '2024-02-15',
      project: project.projectName,
      owner: 'Admin',
      status: 'approved' as const
    },
    { 
      id: 2, 
      name: 'Architectural Plans.pdf', 
      type: 'pdf',
      size: '5.1 MB', 
      dateModified: '2024-02-16',
      project: project.projectName,
      owner: 'Admin',
      status: 'approved' as const
    },
    { 
      id: 3, 
      name: 'Material Specifications.docx', 
      type: 'doc',
      size: '1.2 MB', 
      dateModified: '2024-02-17',
      project: project.projectName,
      owner: 'Admin',
      status: 'pending' as const
    },
    { 
      id: 4, 
      name: 'Safety Guidelines.pdf', 
      type: 'pdf',
      size: '3.4 MB', 
      dateModified: '2024-02-18',
      project: project.projectName,
      owner: 'Admin',
      status: 'approved' as const
    },
  ];

  const handleUpload = () => {
    toast.info('Upload functionality not implemented yet');
  };

  const handleViewAll = () => {
    navigate('/documents', { state: { projectId: project.id } });
  };

  const handleView = (id: number) => {
    toast.info(`Viewing document ${id}`);
  };

  const handleDownload = (id: number) => {
    toast.info(`Downloading document ${id}`);
  };

  const handleShare = (id: number) => {
    toast.info(`Sharing document ${id}`);
  };

  const handleEdit = (id: number) => {
    toast.info(`Editing document ${id}`);
  };

  const handleDelete = (id: number) => {
    toast.info(`Deleting document ${id}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">Project Documents</CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleUpload} className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
              <Button variant="outline" onClick={handleViewAll} className="gap-2">
                View All Documents
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onView={() => handleView(doc.id)}
                onDownload={() => handleDownload(doc.id)}
                onShare={() => handleShare(doc.id)}
                onEdit={() => handleEdit(doc.id)}
                onDelete={() => handleDelete(doc.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDocuments;
