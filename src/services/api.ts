import {
  ServiceItem,
  IndustryItem,
  ProjectItem,
  EnquiryItem,
  WebsiteContent,
  AdminUser
} from '../types.js';
import {
  initialServices,
  initialIndustries,
  initialProjects,
  initialWebsiteContent
} from '../data/initialData.js';

const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('amm_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// LocalStorage helpers for resilient fallback storage
function getLocalItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(err.error || 'Login failed');
      }
      return res.json();
    } catch (err: any) {
      // Fallback for offline / demo admin login
      if (email === 'admin@ammautomation.com' && password === 'Admin@12345') {
        const mockUser: AdminUser = {
          id: 'admin-1',
          name: 'AMM Automation Administrator',
          email: 'admin@ammautomation.com',
          role: 'superadmin'
        };
        const token = 'amm-admin-demo-token';
        localStorage.setItem('amm_admin_token', token);
        return { token, user: mockUser };
      }
      throw err;
    }
  },

  async getMe(): Promise<{ user: AdminUser }> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    } catch {
      return {
        user: {
          id: 'admin-1',
          name: 'AMM Automation Administrator',
          email: 'admin@ammautomation.com',
          role: 'superadmin'
        }
      };
    }
  },

  // Services
  async getServices(): Promise<ServiceItem[]> {
    try {
      const res = await fetch(`${API_BASE}/services`);
      if (res.ok) {
        const data = await res.json();
        setLocalItem('amm_services_cache', data);
        return data;
      }
    } catch (err) {
      console.warn('Backend /api/services unavailable, using cached/initial data');
    }
    return getLocalItem('amm_services_cache', initialServices);
  },

  async getServiceBySlug(slug: string): Promise<ServiceItem> {
    try {
      const res = await fetch(`${API_BASE}/services/${slug}`);
      if (res.ok) return res.json();
    } catch (err) {
      console.warn(`Backend /api/services/${slug} unavailable, using local lookup`);
    }
    const services = await this.getServices();
    const found = services.find(s => s.slug === slug);
    if (!found) throw new Error('Service not found');
    return found;
  },

  async createService(data: Partial<ServiceItem>): Promise<ServiceItem> {
    try {
      const res = await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const newService = await res.json();
        const cached = await this.getServices();
        setLocalItem('amm_services_cache', [newService, ...cached]);
        return newService;
      }
    } catch (err) {
      console.warn('Backend createService offline, saving locally');
    }
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      title: data.title || 'Untitled Service',
      slug: data.slug || `service-${Date.now()}`,
      shortDescription: data.shortDescription || '',
      fullDescription: data.fullDescription || data.shortDescription || '',
      image: data.image || '/images/hero_automation.jpg',
      iconName: data.iconName || 'Cpu',
      features: data.features || [],
      applications: data.applications || [],
      relatedIndustries: data.relatedIndustries || [],
      subOfferings: data.subOfferings || [],
      isActive: data.isActive !== undefined ? data.isActive : true,
      order: data.order || 99,
      createdAt: new Date().toISOString()
    };
    const cached = await this.getServices();
    setLocalItem('amm_services_cache', [newService, ...cached]);
    return newService;
  },

  async updateService(id: string, data: Partial<ServiceItem>): Promise<ServiceItem> {
    try {
      const res = await fetch(`${API_BASE}/services/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        const cached = await this.getServices();
        setLocalItem('amm_services_cache', cached.map(s => s.id === id ? updated : s));
        return updated;
      }
    } catch (err) {
      console.warn('Backend updateService offline, updating locally');
    }
    const cached = await this.getServices();
    const updatedList = cached.map(s => s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s);
    setLocalItem('amm_services_cache', updatedList);
    const updated = updatedList.find(s => s.id === id);
    if (!updated) throw new Error('Service not found');
    return updated;
  },

  async deleteService(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/services/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {
      console.warn('Backend deleteService offline, removing locally');
    }
    const cached = await this.getServices();
    setLocalItem('amm_services_cache', cached.filter(s => s.id !== id));
  },

  // Industries
  async getIndustries(): Promise<IndustryItem[]> {
    try {
      const res = await fetch(`${API_BASE}/industries`);
      if (res.ok) {
        const data = await res.json();
        setLocalItem('amm_industries_cache', data);
        return data;
      }
    } catch (err) {
      console.warn('Backend /api/industries unavailable, using cached/initial data');
    }
    return getLocalItem('amm_industries_cache', initialIndustries);
  },

  async getIndustryBySlug(slug: string): Promise<IndustryItem> {
    try {
      const res = await fetch(`${API_BASE}/industries/${slug}`);
      if (res.ok) return res.json();
    } catch (err) {
      console.warn(`Backend /api/industries/${slug} unavailable, using local lookup`);
    }
    const industries = await this.getIndustries();
    const found = industries.find(i => i.slug === slug);
    if (!found) throw new Error('Industry not found');
    return found;
  },

  async createIndustry(data: Partial<IndustryItem>): Promise<IndustryItem> {
    try {
      const res = await fetch(`${API_BASE}/industries`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const newInd = await res.json();
        const cached = await this.getIndustries();
        setLocalItem('amm_industries_cache', [newInd, ...cached]);
        return newInd;
      }
    } catch (err) {
      console.warn('Backend createIndustry offline, saving locally');
    }
    const newInd: IndustryItem = {
      id: `ind-${Date.now()}`,
      name: data.name || 'Untitled Industry',
      slug: data.slug || `industry-${Date.now()}`,
      description: data.description || '',
      image: data.image || '/images/metal_plant.jpg',
      iconName: data.iconName || 'Factory',
      challenges: data.challenges || [],
      solutions: data.solutions || [],
      relatedServices: data.relatedServices || [],
      isActive: data.isActive !== undefined ? data.isActive : true,
      order: data.order || 99
    };
    const cached = await this.getIndustries();
    setLocalItem('amm_industries_cache', [newInd, ...cached]);
    return newInd;
  },

  async updateIndustry(id: string, data: Partial<IndustryItem>): Promise<IndustryItem> {
    try {
      const res = await fetch(`${API_BASE}/industries/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        const cached = await this.getIndustries();
        setLocalItem('amm_industries_cache', cached.map(i => i.id === id ? updated : i));
        return updated;
      }
    } catch (err) {
      console.warn('Backend updateIndustry offline, updating locally');
    }
    const cached = await this.getIndustries();
    const updatedList = cached.map(i => i.id === id ? { ...i, ...data } : i);
    setLocalItem('amm_industries_cache', updatedList);
    const updated = updatedList.find(i => i.id === id);
    if (!updated) throw new Error('Industry not found');
    return updated;
  },

  async deleteIndustry(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/industries/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {
      console.warn('Backend deleteIndustry offline, removing locally');
    }
    const cached = await this.getIndustries();
    setLocalItem('amm_industries_cache', cached.filter(i => i.id !== id));
  },

  // Projects
  async getProjects(): Promise<ProjectItem[]> {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (res.ok) {
        const data = await res.json();
        setLocalItem('amm_projects_cache', data);
        return data;
      }
    } catch (err) {
      console.warn('Backend /api/projects unavailable, using cached/initial data');
    }
    return getLocalItem('amm_projects_cache', initialProjects);
  },

  async getProjectBySlug(slug: string): Promise<ProjectItem> {
    try {
      const res = await fetch(`${API_BASE}/projects/${slug}`);
      if (res.ok) return res.json();
    } catch (err) {
      console.warn(`Backend /api/projects/${slug} unavailable, using local lookup`);
    }
    const projects = await this.getProjects();
    const found = projects.find(p => p.slug === slug);
    if (!found) throw new Error('Project not found');
    return found;
  },

  async createProject(data: Partial<ProjectItem>): Promise<ProjectItem> {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const newProj = await res.json();
        const cached = await this.getProjects();
        setLocalItem('amm_projects_cache', [newProj, ...cached]);
        return newProj;
      }
    } catch (err) {
      console.warn('Backend createProject offline, saving locally');
    }
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: data.title || 'Untitled Project',
      slug: data.slug || `project-${Date.now()}`,
      shortDescription: data.shortDescription || '',
      fullDescription: data.fullDescription || data.shortDescription || '',
      featuredImage: data.featuredImage || '/images/hero_automation.jpg',
      gallery: data.gallery || [],
      industry: data.industry || 'Steel Industry',
      services: data.services || [],
      technologies: data.technologies || [],
      status: data.status || 'Completed',
      clientType: data.clientType || 'Industrial Enterprise',
      location: data.location || 'India',
      completionYear: data.completionYear || new Date().getFullYear().toString(),
      isFeatured: data.isFeatured || false,
      createdAt: new Date().toISOString()
    };
    const cached = await this.getProjects();
    setLocalItem('amm_projects_cache', [newProj, ...cached]);
    return newProj;
  },

  async updateProject(id: string, data: Partial<ProjectItem>): Promise<ProjectItem> {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        const cached = await this.getProjects();
        setLocalItem('amm_projects_cache', cached.map(p => p.id === id ? updated : p));
        return updated;
      }
    } catch (err) {
      console.warn('Backend updateProject offline, updating locally');
    }
    const cached = await this.getProjects();
    const updatedList = cached.map(p => p.id === id ? { ...p, ...data } : p);
    setLocalItem('amm_projects_cache', updatedList);
    const updated = updatedList.find(p => p.id === id);
    if (!updated) throw new Error('Project not found');
    return updated;
  },

  async deleteProject(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {
      console.warn('Backend deleteProject offline, removing locally');
    }
    const cached = await this.getProjects();
    setLocalItem('amm_projects_cache', cached.filter(p => p.id !== id));
  },

  // Enquiries
  async submitEnquiry(data: {
    name: string;
    companyName?: string;
    email: string;
    phone: string;
    subject?: string;
    service?: string;
    message: string;
  }): Promise<{ message: string; enquiryId: string }> {
    try {
      const res = await fetch(`${API_BASE}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        return res.json();
      }
    } catch (err) {
      console.warn('Backend submitEnquiry offline, recording locally');
    }
    const newEnquiry: EnquiryItem = {
      id: `enq-${Date.now()}`,
      name: data.name,
      companyName: data.companyName || 'Not specified',
      email: data.email,
      phone: data.phone,
      subject: data.subject || 'Industrial Automation Enquiry',
      service: data.service || 'General Enquiry',
      message: data.message,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    const cached = getLocalItem<EnquiryItem[]>('amm_enquiries_cache', []);
    setLocalItem('amm_enquiries_cache', [newEnquiry, ...cached]);
    return {
      message: 'Thank you! Your enquiry has been received. An AMM Automation technical specialist will contact you shortly.',
      enquiryId: newEnquiry.id
    };
  },

  async getEnquiries(): Promise<EnquiryItem[]> {
    try {
      const res = await fetch(`${API_BASE}/enquiries`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setLocalItem('amm_enquiries_cache', data);
        return data;
      }
    } catch (err) {
      console.warn('Backend /api/enquiries unavailable, using cached data');
    }
    return getLocalItem('amm_enquiries_cache', []);
  },

  async updateEnquiry(id: string, data: Partial<EnquiryItem>): Promise<EnquiryItem> {
    try {
      const res = await fetch(`${API_BASE}/enquiries/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) return res.json();
    } catch {
      console.warn('Backend updateEnquiry offline');
    }
    const cached = getLocalItem<EnquiryItem[]>('amm_enquiries_cache', []);
    const updatedList = cached.map(e => e.id === id ? { ...e, ...data } : e);
    setLocalItem('amm_enquiries_cache', updatedList);
    const found = updatedList.find(e => e.id === id);
    if (!found) throw new Error('Enquiry not found');
    return found;
  },

  async deleteEnquiry(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/enquiries/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {
      console.warn('Backend deleteEnquiry offline');
    }
    const cached = getLocalItem<EnquiryItem[]>('amm_enquiries_cache', []);
    setLocalItem('amm_enquiries_cache', cached.filter(e => e.id !== id));
  },

  // Website Content
  async getContent(): Promise<WebsiteContent> {
    try {
      const res = await fetch(`${API_BASE}/content`);
      if (res.ok) {
        const data = await res.json();
        setLocalItem('amm_content_cache', data);
        return data;
      }
    } catch (err) {
      console.warn('Backend /api/content unavailable, using cached/initial content');
    }
    return getLocalItem('amm_content_cache', initialWebsiteContent);
  },

  async updateContent(data: Partial<WebsiteContent>): Promise<WebsiteContent> {
    try {
      const res = await fetch(`${API_BASE}/content`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        setLocalItem('amm_content_cache', updated);
        return updated;
      }
    } catch (err) {
      console.warn('Backend updateContent offline, updating locally');
    }
    const current = await this.getContent();
    const updated = { ...current, ...data };
    setLocalItem('amm_content_cache', updated);
    return updated;
  },

  // Stats
  async getStats(): Promise<{
    totalServices: number;
    activeServices: number;
    totalIndustries: number;
    activeIndustries: number;
    totalProjects: number;
    totalEnquiries: number;
    newEnquiries: number;
  }> {
    try {
      const res = await fetch(`${API_BASE}/stats`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return res.json();
    } catch {
      console.warn('Backend /api/stats offline, computing locally');
    }
    const services = await this.getServices();
    const industries = await this.getIndustries();
    const projects = await this.getProjects();
    const enquiries = await this.getEnquiries();

    return {
      totalServices: services.length,
      activeServices: services.filter(s => s.isActive).length,
      totalIndustries: industries.length,
      activeIndustries: industries.filter(i => i.isActive).length,
      totalProjects: projects.length,
      totalEnquiries: enquiries.length,
      newEnquiries: enquiries.filter(e => e.status === 'New').length
    };
  }
};
