'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/dental/AvatarsAndMore';
import { dentists } from '@/data/demo';
import { services as allServices } from '@/data/demo';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';

// Doctors listing page
export function DoctorsPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const specialties = useMemo(() => {
    const specs = [...new Set(dentists.map((d) => d.specialty))];
    return ['all', ...specs];
  }, []);

  const filteredDoctors = useMemo(() => {
    return dentists.filter((dentist) => {
      const matchesSpecialty = selectedSpecialty === 'all' || dentist.specialty === selectedSpecialty;
      const matchesSearch = `${dentist.firstName} ${dentist.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dentist.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSpecialty && matchesSearch;
    });
  }, [selectedSpecialty, searchTerm]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-nova-text">
            {language === 'ar' ? 'أطباؤنا' : 'Our Dentists'}
          </h1>
          <p className="mt-2 text-nova-text-secondary">
            {language === 'ar' ? 'تعرف على فريق أطبائنا المحترفين' : 'Meet our team of professional dentists'}
          </p>
        </div>
        <Input
          placeholder={language === 'ar' ? 'ابحث عن طبيب...' : 'Search doctors...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Specialty filters */}
      <div className="flex flex-wrap gap-2">
        {specialties.map((spec) => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              selectedSpecialty === spec
                ? 'bg-nova-primary text-white'
                : 'bg-nova-muted text-nova-text-muted hover:bg-nova-border'
            )}
          >
            {spec === 'all' ? (language === 'ar' ? 'الكل' : 'All') : spec}
          </button>
        ))}
      </div>

      {/* Doctors grid */}
      {filteredDoctors.length === 0 ? (
        <EmptyState title="No doctors found" description="Try a different search or specialty filter." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((dentist) => {
            const dentistServices = allServices.filter((s) => s.category === dentist.specialty);
            return (
              <Card key={dentist.id} variant="interactive" className="overflow-hidden p-0">
                <div className="h-2 bg-gradient-to-r from-nova-primary to-nova-primary-dark" />
                <CardBody className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar name={`${dentist.firstName} ${dentist.lastName}`} size="lg" />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-nova-text">
                        Dr. {dentist.firstName} {dentist.lastName}
                      </h3>
                      <p className="text-sm text-nova-text-secondary">{dentist.specialty}</p>
                    </div>
                    <Badge variant="success" dot>Available</Badge>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-sm text-nova-text-secondary">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500">★</span>
                      <span>{dentist.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{dentist.patientCount} patients</span>
                  </div>

                  <p className="mt-3 text-sm text-nova-text-muted">{dentist.bio}</p>

                  {dentistServices.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {dentistServices.slice(0, 3).map((s) => (
                        <Badge key={s.id} variant="outline" className="text-[10px]">{s.name}</Badge>
                      ))}
                    </div>
                  )}

                  <Button className="mt-4 w-full" onClick={() => router.push(`/book?doctor=${dentist.id}`)}>
                    {language === 'ar' ? 'احجز معه' : 'Book with Dr. {dentist.firstName}'}
                  </Button>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
