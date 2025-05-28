import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSpecialties, Specialty } from '@/services/specialtyService';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NewSpecialtyModal } from '@/components/specialty/NewSpecialtyModal';
import { EditSpecialtyModal } from '@/components/specialty/EditSpecialtyModal';
import { DeleteSpecialtyDialog } from '@/components/specialty/DeleteSpecialtyDialog';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function WorkerSpecialties() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Modal open/close states
  const [isNewModalOpen, setIsNewModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = React.useState<Specialty | null>(null);

  // Query to fetch specialties data
  const { data: specialties = [], isLoading, isError, error } = useQuery({
    queryKey: ['specialties'],
    queryFn: getSpecialties,
  });

  // Show error message when data loading fails - in useEffect to avoid infinite loop
  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred while loading specialties'
      });
    }
  }, [isError, error, toast]);

  // Open edit modal with selected specialty
  const handleEditClick = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setIsEditModalOpen(true);
  };

  // Open delete dialog with selected specialty
  const handleDeleteClick = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setIsDeleteDialogOpen(true);
  };

  // Refresh data after add, edit, or delete
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['specialties'] });
  };

  return (
    <div className="container mx-auto py-8 pt-20">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Worker Specialties</h1>
        </div>
        <Button onClick={() => setIsNewModalOpen(true)}>
          <Plus className="mr-2" /> Add Specialty
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="loader">Loading...</div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Specialty Name</TableHead>
                <TableHead className="text-left">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specialties.length > 0 ? (
                specialties.map((specialty) => (
                  <TableRow key={specialty.id}>
                    <TableCell>{specialty.id}</TableCell>
                    <TableCell>{specialty.name}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditClick(specialty)}
                          className="ml-2"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="mr-1">Edit</span>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteClick(specialty)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="mr-1">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No specialties registered
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* New specialty modal */}
      <NewSpecialtyModal 
        isOpen={isNewModalOpen}
        setIsOpen={setIsNewModalOpen}
        onSuccess={refreshData}
      />

      {/* Edit specialty modal */}
      <EditSpecialtyModal 
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        specialty={selectedSpecialty}
        onSuccess={refreshData}
      />

      {/* Delete specialty confirmation dialog */}
      <DeleteSpecialtyDialog 
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        specialty={selectedSpecialty}
        onSuccess={refreshData}
      />
    </div>
  );
}
