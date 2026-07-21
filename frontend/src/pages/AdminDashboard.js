import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash } from '@phosphor-icons/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const branches = [
  { value: 'mechanical', label: 'Mechanical Engineering' },
  { value: 'electrical', label: 'Electrical Engineering' },
  { value: 'civil', label: 'Civil Engineering' },
  { value: 'electronics', label: 'Electronics Engineering' }
];

const AdminDashboard = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [formData, setFormData] = useState({
    name: '', branch: 'mechanical', year: 1, semester: 1,
    definition: '', working_principle: '', main_parts: '',
    applications: '', exam_notes: '', image_url: ''
  });

  useEffect(() => { fetchEquipment(); }, []);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/equipment`, { withCredentials: true });
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast.error('Failed to load equipment');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      main_parts: formData.main_parts.split('\n').filter(p => p.trim()),
      applications: formData.applications.split('\n').filter(a => a.trim())
    };
    try {
      if (editingEquipment) {
        await axios.put(`${API_URL}/api/equipment/${editingEquipment.id}`, payload, { withCredentials: true });
        toast.success('Equipment updated successfully');
      } else {
        await axios.post(`${API_URL}/api/equipment`, payload, { withCredentials: true });
        toast.success('Equipment created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchEquipment();
    } catch (error) {
      console.error('Error saving equipment:', error);
      toast.error(error.response?.data?.detail || 'Failed to save equipment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) return;
    try {
      await axios.delete(`${API_URL}/api/equipment/${id}`, { withCredentials: true });
      toast.success('Equipment deleted successfully');
      fetchEquipment();
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast.error('Failed to delete equipment');
    }
  };

  const handleEdit = (item) => {
    setEditingEquipment(item);
    setFormData({
      name: item.name, branch: item.branch, year: item.year, semester: item.semester,
      definition: item.definition, working_principle: item.working_principle,
      main_parts: item.main_parts.join('\n'), applications: item.applications.join('\n'),
      exam_notes: item.exam_notes, image_url: item.image_url || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '', branch: 'mechanical', year: 1, semester: 1,
      definition: '', working_principle: '', main_parts: '',
      applications: '', exam_notes: '', image_url: ''
    });
    setEditingEquipment(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="dim-line text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] font-bold text-primary mb-3">
              Console
            </p>
            <h1 className="text-2xl sm:text-4xl md:text-5xl tracking-tighter font-medium text-foreground mb-2 sm:mb-4 font-display" data-testid="admin-title">
              Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-secondary font-mono">
              Manage equipment database ({equipment.length} items)
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => { resetForm(); setIsDialogOpen(true); }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 w-full sm:w-auto justify-center border-2 border-primary font-mono text-xs uppercase tracking-wider"
                data-testid="add-equipment-button"
              >
                <Plus size={20} weight="bold" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-none border-2 border-border mx-4" data-testid="equipment-dialog">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl tracking-tight font-medium text-foreground font-display">
                  {editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mt-4">
                <div>
                  <Label htmlFor="name" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">Equipment Name *</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="mt-2 rounded-none" data-testid="equipment-name-input" />
                </div>
                <div>
                  <Label htmlFor="branch" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">Branch *</Label>
                  <Select value={formData.branch} onValueChange={(value) => setFormData({ ...formData, branch: value })}>
                    <SelectTrigger className="mt-2 rounded-none" data-testid="branch-select"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-none border-2 border-border">
                      {branches.map(b => (<SelectItem key={b.value} value={b.value} className="rounded-none">{b.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="year" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">Year *</Label>
                    <Select value={formData.year.toString()} onValueChange={(value) => setFormData({ ...formData, year: parseInt(value) })}>
                      <SelectTrigger className="mt-2 rounded-none" data-testid="year-select"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-none border-2 border-border">
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="semester" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">Semester *</Label>
                    <Select value={formData.semester.toString()} onValueChange={(value) => setFormData({ ...formData, semester: parseInt(value) })}>
                      <SelectTrigger className="mt-2 rounded-none" data-testid="semester-select"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-none border-2 border-border">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (<SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="definition" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">Definition *</Label>
                  <Textarea id="definition" value={formData.definition} onChange={(e) => setFormData({ ...formData, definition: e.target.value })} required rows={3} className="mt-2 rounded-none" data-testid="definition-input" />
                </div>
                <div>
                  <Label htmlFor="working_principle" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">Working Principle *</Label>
                  <Textarea id="working_principle" value={formData.working_principle} onChange={(e) => setFormData({ ...formData, working_principle: e.target.value })} required rows={3} className="mt-2 rounded-none" data-testid="working-principle-input" />
                </div>
                <div>
                  <Label htmlFor="main_parts" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">Main Parts (one per line) *</Label>
                  <Textarea id="main_parts" value={formData.main_parts} onChange={(e) => setFormData({ ...formData, main_parts: e.target.value })} required rows={4} placeholder="Part 1&#10;Part 2&#10;Part 3" className="mt-2 rounded-none" data-testid="main-parts-input" />
                </div>
                <div>
                  <Label htmlFor="applications" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">Applications (one per line) *</Label>
                  <Textarea id="applications" value={formData.applications} onChange={(e) => setFormData({ ...formData, applications: e.target.value })} required rows={4} placeholder="Application 1&#10;Application 2" className="mt-2 rounded-none" data-testid="applications-input" />
                </div>
                <div>
                  <Label htmlFor="exam_notes" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">Exam Notes *</Label>
                  <Textarea id="exam_notes" value={formData.exam_notes} onChange={(e) => setFormData({ ...formData, exam_notes: e.target.value })} required rows={3} className="mt-2 rounded-none" data-testid="exam-notes-input" />
                </div>
                <div>
                  <Label htmlFor="image_url" className="text-xs font-mono uppercase tracking-wider font-medium text-primary">Image URL (optional)</Label>
                  <Input id="image_url" type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="mt-2 rounded-none" data-testid="image-url-input" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-6 py-2 flex-1" data-testid="submit-equipment-button">
                    {editingEquipment ? 'Update Equipment' : 'Create Equipment'}
                  </Button>
                  <Button type="button" onClick={() => { setIsDialogOpen(false); resetForm(); }} className="bg-transparent border border-border text-foreground hover:bg-muted rounded-none px-6 py-2" data-testid="cancel-button">
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12" data-testid="loading-state">
            <p className="text-base sm:text-lg font-medium text-foreground">Loading equipment...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block border-2 border-border rounded-none overflow-hidden">
              <table className="w-full">
                <thead className="bg-surface border-b-2 border-border">
                  <tr>
                    <th className="text-left p-3 sm:p-4 text-xs font-mono uppercase tracking-[0.2em] font-bold text-primary">Name</th>
                    <th className="text-left p-3 sm:p-4 text-xs font-mono uppercase tracking-[0.2em] font-bold text-primary">Branch</th>
                    <th className="text-left p-3 sm:p-4 text-xs font-mono uppercase tracking-[0.2em] font-bold text-primary">Definition</th>
                    <th className="text-right p-3 sm:p-4 text-xs font-mono uppercase tracking-[0.2em] font-bold text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted" data-testid={`equipment-row-${item.id}`}>
                      <td className="p-3 sm:p-4 font-medium text-foreground text-sm">{item.name}</td>
                      <td className="p-3 sm:p-4 text-sm uppercase text-secondary">{item.branch}</td>
                      <td className="p-3 sm:p-4 text-sm text-secondary max-w-md truncate">{item.definition}</td>
                      <td className="p-3 sm:p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 text-primary hover:bg-primary hover:text-primary-foreground border border-primary rounded-none transition-colors" data-testid={`edit-button-${item.id}`}>
                            <Pencil size={16} weight="bold" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive rounded-none transition-colors" data-testid={`delete-button-${item.id}`}>
                            <Trash size={16} weight="bold" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {equipment.map((item) => (
                <div key={item.id} className="border-2 border-border rounded-none p-4 bg-card" data-testid={`equipment-card-mobile-${item.id}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground truncate">{item.name}</h3>
                      <p className="text-xs uppercase text-primary mt-1">{item.branch}</p>
                      <p className="text-xs text-secondary mt-1 line-clamp-2">{item.definition}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleEdit(item)} className="p-2 text-primary hover:bg-primary hover:text-primary-foreground border border-primary rounded-none transition-colors" data-testid={`edit-button-mobile-${item.id}`}>
                        <Pencil size={14} weight="bold" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive rounded-none transition-colors" data-testid={`delete-button-mobile-${item.id}`}>
                        <Trash size={14} weight="bold" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
