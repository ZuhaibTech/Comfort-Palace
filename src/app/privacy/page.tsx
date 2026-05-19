// src/app/privacy/page.tsx
import type { Metadata } from 'next';
import Privacy from '@/components/Details/Privacy';

export const metadata: Metadata = {
  title: 'Privacy Policy | Comfort Palace',
  description: 'Privacy Policy and data security charter for Comfort Palace luxury custom furniture studio.',
};

export default function PrivacyPage() {
  return (
    <div className="flex-1 w-full bg-surface-50 pt-[12dvh]">
      <Privacy />
    </div>
  );
}
