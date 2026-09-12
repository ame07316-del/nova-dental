'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { services as allServices } from '@/data/demo';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SearchableGrid } from '@/components/dental/SearchableGrid';
import { EmptyState } from '@/components/ui/EmptyState';

// Services listing page
export function ServicesPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => {
    const cats = [...new Set(allServices.map((s) => s.category))];
    return ['all', ...cats];
  }, []);

  const filteredServices = useMemo(() => {
    return allServices.filter((service) => {
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const categoryColors: Record<string, string> = {
    Preventive: 'bg-green-100 text-green-700',
    Restorative: 'bg-blue-100 text-blue-700',
    Cosmetic: 'bg-pink-100 text-pink-700',
    Orthodontics: 'bg-violet-100 text-violet-700',
    'Oral Surgery': 'bg-red-100 text-red-700',
    Emergency: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-nova-text">
            {language === 'ar' ? 'خدماتنا' : 'Our Services'}
          </h1>
          <p className="mt-2 text-nova-text-secondary">
            {language === 'ar' ? 'اكتشف خدمات طب الأسنان الشاملة لدينا' : 'Discover our comprehensive dental services'}
          </p>
        </div>
        <Input
          placeholder={language === 'ar' ? 'ابحث عن خدمة...' : 'Search services...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              selectedCategory === cat
                ? 'bg-nova-primary text-white'
                : 'bg-nova-muted text-nova-text-muted hover:bg-nova-border'
            )}
          >
            {cat === 'all' ? (language === 'ar' ? 'الكل' : 'All') : cat}
          </button>
        ))}
      </div>

      {/* Services grid */}
      {filteredServices.length === 0 ? (
        <EmptyState title="No services found" description="Try a different search or category filter." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Card key={service.id} variant="interactive" className="overflow-hidden p-0">
              <div className="h-2 bg-gradient-to-r from-nova-primary-light to-nova-muted" />
              <CardBody className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className={cn('mb-2', categoryColors[service.category] || 'bg-nova-muted text-nova-text-secondary')}>
                      {service.category}
                    </Badge>
                    <h3 className="text-lg font-bold text-nova-text">{service.name}</h3>
                    <p className="mt-2 text-sm text-nova-text-secondary">{service.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-nova-text-muted">Duration</p>
                    <p className="text-sm font-semibold text-nova-text">{service.durationMinutes} min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-nova-text-muted">Price</p>
                    <p className="text-xl font-bold text-nova-primary">${service.price}</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" onClick={() => router.push(`/book?service=${service.id}`)}>
                  {language === 'ar' ? 'احجز الآن' : 'Book Now'}
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
