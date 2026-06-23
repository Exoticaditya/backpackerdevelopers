import { MetadataRoute } from 'next';
import { getApiBaseUrl } from '@/utils/api';
import fs from 'fs';
import path from 'path';

// Cache sitemap at the edge for 1 hour, updating via ISR in the background
export const revalidate = 3600;

// Define the base URL of the site
const BASE_URL = 'https://bagpackers.dev';

interface CaseStudy {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];

  // 1. Static Core Landing Pages
  const staticRoutes = [
    { path: '', file: 'page.tsx' },
    { path: '/about', file: 'about/page.tsx' },
    { path: '/work', file: 'work/page.tsx' },
    { path: '/case-studies', file: 'case-studies/page.tsx' },
    { path: '/sandbox', file: 'sandbox/page.tsx' },
    { path: '/contact', file: 'contact/page.tsx' },
    { path: '/services', file: 'services/page.tsx' },
  ];

  for (const route of staticRoutes) {
    let lastModified = new Date();
    try {
      const filePath = path.join(process.cwd(), 'src/app', route.file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        lastModified = stats.mtime;
      }
    } catch (e) {
      // Fallback to current date
    }

    routes.push({
      url: `${BASE_URL}${route.path}`,
      lastModified: lastModified,
      changeFrequency: route.path === '' ? 'daily' : 'weekly',
      priority: route.path === '' ? 1.0 : 0.8,
    });
  }

  // 2. Dynamic Service Pages (scanned recursively from filesystem directories)
  const getServiceRoutes = (dir: string, currentPrefix = '/services'): MetadataRoute.Sitemap => {
    const foundRoutes: MetadataRoute.Sitemap = [];
    if (!fs.existsSync(dir)) return foundRoutes;

    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        if (item.isDirectory()) {
          const subDir = path.join(dir, item.name);
          const pagePath = path.join(subDir, 'page.tsx');
          const routePath = `${currentPrefix}/${item.name}`;

          if (fs.existsSync(pagePath)) {
            let lastModified = new Date();
            try {
              const stats = fs.statSync(pagePath);
              lastModified = stats.mtime;
            } catch (e) {}

            foundRoutes.push({
              url: `${BASE_URL}${routePath}`,
              lastModified: lastModified,
              changeFrequency: 'weekly',
              priority: 0.8,
            });
          }

          // Recursively find nested routes
          foundRoutes.push(...getServiceRoutes(subDir, routePath));
        }
      }
    } catch (err) {
      console.error(`Error scanning services sub-directory ${dir}:`, err);
    }
    return foundRoutes;
  };

  try {
    const servicesDir = path.join(process.cwd(), 'src/app/services');
    routes.push(...getServiceRoutes(servicesDir));
  } catch (err) {
    console.error('Error starting sitemap service scanner:', err);
  }

  // 3. Dynamic Case Studies Pages (fetched from API with local fallback)
  let cases: CaseStudy[] = [];
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/v1/cases`, {
      next: { revalidate: 3600 } // cache for 1 hour
    });
    if (response.ok) {
      cases = await response.json();
    } else {
      throw new Error('Backend responded with non-200 code');
    }
  } catch (err) {
    console.warn('Backend API offline during sitemap generation. Falling back to default case studies.');
    // Simulated fallback for build-time safety
    cases = [
      {
        slug: 'enterprise-ai-document-ingestion-pipeline',
        updatedAt: new Date().toISOString()
      },
      {
        slug: 'nextjs-client-portal-cms-migration',
        updatedAt: new Date().toISOString()
      }
    ];
  }

  for (const cs of cases) {
    routes.push({
      url: `${BASE_URL}/case-studies/${cs.slug}`,
      lastModified: cs.updatedAt ? new Date(cs.updatedAt) : (cs.createdAt ? new Date(cs.createdAt) : new Date()),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return routes;
}
