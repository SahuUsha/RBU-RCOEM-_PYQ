import React, { useState } from 'react';
import { Search, Loader2, BookOpen, Clock, AlertCircle, Sparkles, Target, FileQuestion, HelpCircle } from 'lucide-react';
import AILatexConverter from './AILatexConverter';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch results. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-4xl mb-4">
          Intelligent <span className="text-gradient">Question Search</span>
        </h1>
        <p className="text-secondary text-lg">
          Explore past questions, discover similarities, and get AI-predicted insights.
        </p>
      </div>

      <div className="glass-panel p-6 mb-8 max-w-3xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
            <input
              type="text"
              className="input-glass pl-12"
              placeholder="E.g. dimension model, OLAP operations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading || !query.trim()}>
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="glass-panel p-4 mb-8 bg-black/40 border-red-500/30 text-center max-w-3xl mx-auto flex items-center justify-center gap-3">
          <AlertCircle className="text-red-400" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {results && (
        <div className="animate-fade-in grid gap-8 lg:grid-cols-3">
          {/* Main Results Column */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl flex items-center gap-2 mb-6">
              <BookOpen className="text-accent-primary" />
              Retrieved Questions
              <span className="badge badge-purple ml-2">{results.retrieved_questions?.length || 0} found</span>
            </h2>

            {results.retrieved_questions?.map((item) => (
              <div key={item.id} className="glass-card">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge badge-blue flex items-center gap-1">
                    <Clock size={12} /> {item.year}
                  </span>
                  <span className="badge badge-pink">{item.subject}</span>
                  <span className="badge badge-purple">{item.semester}</span>
                  <span className="badge badge-blue">{item.marks} Marks</span>
                  <span className="badge badge-purple">{item.exam_type}</span>
                </div>
                
                {item.question?.question_text && (
                  <AILatexConverter className="text-lg font-medium mb-4" originalText={item.question.question_text} />
                )}

                {item.question?.subquestions?.length > 0 && (
                  <div className="pl-4 border-l-2 border-panel-border space-y-3">
                    {item.question.subquestions.map((sub, idx) => (
                      <div key={idx} className="flex gap-3 text-secondary">
                        <span className="font-semibold text-accent-primary shrink-0">
                          {sub.label ? `(${sub.label})` : '•'}
                        </span>
                        <AILatexConverter originalText={sub.text} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {(!results.retrieved_questions || results.retrieved_questions.length === 0) && (
               <div className="glass-card text-center text-muted py-10">
                 No questions found for this query in the database.
               </div>
            )}
          </div>

          {/* AI Insights Column */}
          <div className="space-y-6">
            {results.generated_content && (
              <>
                <div className="glass-panel p-6">
                  <h3 className="text-xl flex items-center gap-2 mb-4">
                    <Sparkles className="text-accent-secondary" />
                    AI Topic Summary
                  </h3>
                  <p className="text-secondary text-sm leading-relaxed">
                    {results.generated_content.topic_summary}
                  </p>
                </div>

                <div className="glass-panel p-6">
                  <h3 className="text-xl flex items-center gap-2 mb-4">
                    <Target className="text-accent-primary" />
                    Predicted Long Question
                  </h3>
                  <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                     <p className="text-sm text-primary mb-3 font-medium">
                       {results.generated_content.predicted_long_question?.question}
                     </p>
                     <div className="flex justify-between items-center text-xs">
                        <span className="badge badge-pink">{results.generated_content.predicted_long_question?.type}</span>
                        <span className="badge badge-blue">{results.generated_content.predicted_long_question?.marks} Marks</span>
                     </div>
                  </div>
                </div>

                <div className="glass-panel p-6">
                  <h3 className="text-xl flex items-center gap-2 mb-4">
                    <FileQuestion className="text-accent-secondary" />
                    Similar Questions
                  </h3>
                  <div className="space-y-4">
                    {results.generated_content.similar_questions?.map((sq, idx) => (
                      <div key={idx} className="glass-card p-4 !bg-black/20">
                        <div className="flex gap-2 items-start">
                           <HelpCircle className="text-muted shrink-0 mt-1" size={16} />
                           <div>
                              <p className="text-sm mb-2">{sq.question}</p>
                              <div className="flex gap-2">
                                <span className="badge badge-purple">{sq.type}</span>
                                <span className="badge badge-blue">{sq.marks} Marks</span>
                              </div>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
