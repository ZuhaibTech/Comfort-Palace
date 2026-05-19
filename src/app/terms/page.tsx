// src/app/terms/page.tsx
import type { Metadata } from 'next';
import Terms from '@/components/Details/Terms';

export const metadata: Metadata = {
  title: 'Terms of Service | Comfort Palace',
  description: 'Terms of Service and legal agreements for Comfort Palace luxury custom furniture studio.',
};

export default function TermsPage() {
  return (
    <div className="flex-1 w-full bg-surface-50 pt-[12dvh]">
      <Terms />
    </div>
  );
}
