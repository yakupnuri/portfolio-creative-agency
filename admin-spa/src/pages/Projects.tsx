import React, { useEffect, useMemo, useState } from 'react';
import { Icons } from '../constants';
import { UserRole } from '../types';
import { useAuth } from '../App';
import { apiService } from '../services/api';

type Project = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  galleryUrls?: string[];
  published: boolean;
  isDeleted: boolean;
  updatedAt: string;
};

const Projects: React.FC = () => {
  const { auth } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    apiService.get('/admin/projects').then(items => {
      const mapped: Project[] = items.map((p: any) => ({
        id: p._id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        coverImageUrl: p.coverImage,
        galleryUrls: p.galleryImages || [],
        published: !!p.published,
        isDeleted: !!p.isDeleted,
        updatedAt: p.updatedAt
      }));
      setProjects(mapped);
    }).catch(() => {});
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDeleted = showDeleted ? p.isDeleted : !p.isDeleted;
      return matchesSearch && matchesDeleted;
    });
  }, [projects, searchTerm, showDeleted]);

  const togglePublish = (id: string, next: boolean) => {
    if (auth.user?.role !== UserRole.OWNER) {
       alert("Only owner can publish/unpublish.");
       return;
    }
    apiService.patch(`/admin/projects/${id}/publish`, { published: next }).then(() => {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, published: next, updatedAt: new Date().toISOString() } : p));
    }).catch(() => {});
  };

  const softDelete = (id: string) => {
    if (auth.user?.role === UserRole.EDITOR) {
      alert("Editors cannot delete projects.");
      return;
    }
    apiService.delete?.(`/admin/projects/${id}` as any, undefined as any);
    setProjects(prev => prev.map(p => p.id === id ? { ...p, isDeleted: true, published: false } : p));
  };

  const restore = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, isDeleted: false } : p));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Projects</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your portfolio items and case studies.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all">
          {Icons.Add}
          Create New Project
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-brand-divider shadow-sm space-y-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {Icons.Search}
            </span>
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full pl-12 pr-4 py-3 bg-brand-bg border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowDeleted(!showDeleted)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                showDeleted ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-brand-divider hover:border-brand-primary/40'
              }`}
            >
              {showDeleted ? 'Showing Bin' : 'View Deleted'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-widest font-black text-slate-400 border-b border-brand-divider">
                <th className="pb-4 px-4">Project Info</th>
                <th className="pb-4 px-4">Status</th>
                <th className="pb-4 px-4">Date</th>
                <th className="pb-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-divider">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="group">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-xl bg-slate-100 overflow-hidden ring-1 ring-brand-divider">
                        <img src={project.coverImageUrl || 'https://picsum.photos/seed/placeholder/400/300'} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{project.title}</p>
                        <p className="text-xs text-slate-500">/{project.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${
                      project.published ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-brand-bg'
                    }`}>
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-xs text-slate-500 font-medium">{new Date(project.updatedAt).toLocaleDateString()}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {!project.isDeleted ? (
                        <>
                          {auth.user?.role === UserRole.OWNER && (
                            <button 
                              onClick={() => togglePublish(project.id, !project.published)}
                              className={`p-2 rounded-lg transition-colors ${project.published ? 'text-slate-400 hover:text-brand-cta' : 'text-brand-primary hover:bg-brand-primary/10'}`}
                              title={project.published ? 'Unpublish' : 'Publish'}
                            >
                              {Icons.Publish}
                            </button>
                          )}
                          <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-bg rounded-lg transition-colors">
                            {Icons.Edit}
                          </button>
                          {auth.user?.role !== UserRole.EDITOR && (
                            <button onClick={() => softDelete(project.id)} className="p-2 text-slate-400 hover:text-brand-cta hover:bg-brand-cta/10 rounded-lg transition-colors">
                              {Icons.Delete}
                            </button>
                          )}
                        </>
                      ) : (
                        <button onClick={() => restore(project.id)} className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg font-bold text-xs uppercase transition-colors">
                          Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Projects;
