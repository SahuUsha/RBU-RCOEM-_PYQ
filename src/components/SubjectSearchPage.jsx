import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Clock, ChevronDown, Loader2, AlertCircle, FileQuestion } from 'lucide-react';

const SubjectSearchPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [years, setYears] = useState([]);
  const [marksList, setMarksList] = useState([]);
  
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedYear, setSelectedYear]     = useState('');
  const [selectedMarks, setSelectedMarks]   = useState('All');
  const [results, setResults]               = useState(null);
  const [isLoading, setIsLoading]           = useState(false);
  const [error, setError]                   = useState(null);
  const [searched, setSearched]             = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch('/filter/subjects');
        if (res.ok) {
          const data = await res.json();
          setSubjects(data.subjects || []);
        }
      } catch (err) {
        console.error('Failed to fetch subjects', err);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubjectChange = async (subject) => {
    setSelectedSubject(subject);
    setSelectedYear('');
    setSelectedMarks('All');
    setYears([]);
    setMarksList([]);
    setResults(null);
    setSearched(false);
    
    if (subject) {
      try {
        const res = await fetch(`/filter/years/${encodeURIComponent(subject)}`);
        if (res.ok) {
          const data = await res.json();
          setYears(data.years || []);
        }
      } catch (err) {
        console.error('Failed to fetch years', err);
      }
    }
  };

  const handleYearChange = async (year) => {
    setSelectedYear(year);
    setSelectedMarks('All');
    setMarksList([]);
    setResults(null);
    setSearched(false);
    
    if (year && selectedSubject) {
      try {
        const res = await fetch(`/filter/marks/${encodeURIComponent(selectedSubject)}/${year}`);
        if (res.ok) {
          const data = await res.json();
          setMarksList(data.marks || []);
        }
      } catch (err) {
        console.error('Failed to fetch marks', err);
      }
    }
  };

  const handleSearch = async () => {
    if (!selectedSubject) return;
    setIsLoading(true);
    setError(null);
    setResults(null);
    setSearched(true);

    try {
      let url = '';
      if (selectedYear && selectedMarks !== 'All') {
        url = `/filter/questions/marks?subject=${encodeURIComponent(selectedSubject)}&year=${selectedYear}&marks=${selectedMarks}`;
      } else if (selectedYear) {
        url = `/filter/questions?subject=${encodeURIComponent(selectedSubject)}&year=${selectedYear}`;
      } else {
          // This case might need handling if subject only is selected but API requires year
          // Let's assume year is required for now as per STEP 3
          setError('Please select a year to search.');
          setIsLoading(false);
          return;
      }

      const res = await fetch(url);
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
                      onChange={e => handleSubjectChange(e.target.value)}>
                <option value="">— Choose a subject —</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={16} className="select-icon" />
            </div>
          </div>

          {/* Year */}
          <div className="filter-field">
            <label className="filter-label"><Clock size={14} /> Year</label>
            <div className="select-wrap">
              <select className="input-glass select-input" value={selectedYear}
                      onChange={e => handleYearChange(e.target.value)}
                      disabled={!selectedSubject}>
                <option value="">— Choose Year —</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown size={16} className="select-icon" />
            </div>
          </div>

          {/* Marks */}
          <div className="filter-field">
            <label className="filter-label">🎯 Marks</label>
            <div className="marks-toggle-group">
              <button 
                className={`marks-toggle ${selectedMarks === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedMarks('All')}
                disabled={!selectedYear}
              >
                All
              </button>
              {marksList.map(m => (
                <button key={m}
                  className={`marks-toggle ${selectedMarks === m ? 'active' : ''}`}
                  onClick={() => setSelectedMarks(m)}
                  disabled={!selectedYear}>
                  {`${m}M`}
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
            <span className="badge badge-orange">{(results.retrieved_questions || results.questions)?.length || 0} questions</span>
          </div>

          {/* AI Generated Content */}
          {results.generated_content && (
            <div className="ai-content-panel mb-8">
              <div className="ai-badge">
                <Search size={14} /> AI Enhanced Insights
              </div>
              
              {results.generated_content.topic_summary && (
                <div className="topic-summary mb-4">
                  <h4>Topic Summary</h4>
                  <p>{results.generated_content.topic_summary}</p>
                </div>
              )}

              {results.generated_content.predicted_long_question && (
                <div className="predicted-question">
                  <h4>Predicted Important Question</h4>
                  <div className="glass-card prediction-card">
                    <p>{results.generated_content.predicted_long_question.question}</p>
                    <span className="badge badge-purple">{results.generated_content.predicted_long_question.marks} Marks</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="questions-list">
            {(results.retrieved_questions || results.questions)?.length > 0 ? (results.retrieved_questions || results.questions).map((q, i) => (
              <div key={i} className="glass-card question-card">
                <div className="question-meta">
                  {q.year && <span className="badge badge-blue"><Clock size={11} /> {q.year}</span>}
                  {q.marks && <span className="badge badge-orange">{q.marks} Marks</span>}
                  {q.exam_type && <span className="badge badge-blue">{q.exam_type}</span>}
                </div>
                <p className="question-text">{q.question?.question_text || q.text || 'No text available'}</p>
                {q.question?.visual_content_latex && (
                  <div className="latex-content">
                    <small>Visual Content (LaTeX):</small>
                    <pre>{q.question.visual_content_latex}</pre>
                  </div>
                )}
                {q.question?.subquestions?.length > 0 && (
                  <div className="subquestions">
                    {q.question.subquestions.map((sub, si) => (
                      <div key={si} className="subq-container">
                        <div className="subq">
                          <span className="subq-label">{sub.label ? `(${sub.label})` : '•'}</span>
                          <span>{sub.text}</span>
                          {sub.marks && <span className="subq-marks">[{sub.marks}M]</span>}
                        </div>
                        {sub.visual_content_latex && (
                          <div className="latex-content sub">
                            <pre>{sub.visual_content_latex}</pre>
                          </div>
                        )}
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
