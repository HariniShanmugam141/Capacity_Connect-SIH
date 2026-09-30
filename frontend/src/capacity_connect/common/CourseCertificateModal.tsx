import React, { useRef } from 'react';
import { X, Download, Award, CheckCircle2 } from 'lucide-react';

interface CourseCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseTitle: string;
  issueDate?: string;
  trainerName?: string;
  credentialId?: string;
}

export const CourseCertificateModal: React.FC<CourseCertificateModalProps> = ({
  isOpen,
  onClose,
  studentName,
  courseTitle,
  issueDate,
  trainerName,
  credentialId = `CC-${Math.floor(100000 + Math.random() * 900000)}`
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const formattedDate = issueDate || new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.');

  const handleDownloadPDF = () => {
    // Triggers native browser print-to-PDF with landscape layout
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static print:h-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col my-auto print:border-none print:shadow-none print:max-w-none print:w-full print:m-0">
        
        {/* Modal Top Bar (hidden during print) */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
              <Award size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Official Course Completion Certificate
              </h3>
              <p className="text-[11px] text-slate-500">
                Verified Credential ID: <span className="font-mono font-bold text-blue-600">{credentialId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* ONLY PDF DOWNLOAD OPTION PROVIDED */}
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Download size={15} />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Canvas Area */}
        <div className="p-4 sm:p-6 bg-slate-100/70 flex items-center justify-center print:p-0 print:bg-white">
          <div
            id="certificate-print-area"
            ref={certificateRef}
            className="relative w-full aspect-[1024/733] bg-white rounded-xl shadow-xl overflow-hidden select-none print:shadow-none print:rounded-none print:w-full print:h-auto"
            style={{ minHeight: '380px' }}
          >
            {/* Pristine blank background template image */}
            <img
              src="/certificate-template.png"
              alt="Capacity Connect Certificate Template"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none"
            />

            {/* DYNAMIC OVERLAY 1: STUDENT NAME */}
            {/* Perfectly centered between 'THIS CERTIFICATE IS PROUDLY PRESENTED TO' and the gold line with diamond */}
            <div
              className="absolute left-[15%] right-[15%] flex items-center justify-center pointer-events-none"
              style={{ top: '47.5%', height: '9.5%' }}
            >
              <span className="font-serif italic font-bold text-2xl sm:text-4xl md:text-5xl text-[#0b1b3d] tracking-normal whitespace-nowrap select-text">
                {studentName}
              </span>
            </div>

            {/* DYNAMIC OVERLAY 2: COURSE NAME */}
            {/* Perfectly aligned directly between the left & right horizontal line guides */}
            <div
              className="absolute left-[18%] right-[18%] flex items-center justify-center pointer-events-none"
              style={{ top: '64.5%', height: '7.5%' }}
            >
              <span className="font-serif font-bold text-sm sm:text-base md:text-xl text-[#0b1b3d] tracking-wider uppercase px-4 whitespace-nowrap text-center select-text">
                {courseTitle}
              </span>
            </div>

            {/* DYNAMIC OVERLAY 3: DATE */}
            {/* Perfectly centered directly above the gold date line and 'DATE' */}
            <div
              className="absolute flex items-center justify-center pointer-events-none text-center"
              style={{ left: '19.3%', width: '19.4%', top: '80.0%', height: '5.8%' }}
            >
              <span className="font-serif font-bold text-xs sm:text-sm md:text-base text-[#0b1b3d] tracking-wider whitespace-nowrap select-text">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Info (hidden during print) */}
        <div className="px-6 py-3 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            <span>
              Certified by Capacity Connect Learning Council {trainerName ? `• Authorized by Trainer ${trainerName}` : ''}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Official verifiable enterprise credential
          </span>
        </div>

      </div>
    </div>
  );
};
