import React from 'react';
import { Search, BookOpen, Users, Sparkles, ArrowRight, Brain, Target, Clock } from 'lucide-react';

const features = [
  {
    icon: <Brain size={28} />,
    title: 'AI-Powered Search',
    desc: 'Our NLP engine understands your intent — not just keywords. Find the most relevant PYQs even when you phrase it differently.',
    color: '#F26522',
  },
  {
    icon: <BookOpen size={28} />,
    title: 'Subject-Wise Browse',
    desc: 'Browse questions filtered by subject, semester, year, and marks. Organised exactly the way your syllabus is.',
    color: '#1E3A6E',
  },
  {
    icon: <Target size={28} />,
    title: 'Predicted Questions',
    desc: 'AI analyses past patterns and predicts high-probability questions for your upcoming exams. Study smarter.',
    color: '#F26522',
  },
  {
    icon: <Users size={28} />,
    title: 'Student Contributions',
    desc: 'Found a question paper not in our database? Upload it and help the entire RCOEM community prepare better.',
    color: '#1E3A6E',
  },
];



const howItWorks = [
  { step: '01', title: 'Type Your Topic', desc: 'Enter any concept, keyword, or full question in plain English.' },
  { step: '02', title: 'AI Finds Matches', desc: 'Our NLP model retrieves semantically similar past exam questions.' },
  { step: '03', title: 'Review & Predict', desc: 'See the results, read AI summaries, and get predicted exam questions.' },
];

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="landing-root animate-fade-in">

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>Powered by NLP &amp; Semantic AI · RCOEM</span>
        </div>

        <h1 className="hero-title">
          Ace Your Exams with
          <span className="hero-title-accent"> Intelligent</span>
          <br />
          <span className="hero-title-blue">Question Search</span>
        </h1>

        <p className="hero-subtitle">
          The smartest way to explore <strong>Ramdeobaba University (RCOEM)</strong> previous year questions.
          Search by topic, browse by subject, get AI-powered predictions — all in one platform,
          built <em>by students, for students</em>.
        </p>

        <div className="hero-cta-group">
          <button className="btn-hero-primary" onClick={() => onNavigate('search')}>
            <Search size={20} />
            Search PYQs Now
            <ArrowRight size={18} />
          </button>
          <button className="btn-hero-secondary" onClick={() => onNavigate('subject')}>
            <BookOpen size={20} />
            Browse by Subject
          </button>
        </div>

        {/* Floating accent blobs */}
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
      </section>



      {/* ── HOW IT WORKS ── */}
      <section className="hiw-section">
        <div className="section-eyebrow center">How it works</div>
        <h2 className="section-title center">Three Steps to Exam Clarity</h2>
        <div className="hiw-grid">
          {howItWorks.map((h, i) => (
            <div key={i} className="hiw-card">
              <div className="hiw-step">{h.step}</div>
              <h3 className="hiw-title">{h.title}</h3>
              <p className="hiw-desc">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="section-eyebrow center">Features</div>
        <h2 className="section-title center">Everything You Need to Prepare</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card" style={{ '--fc': f.color }}>
              <div className="feature-icon" style={{ color: f.color, background: `${f.color}18` }}>
                {f.icon}
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="cta-content">
          <Clock size={36} className="cta-icon" />
          <h2 className="cta-title">Exam season is coming. Start preparing smart.</h2>
          <p className="cta-sub">Thousands of questions. One intelligent search.</p>
          <button className="btn-hero-primary" onClick={() => onNavigate('search')}>
            <Search size={20} />
            Start Searching for Free
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="cta-blob-1" />
        <div className="cta-blob-2" />
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <span>© 2025 RBU Intelligent Question Search · Made with ❤️ by RCOEM Students</span>
      </footer>
    </div>
  );
};

export default LandingPage;
