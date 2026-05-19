// src/components/Details/Terms.tsx
import Reveal from '@/components/motion/Reveal';

export default function Terms() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and placing an order with Comfort Palace, you confirm that you are in agreement with and bound by the terms of service contained in the Terms and Conditions outlined below. These terms apply to the entire website and any email or other type of communication between you and Comfort Palace."
    },
    {
      title: "2. Precision Craftsmanship & Variances",
      content: "Comfort Palace designs timeless technical art, redefining contemporary living through mathematical precision and artisanal craftsmanship. Because our pieces are handcrafted with natural materials (such as premium hardwoods, natural leather, custom textiles, and brushed metals), minor natural variations in wood grain, color shading, and texture are characteristic of luxury custom furniture and do not constitute defects."
    },
    {
      title: "3. Order Placement & Customization",
      content: "Customized and bespoke orders enter production immediately upon payment clearance and signed design specifications. Once custom production has commenced, orders cannot be cancelled, modified, or refunded due to the custom-tailored nature of the materials and structural engineering involved."
    },
    {
      title: "4. Pricing & Payment Policies",
      content: "All pricing listed on the Comfort Palace platform is quoted in GBP/USD/EUR (as applicable) and is subject to change without notice. Full payment is required at the time of order placement for all catalog collections. For high-end custom orders, a formal deposit contract may be arranged by our executive concierge desk."
    },
    {
      title: "5. Shipping, Logistics & Delivery",
      content: "Comfort Palace uses specialized white-glove logistics services to ensure that your luxury furniture arrives in pristine condition. Delivery windows are estimates and may vary based on customs clearances, material supply chains, or shipping coordinates. It is the customer's sole responsibility to ensure that the delivered items can fit through doorways, hallways, stairwells, and elevators."
    },
    {
      title: "6. Limitation of Liability",
      content: "To the maximum extent permitted by applicable law, Comfort Palace shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your access to or use of or inability to access or use our products."
    },
    {
      title: "7. Intellectual Property rights",
      content: "All content, designs, sketches, technical drawings, mathematical models, product photography, trademarks, and logos displayed on the Comfort Palace platform are the exclusive intellectual property of Comfort Palace Studio. Any unauthorized reproduction, modification, or distribution is strictly prohibited."
    },
    {
      title: "8. Governing Law",
      content: "These Terms of Service and any separate agreements whereby we provide you services or products shall be governed by and construed in accordance with the local jurisdiction laws where Comfort Palace operates, without regard to conflict of law principles."
    }
  ];

  return (
    <div className="w-full bg-surface-50 min-h-screen py-16 lg:py-24 px-fluid-md lg:px-fluid-lg">
      <div className="mx-auto max-w-[1000px]">
        {/* Header section */}
        <div className="mb-20 text-center">
          <Reveal direction="down" once={true} delay={0.2} distance="40px">
            <div className="inline-flex items-center gap-4 mb-6 justify-center">
              <span className="w-8 h-[1px] bg-primary-800"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-800">Legal Agreement</span>
              <span className="w-8 h-[1px] bg-primary-800"></span>
            </div>
            <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] text-surface-900 font-light tracking-tighter leading-[1] mb-6">
              Terms of <span className="italic text-primary-800">Service</span>
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
              Welcome to Comfort Palace. These Terms of Service dictate your relationship with our studio, outlining your legal rights and our mutual obligations when you purchase our technical furniture art, browse our collections, or consult with our custom design team.
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
            <h4 className="text-sm font-bold uppercase tracking-widest text-surface-900 mb-3">Legal Inquiries</h4>
            <p className="text-surface-500 text-sm leading-relaxed mb-6">
              If you have any questions regarding our Terms of Service, custom production contracts, or logistics rules, please reach out to our legal department.
            </p>
            <p className="text-primary-800 font-bold uppercase tracking-[0.2em] text-xs">
              legal@comfortpalace.com
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
