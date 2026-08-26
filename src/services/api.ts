import {
  ServiceItem,
  IndustryItem,
  PartnerCompanyItem,
  EnquiryItem,
  QuoteRequestItem,
  TestimonialItem,
  NewsletterSubscriberItem,
  WebsiteContent,
  AdminUser
} from '../types.js';
import {
  initialServices,
  initialIndustries,
  initialPartners,
  initialWebsiteContent
} from '../data/initialData.js';

const API_BASE = '/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('amm_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// LocalStorage helpers for resilient offline/caching fallback
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
    console.warn('[Cache] LocalStorage save failed:', err);
  }
}

// Safely parse JSON from a fetch Response, avoiding "Unexpected token <" HTML errors
async function parseJsonSafely<T>(res: Response, fallbackError: string): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || fallbackError);
      }
      return data as T;
    } catch (err: any) {
      if (err.message && !err.message.includes('Unexpected token')) {
        throw err;
      }
      throw new Error(fallbackError);
    }
  }

  // Handle non-JSON response (e.g. HTML 404/500)
  if (!res.ok) {
    throw new Error(`${fallbackError} (${res.status})`);
  }
  throw new Error(`${fallbackError}: Received non-JSON response format.`);
}

export interface AISolutionAdviceResult {
  success: boolean;
  source: 'gemini' | 'rule-engine';
  recommendation: string;
  recommendedServices: string[];
  suggestedSafetyLevel: string;
  keyConsiderations: string[];
}

