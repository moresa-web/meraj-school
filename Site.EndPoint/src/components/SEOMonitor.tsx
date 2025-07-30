import React, { useEffect, useState } from 'react';

interface SEOMetrics {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  hreflang: string[];
  structuredData: any[];
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  links: Array<{
    href: string;
    text: string;
    rel?: string;
  }>;
  headings: Array<{
    level: number;
    text: string;
  }>;
  performance: {
    loadTime: number;
    domSize: number;
    imageCount: number;
    scriptCount: number;
    cssCount: number;
  };
}

interface SEOMonitorProps {
  onMetricsUpdate?: (metrics: SEOMetrics) => void;
  showDebug?: boolean;
  className?: string;
}

const SEOMonitor: React.FC<SEOMonitorProps> = ({
  onMetricsUpdate,
  showDebug = false,
  className = ''
}) => {
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    const analyzeSEO = () => {
      const seoMetrics: SEOMetrics = {
        title: '',
        description: '',
        keywords: '',
        canonical: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        twitterTitle: '',
        twitterDescription: '',
        twitterImage: '',
        hreflang: [],
        structuredData: [],
        images: [],
        links: [],
        headings: [],
        performance: {
          loadTime: 0,
          domSize: 0,
          imageCount: 0,
          scriptCount: 0,
          cssCount: 0
        }
      };

      const issuesList: string[] = [];

      // Analyze meta tags
      const title = document.querySelector('title')?.textContent || '';
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';

      seoMetrics.title = title;
      seoMetrics.description = description;
      seoMetrics.keywords = keywords;
      seoMetrics.canonical = canonical;

      // Analyze Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
      const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
      const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

      seoMetrics.ogTitle = ogTitle;
      seoMetrics.ogDescription = ogDescription;
      seoMetrics.ogImage = ogImage;

      // Analyze Twitter Card tags
      const twitterTitle = document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || '';
      const twitterDescription = document.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || '';
      const twitterImage = document.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '';

      seoMetrics.twitterTitle = twitterTitle;
      seoMetrics.twitterDescription = twitterDescription;
      seoMetrics.twitterImage = twitterImage;

      // Analyze hreflang tags
      const hreflangElements = document.querySelectorAll('link[rel="alternate"][hreflang]');
      seoMetrics.hreflang = Array.from(hreflangElements).map(el => 
        `${el.getAttribute('hreflang')}: ${el.getAttribute('href')}`
      );

      // Analyze structured data
      const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
      seoMetrics.structuredData = Array.from(structuredDataScripts).map(script => {
        try {
          return JSON.parse(script.textContent || '');
        } catch {
          return null;
        }
      }).filter(Boolean);

      // Analyze images
      const images = document.querySelectorAll('img');
      seoMetrics.images = Array.from(images).map(img => ({
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height
      }));

      // Analyze links
      const links = document.querySelectorAll('a');
      seoMetrics.links = Array.from(links).map(link => ({
        href: link.href,
        text: link.textContent?.trim() || '',
        rel: link.rel
      }));

      // Analyze headings
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      seoMetrics.headings = Array.from(headings).map(heading => ({
        level: parseInt(heading.tagName.charAt(1)),
        text: heading.textContent?.trim() || ''
      }));

      // Analyze performance
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      seoMetrics.performance = {
        loadTime: navigationEntry ? navigationEntry.loadEventEnd - navigationEntry.loadEventStart : 0,
        domSize: document.querySelectorAll('*').length,
        imageCount: images.length,
        scriptCount: document.querySelectorAll('script').length,
        cssCount: document.querySelectorAll('link[rel="stylesheet"]').length
      };

      // Check for SEO issues
      if (!title) issuesList.push('Missing title tag');
      if (title.length > 60) issuesList.push('Title is too long (should be under 60 characters)');
      
      if (!description) issuesList.push('Missing meta description');
      if (description.length > 160) issuesList.push('Description is too long (should be under 160 characters)');
      
      if (!canonical) issuesList.push('Missing canonical URL');
      
      if (!ogTitle) issuesList.push('Missing Open Graph title');
      if (!ogDescription) issuesList.push('Missing Open Graph description');
      if (!ogImage) issuesList.push('Missing Open Graph image');
      
      if (!twitterTitle) issuesList.push('Missing Twitter Card title');
      if (!twitterDescription) issuesList.push('Missing Twitter Card description');
      if (!twitterImage) issuesList.push('Missing Twitter Card image');

      // Check for images without alt text
      const imagesWithoutAlt = seoMetrics.images.filter(img => !img.alt);
      if (imagesWithoutAlt.length > 0) {
        issuesList.push(`${imagesWithoutAlt.length} images missing alt text`);
      }

      // Check heading structure
      const headingLevels = seoMetrics.headings.map(h => h.level);
      if (!headingLevels.includes(1)) {
        issuesList.push('Missing H1 heading');
      }

      // Check for duplicate headings
      const headingTexts = seoMetrics.headings.map(h => h.text.toLowerCase());
      const duplicateHeadings = headingTexts.filter((text, index) => headingTexts.indexOf(text) !== index);
      if (duplicateHeadings.length > 0) {
        issuesList.push('Duplicate heading text found');
      }

      // Check structured data
      if (seoMetrics.structuredData.length === 0) {
        issuesList.push('No structured data found');
      }

      // Check performance
      if (seoMetrics.performance.loadTime > 3000) {
        issuesList.push('Page load time is slow (>3 seconds)');
      }

      if (seoMetrics.performance.domSize > 1500) {
        issuesList.push('DOM size is large (>1500 elements)');
      }

      setMetrics(seoMetrics);
      setIssues(issuesList);
      onMetricsUpdate?.(seoMetrics);

      // Send metrics to analytics
      if (window.gtag) {
        window.gtag('event', 'seo_analysis', {
          event_category: 'SEO',
          event_label: 'Page Analysis',
          custom_parameter_1: issuesList.length,
          custom_parameter_2: seoMetrics.performance.loadTime,
          custom_parameter_3: seoMetrics.images.length
        });
      }
    };

    // Run analysis after page load
    if (document.readyState === 'complete') {
      analyzeSEO();
    } else {
      window.addEventListener('load', analyzeSEO);
      return () => window.removeEventListener('load', analyzeSEO);
    }
  }, [onMetricsUpdate]);

  if (!showDebug || !metrics) {
    return null;
  }

  return (
    <div className={`seo-monitor bg-gray-100 dark:bg-gray-800 p-4 rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4">SEO Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Meta Tags</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Title:</strong> {metrics.title}</div>
            <div><strong>Description:</strong> {metrics.description}</div>
            <div><strong>Keywords:</strong> {metrics.keywords}</div>
            <div><strong>Canonical:</strong> {metrics.canonical}</div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Social Media</h4>
          <div className="space-y-2 text-sm">
            <div><strong>OG Title:</strong> {metrics.ogTitle}</div>
            <div><strong>OG Description:</strong> {metrics.ogDescription}</div>
            <div><strong>Twitter Title:</strong> {metrics.twitterTitle}</div>
            <div><strong>Twitter Description:</strong> {metrics.twitterDescription}</div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Content Analysis</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Images:</strong> {metrics.images.length}</div>
            <div><strong>Links:</strong> {metrics.links.length}</div>
            <div><strong>Headings:</strong> {metrics.headings.length}</div>
            <div><strong>Structured Data:</strong> {metrics.structuredData.length}</div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Performance</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Load Time:</strong> {metrics.performance.loadTime}ms</div>
            <div><strong>DOM Size:</strong> {metrics.performance.domSize} elements</div>
            <div><strong>Scripts:</strong> {metrics.performance.scriptCount}</div>
            <div><strong>CSS Files:</strong> {metrics.performance.cssCount}</div>
          </div>
        </div>
      </div>

      {issues.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2 text-red-600">Issues Found ({issues.length})</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
            {issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {issues.length === 0 && (
        <div className="mt-4 text-green-600 text-sm">
          ✅ No SEO issues detected
        </div>
      )}
    </div>
  );
};

export default SEOMonitor; 