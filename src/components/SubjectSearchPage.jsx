import React, { useState } from 'react';
import { BookOpen, Search, Filter, Clock, ChevronDown, Loader2, AlertCircle, FileQuestion } from 'lucide-react';

const SUBJECTS = [
  'Data Structures', 'DBMS', 'Computer Networks', 'Operating Systems',
  'Theory of Computation', 'Software Engineering', 'Computer Graphics',
  'Microprocessors', 'Digital Electronics', 'Engineering Mathematics',
  'Compiler Design', 'Artificial Intelligence', 'Machine Learning',
  'Web Technology', 'Cloud Computing',
];

const SEMESTERS = ['Semester I', 'Semester II', 'Semester III', 'Semester IV',
                   'Semester V', 'Semester VI', 'Semester VII', 'Semester VIII'];
const YEARS = ['2024', '2023', '2022', '2021', '2020', '2019', '2018'];
const MARKS  = ['All', '2', '5', '7', '10'];

const SubjectSearchPage = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSem, setSelectedSem]       = useState('');
  const [selectedYear, setSelectedYear]     = useState('');
  const [selectedMarks, setSelectedMarks]   = useState('All');
  const [results, setResults]               = useState(null);
  const [isLoading, setIsLoading]           = useState(false);
  const [error, setError]                   = useState(null);
  const [searched, setSearched]             = useState(false);

  const handleSearch = async () => {
    if (!selectedSubject) return;
    setIsLoading(true);
    setError(null);
    setResults(null);
    setSearched(true);

    try {
      const params = new URLSearchParams();
      params.set('subject', selectedSubject);
      if (selectedSem)  params.set('semester', selectedSem);
      if (selectedYear) params.set('year', selectedYear);
      if (selectedMarks !== 'All') params.set('marks', selectedMarks);

      const res = await fetch(`/subject-search?${params.toString()}`);
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError('Could not fetch questions. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in subject-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-icon" style={{ background: 'rgba(30,58,110,0.1)', color: '#1E3A6E' }}>
          <BookOpen size={28} />
        </div>
        <div>
          <h1 className="page-title">Subject-Wise Search</h1>
          <p className="page-subtitle">Filter questions by subject, semester, year, and marks weightage.</p>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="glass-panel p-6 mb-8">
        <div className="filter-grid">

          {/* Subject */}
          <div className="filter-field full-width">
            <label className="filter-label"><BookOpen size={14} /> Subject *</label>
            <div className="select-wrap">
              <select className="input-glass select-input" value={selectedSubject}
                      onChange={e => setSelectedSubject(e.target.value)}>
                <option value="">— Choose a subject —</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={16} className="select-icon" />
            </div>
          </div>

          {/* Semester */}
          <div className="filter-field">
            <label className="filter-label"><Filter size={14} /> Semester</label>
            <div className="select-wrap">
              <select className="input-glass select-input" value={selectedSem}
                      onChange={e => setSelectedSem(e.target.value)}>
                <option value="">All Semesters</option>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={16} className="select-icon" />
            </div>
          </div>

          {/* Year */}
          <div className="filter-field">
            <label className="filter-label"><Clock size={14} /> Year</label>
            <div className="select-wrap">
              <select className="input-glass select-input" value={selectedYear}
                      onChange={e => setSelectedYear(e.target.value)}>
                <option value="">All Years</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown size={16} className="select-icon" />
            </div>
          </div>

          {/* Marks */}
          <div className="filter-field">
            <label className="filter-label">🎯 Marks</label>
            <div className="marks-toggle-group">
              {MARKS.map(m => (
                <button key={m}
                  className={`marks-toggle ${selectedMarks === m ? 'active' : ''}`}
                  onClick={() => setSelectedMarks(m)}>
                  {m === 'All' ? 'All' : `${m}M`}
                </button>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <div className="filter-field center-btn">
            <button className="btn-primary btn-search-subject"
                    disabled={!selectedSubject || isLoading}
                    onClick={handleSearch}>
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              {isLoading ? 'Searching…' : 'Search Questions'}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="status-banner error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="animate-fade-in">
          <div className="results-header">
            <FileQuestion size={20} />
            <span>Results for <strong>{selectedSubject}</strong></span>
            <span className="badge badge-orange">{results.questions?.length || 0} questions</span>
          </div>

          <div className="questions-list">
            {results.questions?.length > 0 ? results.questions.map((q, i) => (
              <div key={i} className="glass-card question-card">
                <div className="question-meta">
                  {q.year && <span className="badge badge-blue"><Clock size={11} /> {q.year}</span>}
                  {q.semester && <span className="badge badge-blue">{q.semester}</span>}
                  {q.marks && <span className="badge badge-orange">{q.marks} Marks</span>}
                  {q.exam_type && <span className="badge badge-blue">{q.exam_type}</span>}
                </div>
                <p className="question-text">{q.question?.question_text || q.text || 'No text available'}</p>
                {q.question?.subquestions?.length > 0 && (
                  <div className="subquestions">
                    {q.question.subquestions.map((sub, si) => (
                      <div key={si} className="subq">
                        <span className="subq-label">{sub.label ? `(${sub.label})` : '•'}</span>
                        <span>{sub.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )) : (
              <div className="glass-card empty-state">
                <FileQuestion size={40} className="empty-icon" />
                <p>No questions found for the selected filters.</p>
                <p className="text-sm">Try changing the semester or year.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!searched && !isLoading && (
        <div className="subject-prompt">
          <BookOpen size={48} className="prompt-icon" />
          <h3>Select a subject to get started</h3>
          <p>Choose a subject and optionally filter by semester & year to view all past exam questions.</p>
        </div>
      )}
    </div>
  );
};

export default SubjectSearchPage;
