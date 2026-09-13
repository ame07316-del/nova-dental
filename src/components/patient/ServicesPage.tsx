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

// Services listing page (Arabic-first: the clinic site is Arabic by default)
export function ServicesPage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const nameOf = (s: (typeof allServices)[number]) => (isAr ? (s.nameAr ?? s.name) : s.name);
  const descOf = (s: (typeof allServices)[number]) => (isAr ? (s.descriptionAr ?? s.description) : s.description);
  const catOf = (s: (typeof allServices)[number]) => (isAr ? (s.categoryAr ?? s.category) : s.category);

  const categories = useMemo(() => {
    const cats = [...new Set(allServices.map((s) => catOf(s)))];
    return ['all', ...cats];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAr]);

  const filteredServices = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return allServices.filter((service) => {
      const matchesCategory = selectedCategory === 'all' || catOf(service) === selectedCategory;
      const matchesSearch =
        service.name.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q) ||
        (service.nameAr ?? '').includes(searchTerm) ||
        (service.descriptionAr ?? '').includes(searchTerm);
      return matchesCategory && matchesSearch;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchTerm, isAr]);

  const categoryColors: Record<string, string> = {
    Preventive: 'bg-green-100 text-green-700',
    Restorative: 'bg-blue-100 text-blue-700',
    Cosmetic: 'bg-pink-100 text-pink-700',
    Orthodontics: 'bg-violet-100 text-violet-700',
    'Oral Surgery': 'bg-red-100 text-red-700',
    Emergency: 'bg-amber-100 text-amber-700',
    'وقائي': 'bg-green-100 text-green-700',
    'ترميمي': 'bg-blue-100 text-blue-700',
    'تجميلي': 'bg-pink-100 text-pink-700',
    'تقويم': 'bg-violet-100 text-violet-700',
    'جراحة الفم': 'bg-red-100 text-red-700',
    'طوارئ': 'bg-amber-100 text-amber-700',
  };

  // Map an Arabic label back to its English key for stable colors
  const colorKey = (cat: string) => {
    const back: Record<string, string> = {
      'وقائي': 'Preventive',
      'ترميمي': 'Restorative',
      'تجميلي': 'Cosmetic',
      'تقويم': 'Orthodontics',
      'جراحة الفم': 'Oral Surgery',
      'طوارئ': 'Emergency',
    };
    return back[cat] ?? cat;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-nova-text">
            {isAr ? 'خدماتنا' : 'Our Services'}
          </h1>
          <p className="mt-2 text-nova-text-secondary">
            {isAr ? 'اكتشف خدمات طب الأسنان الشاملة لدينا' : 'Discover our comprehensive dental services'}
          </p>
        </div>
        <Input
          placeholder={isAr ? 'ابحث عن خدمة...' : 'Search services...'}
          aria-label={isAr ? 'ابحث عن خدمة' : 'Search services'}
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
            aria-pressed={selectedCategory === cat}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              selectedCategory === cat
                ? 'bg-nova-primary text-white'
                : 'bg-nova-muted text-nova-text-muted hover:bg-nova-border'
            )}
          >
            {cat === 'all' ? (isAr ? 'الكل' : 'All') : cat}
          </button>
        ))}
      </div>

      {/* Services grid */}
      {filteredServices.length === 0 ? (
        <EmptyState
          title={isAr ? 'لا توجد خدمات' : 'No services found'}
          description={isAr ? 'جرّب بحثًا مختلفًا أو تصنيفًا آخر.' : 'Try a different search or category filter.'}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Card key={service.id} variant="interactive" className="overflow-hidden p-0">
              <div className="h-2 bg-gradient-to-r from-nova-primary-light to-nova-muted" />
              <CardBody className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className={cn('mb-2', categoryColors[colorKey(catOf(service))] || 'bg-nova-muted text-nova-text-secondary')}>
                      {catOf(service)}
                    </Badge>
                    <h3 className="text-lg font-bold text-nova-text">{nameOf(service)}</h3>
                    <p className="mt-2 text-sm text-nova-text-secondary">{descOf(service)}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-nova-text-muted">{isAr ? 'المدة' : 'Duration'}</p>
                    <p className="text-sm font-semibold text-nova-text">
                      {service.durationMinutes} {isAr ? 'دقيقة' : 'min'}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="text-sm text-nova-text-muted">{isAr ? 'السعر' : 'Price'}</p>
                    <p className="text-xl font-bold text-nova-primary">${service.price}</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" onClick={() => router.push(`/book?service=${service.id}`)}>
                  {isAr ? 'احجز الآن' : 'Book Now'}
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
