import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  ServiceItem,
  IndustryItem,
  PartnerCompanyItem,
  WebsiteContent,
  TestimonialItem
} from '../types.js';
import { api } from '../services/api.js';
import {
  initialServices,
  initialIndustries,
  initialPartners,
  initialWebsiteContent
} from '../data/initialData.js';

interface DataContextType {
  services: ServiceItem[];
  industries: IndustryItem[];
  partners: PartnerCompanyItem[];
  testimonials: TestimonialItem[];
  content: WebsiteContent | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  isQuoteModalOpen: boolean;
  openQuoteModal: (presetService?: string) => void;
  closeQuoteModal: () => void;
  selectedQuoteService: string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with complete fallback data right away to prevent empty render states
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [industries, setIndustries] = useState<IndustryItem[]>(initialIndustries);
  const [partners, setPartners] = useState<PartnerCompanyItem[]>(initialPartners);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [content, setContent] = useState<WebsiteContent>(initialWebsiteContent);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [selectedQuoteService, setSelectedQuoteService] = useState<string>('');

  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);
    try {
      const [srvs, inds, parts, tests, cont] = await Promise.all([
        api.getServices(),
        api.getIndustries(),
        api.getPartners(),
        api.getTestimonials(),
        api.getContent()
      ]);
      if (srvs && srvs.length > 0) setServices(srvs);
      if (inds && inds.length > 0) setIndustries(inds);
      if (parts && parts.length > 0) setPartners(parts);
      if (tests && tests.length > 0) setTestimonials(tests);
      if (cont) setContent(cont);
      setError(null);
    } catch (err: any) {
      console.warn('Data sync warning:', err?.message || err);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      retryTimerRef.current = setTimeout(() => {
        fetchData(true);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, [fetchData]);

  const openQuoteModal = (presetService?: string) => {
    setSelectedQuoteService(presetService || '');
    setIsQuoteModalOpen(true);
  };

  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  return (
    <DataContext.Provider
      value={{
        services,
        industries,
        partners,
        testimonials,
        content,
        isLoading,
        error,
        refreshData: () => fetchData(false),
        isQuoteModalOpen,
        openQuoteModal,
        closeQuoteModal,
        selectedQuoteService
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
