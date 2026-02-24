export interface NavLink {
  label: string;
  route: string;
  icon?: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', route: '/' },
  { label: 'Services', route: '/services' },
  { label: 'Pricing', route: '/pricing' },
  { label: 'FAQ', route: '/faq' },
  { label: 'Contact', route: '/contact' }
];

export const FOOTER_QUICK_LINKS: NavLink[] = [...NAV_LINKS];

export const FOOTER_COMPANY_LINKS: NavLink[] = [
  { label: 'About', route: '#' },
  { label: 'Careers', route: '#' },
  { label: 'Blog', route: '#' }
];

export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: 'Privacy Policy', route: '#' },
  { label: 'Terms of Service', route: '#' },
  { label: 'Cookie Policy', route: '#' }
];

export const FOOTER_BRAND = {
  name: 'VelocityAI',
  tagline: 'AI Automation that Accelerates',
  description: 'Transform your business operations with intelligent AI agents that work 24/7, scale instantly, and never miss a beat.'
};
