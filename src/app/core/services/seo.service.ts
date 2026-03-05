import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  jsonLd?: object;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  private readonly siteName = 'Circular Electronics';
  private readonly defaultImage = 'https://www.circular-electronics.com/assets/og-image.png';

  update(config: SeoConfig): void {
    const fullTitle = `${config.title} - ${this.siteName}`;
    this.titleService.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: config.description });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: config.ogTitle || fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.ogDescription || config.description });
    this.meta.updateTag({ property: 'og:image', content: config.ogImage || this.defaultImage });
    this.meta.updateTag({ property: 'og:type', content: config.ogType || 'website' });
    if (config.ogUrl) {
      this.meta.updateTag({ property: 'og:url', content: config.ogUrl });
    }
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.ogTitle || fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.ogDescription || config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.ogImage || this.defaultImage });

    // JSON-LD
    if (config.jsonLd) {
      this.setJsonLd(config.jsonLd);
    }
  }

  private setJsonLd(data: object): void {
    // Remove existing JSON-LD
    const existing = this.document.querySelector('script[type="application/ld+json"][data-seo]');
    if (existing) {
      existing.remove();
    }

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'true');
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }
}
