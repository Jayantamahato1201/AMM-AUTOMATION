export interface PartnerCompany {
  id: string;
  name: string;
  website: string;
  displayUrl: string;
  category: string;
  description: string;
  tags: string[];
  establishedRole: string;
}

export const partnerCompanies: PartnerCompany[] = [
  {
    id: 'global-infosoft',
    name: 'Global Infosoft',
    website: 'https://globalinfosofts.com',
    displayUrl: 'globalinfosoft.com',
    category: 'Technology & Digital Solutions Partner',
    description:
      'Global Infosoft is a technology and digital solutions partner, supporting businesses with modern web solutions, software development, digital transformation, and innovative technology services.',
    tags: [
      'Modern Web Solutions',
      'Software Development',
      'Digital Transformation',
      'Innovative Technology Services'
    ],
    establishedRole: 'Digital & Software Solutions Partner'
  }
];
