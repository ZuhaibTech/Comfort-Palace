// src/components/Details/Privacy.tsx
import Reveal from '@/components/motion/Reveal';

export default function Privacy() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "Comfort Palace collects information to provide mathematical precision, bespoke tailoring, and executive-level delivery services. We collect identity data (such as name, signature, and title), contact data (such as billing address, white-glove shipping coordinates, phone number, and email), and custom design metrics (such as floor plans, CAD drawings, room scale dimensions, and material choices)."
    },
    {
      title: "2. How We Use Your Information",
      content: "We use your personal data to execute our service contract: managing logistics with white-glove transport partners, tailoring ergonomic specifications, providing personalized CAD layouts, verifying security and identity at delivery points, and maintaining customer relation support. We do not use automated profiling for marketing."
    },
    {
      title: "3. Concierge & Logistics Sharing",
      content: "To guarantee that your luxury pieces are delivered and assembled in flawless condition, we share necessary shipping coordinates and identity details with certified third-party white-glove logistics companies, custom artisans, and custom clearing brokers for international freight. All logistical partners are legally bound by strict confidentiality contracts."
    },
    {
      title: "4. Premium Data Security",
      content: "As part of our commitment to your comfort and peace of mind, we employ advanced security practices (including end-to-end transport layer security and hardware security modules) to guard against unauthorized access, loss, or manipulation of floor plans, financial transactions, and shipping details."
    },
    {
      title: "5. Cookie Preferences & Analytics",
      content: "We utilize cookies and tracking technologies to optimize performance and elevate the digital showroom experience. You may control cookies via your browser settings; however, disabling cookies may impact interactive collection viewing and fluid navigation."
    },
    {
      title: "6. Your Rights & Access",
      content: "Under applicable global privacy regulations (such as GDPR, CCPA, and similar local statutes), you have the right to inspect, correct, delete, restrict, or obtain a clean portable copy of the personal metrics we hold on file. Please submit structural deletion requests directly to our concierge team."
    },
    {
      title: "7. Data Retention Guidelines",
      content: "Comfort Palace retains personal details, mathematical dimensions, and custom design records only as long as necessary to fulfill the operational purpose for which they were gathered, or to comply with archival tax laws and white-glove liability terms."
    },
    {
      title: "8. Policy updates",
      content: "We may periodically adjust this privacy model to align with new logistics partners, privacy protocols, or statutory changes. Any changes will be published here with an updated revision date."
    }
  ];

  return (
    <div className="w-full bg-surface-50 min-h-screen py-16 lg:py-24 pt-[calc(12dvh+4rem)] lg:pt-[calc(12dvh+6rem)] px-fluid-md lg:px-fluid-lg">
      <div className="mx-auto max-w-[1000px]">
        {/* Header section */}
        <div className="mb-20 text-center">
          <Reveal direction="down" once={true} delay={0.2} distance="40px">
            <div className="inline-flex items-center gap-4 mb-6 justify-center">
              <span className="w-8 h-[1px] bg-primary-800"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-800">Privacy Charter</span>
              <span className="w-8 h-[1px] bg-primary-800"></span>
            </div>
            <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] text-surface-900 font-light tracking-tighter leading-[1] mb-6">
              Privacy <span className="italic text-primary-800">Policy</span>
            </h1>
            <p className="text-surface-500 text-sm tracking-[0.2em] uppercase font-semibold">
              Last Updated: May 19, 2026
            </p>
          </Reveal>
        </div>

        {/* Introduction */}
        <div className="mb-16 bg-surface-50 border border-surface-200/60 p-8 md:p-12 rounded-[2rem] shadow-sm">
          <Reveal direction="up" once={true} delay={0.3} distance="40px">
            <h2 className="text-lg font-bold uppercase tracking-wider text-surface-900 mb-4">Introduction</h2>
            <p className="text-surface-600 leading-relaxed text-base">
              At Comfort Palace, your privacy is treated with the same uncompromising level of care as our artisanal craftsmanship. This Privacy Policy details how our studio manages, secures, and handles your data when you interact with our luxury digital platform and custom order channels.
            </p>
          </Reveal>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div 
              key={section.title} 
              className="bg-surface-50 border border-surface-200/60 p-8 md:p-10 rounded-[2rem] shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary-800/30"
            >
              <Reveal direction="up" once={true} delay={0.1 * index} distance="30px">
                <h3 className="text-base font-bold uppercase tracking-widest text-surface-900 mb-4 flex items-center gap-3">
                  <span className="text-primary-800 italic font-display text-lg">0{index + 1}</span>
                  {section.title.substring(3)}
                </h3>
                <p className="text-surface-600 leading-relaxed text-sm">
                  {section.content}
                </p>
              </Reveal>
            </div>
          ))}
        </div>

        {/* Contact Footer */}
        <div className="mt-20 border-t border-surface-200 pt-10 text-center">
          <Reveal direction="up" once={true} delay={0.4} distance="30px">
            <h4 className="text-sm font-bold uppercase tracking-widest text-surface-900 mb-3">Concierge Desk</h4>
            <p className="text-surface-500 text-sm leading-relaxed mb-6">
              If you wish to request deletion, data extraction, or correction of custom sizing parameters, please reach out to our privacy representative.
            </p>
            <p className="text-primary-800 font-bold uppercase tracking-[0.2em] text-xs">
              privacy@comfortpalace.com
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