export const api = {
  // --- Auth ---
  async login(email: string, password: string): Promise<{ token: string; refreshToken?: string; user: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await parseJsonSafely<{ token: string; refreshToken?: string; user: AdminUser; error?: string }>(
      res,
      'Authentication failed. Please check credentials.'
    );

    if (data.token) {
      localStorage.setItem('amm_admin_token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('amm_admin_refresh_token', data.refreshToken);
      }
    }
    return data;
  },

  async getMe(): Promise<{ user: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return parseJsonSafely<{ user: AdminUser }>(res, 'Unauthorized');
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return parseJsonSafely<{ message: string }>(res, 'Failed to update password.');
  },

  logout(): void {
    localStorage.removeItem('amm_admin_token');
    localStorage.removeItem('amm_admin_refresh_token');
  },

  // --- Health Check ---
  async getHealth(): Promise<{ status: string; uptimeSeconds: number; database: any }> {
    const res = await fetch(`${API_BASE}/health`);
    return parseJsonSafely(res, 'Health check failed');
  },

  // --- Partner Companies ---
  async getPartners(all = false): Promise<PartnerCompanyItem[]> {
    try {
      const url = all ? `${API_BASE}/partners?all=true` : `${API_BASE}/partners`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await parseJsonSafely<PartnerCompanyItem[]>(res, 'Failed to parse partners');
        if (Array.isArray(data)) {
          setLocalItem('amm_partners_cache', data);
          return data;
        }
      }
    } catch (err) {
      console.warn('[API] /api/partners fetch failed, using cached or initial partners:', err);
    }
    return getLocalItem('amm_partners_cache', initialPartners);
  },

  async getPartnerBySlug(idOrSlug: string): Promise<PartnerCompanyItem> {
    try {
      const res = await fetch(`${API_BASE}/partners/${encodeURIComponent(idOrSlug)}`);
      if (res.ok) {
        return await parseJsonSafely<PartnerCompanyItem>(res, 'Failed to parse partner details');
      }
    } catch (err) {
      console.warn(`[API] /api/partners/${idOrSlug} fetch failed:`, err);
    }
    const partners = await this.getPartners(true);
    const found = partners.find(
      p => p.slug.toLowerCase() === idOrSlug.toLowerCase() || p.id === idOrSlug
    );
    if (!found) throw new Error('Partner company record not found.');
    return found;
  },

  async createPartner(data: Partial<PartnerCompanyItem>): Promise<PartnerCompanyItem> {
    const res = await fetch(`${API_BASE}/partners`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return parseJsonSafely<PartnerCompanyItem>(res, 'Failed to create partner company.');
  },

  async updatePartner(id: string, data: Partial<PartnerCompanyItem>): Promise<PartnerCompanyItem> {
    const res = await fetch(`${API_BASE}/partners/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return parseJsonSafely<PartnerCompanyItem>(res, 'Failed to update partner company.');
  },

  async deletePartner(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/partners/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await parseJsonSafely<{ error?: string }>(res, 'Failed to delete partner company.').catch(() => ({ error: 'Failed to delete partner company.' }));
      throw new Error(err.error || 'Failed to delete partner company.');
    }
    const cached = getLocalItem<PartnerCompanyItem[]>('amm_partners_cache', []);
    if (Array.isArray(cached)) {
      setLocalItem('amm_partners_cache', cached.filter(p => p.id !== id && p.slug !== id));
    }
  },

  // --- Services / Solutions ---
  async getServices(all = false): Promise<ServiceItem[]> {
    try {
      const url = all ? `${API_BASE}/services?all=true` : `${API_BASE}/services`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await parseJsonSafely<ServiceItem[]>(res, 'Failed to parse services');
        if (Array.isArray(data)) {
          setLocalItem('amm_services_cache', data);
          return data;
        }
      }
    } catch (err) {
      console.warn('[API] /api/services unavailable, using local cache fallback');
    }
    return getLocalItem('amm_services_cache', initialServices);
  },

  async getServiceBySlug(slug: string): Promise<ServiceItem> {
    try {
      const res = await fetch(`${API_BASE}/services/${slug}`);
      if (res.ok) {
        return await parseJsonSafely<ServiceItem>(res, 'Service solution not found');
      }
    } catch (err) {
      console.warn(`[API] /api/services/${slug} fetch error, checking local dataset`);
    }
    const services = await this.getServices(true);
    const found = services.find(s => s.slug.toLowerCase() === slug.toLowerCase() || s.id === slug);
    if (!found) throw new Error('Service solution not found.');
    return found;
  },

  async createService(data: Partial<ServiceItem>): Promise<ServiceItem> {
    const res = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return parseJsonSafely<ServiceItem>(res, 'Failed to create service.');
  },

  async updateService(id: string, data: Partial<ServiceItem>): Promise<ServiceItem> {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return parseJsonSafely<ServiceItem>(res, 'Failed to update service.');
  },

  async deleteService(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await parseJsonSafely<{ error?: string }>(res, 'Failed to delete service.').catch(() => ({ error: 'Failed to delete service.' }));
      throw new Error(err.error || 'Failed to delete service.');
    }
    const cached = getLocalItem<ServiceItem[]>('amm_services_cache', []);
    if (Array.isArray(cached)) {
      setLocalItem('amm_services_cache', cached.filter(s => s.id !== id && s.slug !== id));
    }
  },

  // --- Industries ---
  async getIndustries(all = false): Promise<IndustryItem[]> {
    try {
      const url = all ? `${API_BASE}/industries?all=true` : `${API_BASE}/industries`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await parseJsonSafely<IndustryItem[]>(res, 'Failed to parse industries');
        if (Array.isArray(data)) {
          setLocalItem('amm_industries_cache', data);
          return data;
        }
      }
    } catch (err) {
      console.warn('[API] /api/industries unavailable, using local cache fallback');
    }
    return getLocalItem('amm_industries_cache', initialIndustries);
  },

  async getIndustryBySlug(slug: string): Promise<IndustryItem> {
    try {
      const res = await fetch(`${API_BASE}/industries/${slug}`);
      if (res.ok) {
        return await parseJsonSafely<IndustryItem>(res, 'Industry domain profile not found');
      }
    } catch (err) {
      console.warn(`[API] /api/industries/${slug} unavailable, using local lookup`);
    }
    const industries = await this.getIndustries(true);
    const found = industries.find(i => i.slug.toLowerCase() === slug.toLowerCase() || i.id === slug);
    if (!found) throw new Error('Industry domain profile not found.');
    return found;
  },

  async createIndustry(data: Partial<IndustryItem>): Promise<IndustryItem> {
    const res = await fetch(`${API_BASE}/industries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return parseJsonSafely<IndustryItem>(res, 'Failed to create industry.');
  },

  async updateIndustry(id: string, data: Partial<IndustryItem>): Promise<IndustryItem> {
    const res = await fetch(`${API_BASE}/industries/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return parseJsonSafely<IndustryItem>(res, 'Failed to update industry.');
  },

  async deleteIndustry(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/industries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await parseJsonSafely<{ error?: string }>(res, 'Failed to delete industry.').catch(() => ({ error: 'Failed to delete industry.' }));
      throw new Error(err.error || 'Failed to delete industry.');
    }
    const cached = getLocalItem<IndustryItem[]>('amm_industries_cache', []);
    if (Array.isArray(cached)) {
      setLocalItem('amm_industries_cache', cached.filter(i => i.id !== id && i.slug !== id));
    }
  },

  // --- Contact Inquiries ---
  async submitContactInquiry(data: {
    name: string;
    companyName?: string;
    email: string;
    phone: string;
    subject?: string;
    service?: string;
    serviceInterest?: string;
    message: string;
  }): Promise<{ message: string; inquiryId?: string; id?: string }> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return parseJsonSafely<{ message: string; inquiryId?: string; id?: string }>(
      res,
      'Failed to submit contact message. Please check inputs.'
    );
  },

  // Legacy alias
  async submitEnquiry(data: {
    name: string;
    companyName?: string;
    email: string;
    phone: string;
    subject?: string;
    service?: string;
    message: string;
  }): Promise<{ message: string; enquiryId?: string }> {
    return this.submitContactInquiry(data) as any;
  },

  async getInquiries(): Promise<EnquiryItem[]> {
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await parseJsonSafely<EnquiryItem[]>(res, 'Failed to parse inquiries');
        if (Array.isArray(data)) return data;
      }
    } catch (err) {
      console.warn('[API] /api/contact fetch inquiries error:', err);
    }
    return [];
  },

  async updateInquiry(id: string, data: Partial<EnquiryItem>): Promise<EnquiryItem> {
    const res = await fetch(`${API_BASE}/contact/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return parseJsonSafely<EnquiryItem>(res, 'Failed to update inquiry.');
  },

  async deleteInquiry(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/contact/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await parseJsonSafely<{ error?: string }>(res, 'Failed to delete inquiry.').catch(() => ({ error: 'Failed to delete inquiry.' }));
      throw new Error(err.error || 'Failed to delete inquiry.');
    }
  },

  // --- Quote Requests (RFQs) ---
  async submitQuoteRequest(data: {
    name: string;
    email: string;
    phone: string;
    companyName?: string;
    industry?: string;
    requiredService: string;
    projectDescription: string;
    estimatedBudget?: string;
    preferredContactMethod?: 'email' | 'phone' | 'whatsapp';
  }): Promise<{ message: string; quoteId?: string; id?: string }> {
    const res = await fetch(`${API_BASE}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return parseJsonSafely<{ message: string; quoteId?: string; id?: string }>(
      res,
      'Failed to submit quote request.'
    );
  },

  async getQuotes(): Promise<QuoteRequestItem[]> {
    try {
      const res = await fetch(`${API_BASE}/quotes`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await parseJsonSafely<QuoteRequestItem[]>(res, 'Failed to parse quotes');
        if (Array.isArray(data)) return data;
      }
    } catch (err) {
      console.warn('[API] /api/quotes fetch error:', err);
    }
    return [];
  },

  async updateQuote(id: string, data: Partial<QuoteRequestItem>): Promise<QuoteRequestItem> {
    const res = await fetch(`${API_BASE}/quotes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return parseJsonSafely<QuoteRequestItem>(res, 'Failed to update quote.');
  },

  async deleteQuote(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/quotes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await parseJsonSafely<{ error?: string }>(res, 'Failed to delete quote.').catch(() => ({ error: 'Failed to delete quote.' }));
      throw new Error(err.error || 'Failed to delete quote.');
    }
  },

  // --- Testimonials ---
  async getTestimonials(all = false): Promise<TestimonialItem[]> {
    try {
      const url = all ? `${API_BASE}/testimonials?all=true` : `${API_BASE}/testimonials`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await parseJsonSafely<TestimonialItem[]>(res, 'Failed to parse testimonials');
        if (Array.isArray(data)) return data;
      }
    } catch (err) {
      console.warn('[API] /api/testimonials fetch failed:', err);
    }
    return [];
  },

  async createTestimonial(data: Partial<TestimonialItem>): Promise<TestimonialItem> {
    const res = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return parseJsonSafely<TestimonialItem>(res, 'Failed to create testimonial.');
  },

  async updateTestimonial(id: string, data: Partial<TestimonialItem>): Promise<TestimonialItem> {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return parseJsonSafely<TestimonialItem>(res, 'Failed to update testimonial.');
  },

  async deleteTestimonial(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete testimonial.');
  },

  // --- Newsletter ---
  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return parseJsonSafely<{ success: boolean; message: string }>(res, 'Subscription failed.');
  },

  async getNewsletterSubscribers(): Promise<NewsletterSubscriberItem[]> {
    const res = await fetch(`${API_BASE}/newsletter/subscribers`, {
      headers: getAuthHeaders()
    });
    return parseJsonSafely<NewsletterSubscriberItem[]>(res, 'Failed to load subscribers.');
  },

  // --- Image & Media Uploads ---
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('amm_admin_token');
    const res = await fetch(`${API_BASE}/uploads`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });

    return parseJsonSafely<{ url: string; filename: string }>(res, 'Image upload failed.');
  },

  async uploadMedia(file: File, relatedSection?: string, altText?: string): Promise<{ url: string; id: string; fileName: string; fileSize: number }> {
    const formData = new FormData();
    formData.append('image', file);
    if (relatedSection) formData.append('relatedSection', relatedSection);
    if (altText) formData.append('altText', altText);

    const token = localStorage.getItem('amm_admin_token');
    const res = await fetch(`${API_BASE}/admin/media/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });

    return parseJsonSafely<{ url: string; id: string; fileName: string; fileSize: number }>(res, 'Media upload failed.');
  },

  async getMediaList(): Promise<Array<{ id: string; fileName: string; publicUrl: string; fileSize: number; mimeType: string; altText?: string; relatedSection?: string; createdAt: string }>> {
    const res = await fetch(`${API_BASE}/admin/media`, {
      headers: getAuthHeaders()
    });
    return parseJsonSafely(res, 'Failed to fetch media library.');
  },

  async deleteMedia(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete media asset.');
  },

  // --- Website Content & Settings ---
  async getSettings(): Promise<WebsiteContent> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (res.ok) {
        const data = await parseJsonSafely<WebsiteContent>(res, 'Failed to parse settings');
        if (data && typeof data === 'object') {
          setLocalItem('amm_content_cache', data);
          return data;
        }
      }
    } catch (err) {
      console.warn('[API] /api/settings unavailable, using cache fallback');
    }
    return getLocalItem('amm_content_cache', initialWebsiteContent);
  },

  async getContent(): Promise<WebsiteContent> {
    return this.getSettings();
  },

  async updateSettings(data: Partial<WebsiteContent>): Promise<WebsiteContent> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await parseJsonSafely<WebsiteContent>(res, 'Failed to update settings.');
    setLocalItem('amm_content_cache', result);
    return result;
  },

  async updateContent(data: Partial<WebsiteContent>): Promise<WebsiteContent> {
    return this.updateSettings(data);
  },

  // --- Statistics ---
  async getStats(): Promise<{
    totalServices: number;
    activeServices: number;
    totalIndustries: number;
    activeIndustries: number;
    totalPartnerCompanies: number;
    activePartners: number;
    totalInquiries: number;
    newInquiries: number;
    totalQuoteRequests: number;
    pendingQuoteRequests: number;
    totalTestimonials: number;
    totalSubscribers: number;
    // Legacy compatibility
    totalEnquiries?: number;
    newEnquiries?: number;
  }> {
    try {
      const res = await fetch(`${API_BASE}/stats`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await parseJsonSafely<any>(res, 'Failed to parse statistics');
        if (data && typeof data === 'object') {
          return data;
        }
      }
    } catch (err) {
      console.warn('[API] /api/stats fetch failed, calculating from local cache:', err);
    }

    const services = getLocalItem('amm_services_cache', initialServices);
    const industries = getLocalItem('amm_industries_cache', initialIndustries);
    const partners = getLocalItem('amm_partners_cache', initialPartners);

    return {
      totalServices: services.length,
      activeServices: services.filter(s => s.isActive).length,
      totalIndustries: industries.length,
      activeIndustries: industries.filter(i => i.isActive).length,
      totalPartnerCompanies: partners.length,
      activePartners: partners.filter(p => p.isActive).length,
      totalInquiries: 0,
      newInquiries: 0,
      totalQuoteRequests: 0,
      pendingQuoteRequests: 0,
      totalTestimonials: 0,
      totalSubscribers: 0,
      totalEnquiries: 0,
      newEnquiries: 0
    };
  },

  // --- AI Solution Advisor (Gemini 3.7 Flash) ---
  async getAISolutionAdvice(params: {
    query: string;
    industry?: string;
    plantType?: string;
  }): Promise<AISolutionAdviceResult> {
    const res = await fetch(`${API_BASE}/ai/solution-advisor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    return parseJsonSafely<AISolutionAdviceResult>(res, 'AI Advisor unavailable at this time.');
  }
};
