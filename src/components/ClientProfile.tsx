
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Mail, 
  Phone, 
  Briefcase,
  Edit,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Client {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  clientType: string;
  projects: {
    id: number;
    name: string;
  }[];
}

interface ClientProfileProps {
  client: Client;
}

const ClientProfile = ({ client }: ClientProfileProps) => {
  const handleEdit = () => {
    toast.info('Edit functionality not implemented yet');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold">Client Information</CardTitle>
                <CardDescription>Key information about this client</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-1" onClick={handleEdit}>
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-start gap-3">
              <Building className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Client Type</p>
                <p className="font-medium">{client.clientType}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{client.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{client.phoneNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-transparent pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-500" />
              Client Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {client.projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
                <Briefcase className="mx-auto h-12 w-12 mb-3 text-muted-foreground/50" />
                <p>No projects assigned</p>
              </div>
            ) : (
              <div className="space-y-4">
                {client.projects.map((project) => (
                  <div key={project.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                    <Briefcase className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <div className="mt-1 flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary px-2">
                          <FileText className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientProfile;
