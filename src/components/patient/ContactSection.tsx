'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { notify } from '@/components/ui/Notification';
import { cn } from '@/lib/utils';

// Contact section component
export function ContactSection() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    notify('success', 'Message Sent', 'Your message has been sent. We&apos;ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact info */}
          <div>
            <h2 className="text-3xl font-bold text-nova-text">
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h2>
            <p className="mt-4 text-lg text-nova-text-secondary">
              {language === 'ar' ? 'نحن هنا لمساعدتك. لا تتردد في التواصل معنا' : 'We&apos;re here to help. Feel free to reach out'}
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nova-primary-light text-nova-primary-dark">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-nova-text">Address</p>
                  <p className="text-sm text-nova-text-secondary">King Fahd Road, Riyadh, Saudi Arabia</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nova-primary-light text-nova-primary-dark">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-nova-text">Phone</p>
                  <p className="text-sm text-nova-text-secondary">+966 50 123 4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nova-primary-light text-nova-primary-dark">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-nova-text">Email</p>
                  <p className="text-sm text-nova-text-secondary">info@novadental.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nova-primary-light text-nova-primary-dark">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-nova-text">Hours</p>
                  <p className="text-sm text-nova-text-secondary">
                    {language === 'ar' ? 'الأحد - الخميس: 9:00 ص - 6:00 م' : 'Sun - Thu: 9:00 AM - 6:00 PM'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <Card variant="elevated">
            <CardBody className="p-6">
              <h3 className="text-xl font-bold text-nova-text">
                {language === 'ar' ? 'أرسل رسالة' : 'Send a Message'}
              </h3>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-nova-text">
                      {language === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={language === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-nova-text">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={language === 'ar' ? 'أدخل بريدك' : 'Enter your email'}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-nova-text">
                      {language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={language === 'ar' ? 'أدخل رقم هاتفك' : 'Enter your phone'}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-nova-text">
                      {language === 'ar' ? 'الموضوع' : 'Subject'}
                    </label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={language === 'ar' ? 'أدخل الموضوع' : 'Enter subject'}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-nova-text">
                    {language === 'ar' ? 'رسالتك' : 'Your Message'} *
                  </label>
                  <Textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={language === 'ar' ? 'أدخل رسالتك' : 'Enter your message'}
                    className="w-full"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {language === 'ar' ? 'إرسال' : 'Send Message'}
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
