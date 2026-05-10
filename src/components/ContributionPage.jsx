import React from 'react';
import { UploadCloud, Heart, Users, Star, Shield, BookOpen } from 'lucide-react';
import UploadPage from './UploadPage';

const perks = [
  { icon: <Heart size={22} />,   title: 'Help Your Peers',    desc: 'Every paper you upload helps hundreds of students prepare better for their exams.' },
  { icon: <Star size={22} />,    title: 'Build the Database',  desc: 'Our PYQ collection grows with every contribution. The more we share, the more we all win.' },
  { icon: <Shield size={22} />,  title: 'Verified & Safe',     desc: 'All uploads are reviewed before going live. Only genuine RCOEM papers are accepted.' },
  { icon: <BookOpen size={22} />,title: 'Any Subject, Any Year',desc: 'Upload papers from any branch, semester, or year. All are welcome.' },
];

const ContributionPage = () => {
  return (
    <div className="animate-fade-in contribution-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-icon" style={{ background: 'rgba(242,101,34,0.1)', color: '#F26522' }}>
          <Users size={28} />
        </div>
        <div>
          <h1 className="page-title">Contribute a Question Paper</h1>
          <p className="page-subtitle">Upload a PYQ PDF and help the entire RCOEM community prepare smarter.</p>
        </div>
      </div>

      {/* Perks row */}
      <div className="perks-grid mb-8">
        {perks.map((p, i) => (
          <div key={i} className="perk-card">
            <div className="perk-icon">{p.icon}</div>
            <h4 className="perk-title">{p.title}</h4>
            <p className="perk-desc">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Upload section title */}
      <div className="contrib-upload-heading">
        <UploadCloud size={20} />
        <span>Upload Your PDF Below</span>
      </div>

      {/* Reuse the existing upload page logic */}
      <UploadPage />
    </div>
  );
};

export default ContributionPage;
