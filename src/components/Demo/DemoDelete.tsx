import React from 'react';

interface DemoDeleteProps {
  sale: any;
  onSuccess: () => void;
}

export default function DemoDelete({ sale, onSuccess }: DemoDeleteProps) {
  const handleExportAndDelete = async () => {
    // 1. Trigger the browser's native print/PDF download window
    window.print();
    
    // 2. If this is a demo sale, we auto-delete it after a 25-second delay
    if (sale?.is_demo) {
      setTimeout(async () => {
        try {
          const response = await fetch(`/api/sales/${sale.id}`, { 
            method: 'DELETE' 
          });
          
          if (response.ok) {
            console.log(`Demo sale ${sale.sale_number} automatically deleted after 25s delay.`);
            // 3. Trigger the callback to refresh the UI and close the modal
            onSuccess();
          }
        } catch (error) {
          console.error('Failed to auto-delete demo sale:', error);
        }
      }, 25000); // 25 seconds delay
    }
  };

  return (
    <button 
      onClick={handleExportAndDelete} 
      className="px-5 py-2 bg-surface-900 text-white rounded-full text-sm font-semibold hover:bg-[#C5A059] transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
      title={sale?.is_demo ? "Export PDF and auto-delete this demo sale" : "Export PDF"}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      Export PDF
    </button>
  );
}
