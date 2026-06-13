import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

const AILatexConverter = ({ originalText, className = "" }) => {
  const [formattedText, setFormattedText] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper function to detect if text contains LaTeX formatting
  const hasLatex = (str) => {
    if (!str) return false;
    // Check for common LaTeX math delimiters and commands
    return (
      str.includes('$') || 
      str.includes('\\frac') || 
      str.includes('\\int') || 
      str.includes('\\sum') || 
      str.includes('\\[') || 
      str.includes('\\(') ||
      str.includes('\\begin') ||
      str.includes('\\textbf') ||
      str.includes('\\hline')
    );
  };

  // The AI heuristic parser that cleans "meaningless words and characters"
  const cleanLatexToReadableFormat = (text) => {
    let clean = text;

    // 1. Remove environment wrappers that break standard reading
    clean = clean.replace(/\\begin{center}/g, '');
    clean = clean.replace(/\\end{center}/g, '');
    clean = clean.replace(/\\begin{tabular}{[^}]+}/g, '');
    clean = clean.replace(/\\end{tabular}/g, '');
    clean = clean.replace(/\\hline/g, '───────────────────────────────────────────\n');
    
    // 2. Clean up formatting commands
    clean = clean.replace(/\\textbf{([^}]+)}/g, '$1');
    clean = clean.replace(/\\textit{([^}]+)}/g, '$1');
    clean = clean.replace(/\\textless{}/g, '<');
    clean = clean.replace(/\\textgreater{}/g, '>');
    clean = clean.replace(/\\multicolumn{\d+}{[^}]+}{([^}]+)}/g, '$1');
    clean = clean.replace(/\\quad/g, '   ');
    
    // 3. Convert table cells to readable spacing
    clean = clean.replace(/&/g, ' │ ');
    
    // 4. Convert row endings to newlines
    clean = clean.replace(/\\\\/g, '\n');

    // 5. Cleanup extra spacing around block elements
    clean = clean.replace(/\n\s*\n/g, '\n');
    
    // Strip leading/trailing whitespaces
    return clean.trim();
  };

  useEffect(() => {
    const processLatex = async () => {
      if (!hasLatex(originalText)) {
        setFormattedText(originalText);
        setIsProcessing(false);
        return;
      }

      setIsProcessing(true);
      try {
        // This is where the AI Intelligence Layer asynchronously processes the LaTeX text.
        // E.g., making a fetch request to your backend LLM route to cleanly structure the text.
        /*
          const response = await fetch('/api/ai/format-latex', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: originalText })
          });
          const data = await response.json();
          setFormattedText(data.formatted_text);
        */

        // We simulate the AI backend's asynchronous processing time (e.g., 2000ms latency)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Apply the AI heuristic parsing to strip meaningless tokens into a readable format
        const cleanedText = cleanLatexToReadableFormat(originalText);
        setFormattedText(cleanedText);
      } catch (error) {
        console.error('AI Latex formatting failed:', error);
        setFormattedText(originalText); // Fallback to original text on failure
      } finally {
        setIsProcessing(false);
      }
    };

    processLatex();
  }, [originalText]);

  // Handle the Loading UI while the AI is improving the LaTeX
  if (isProcessing) {
    return (
      <div className={`flex flex-col gap-2 p-3 my-2 rounded-lg border border-purple-500/30 bg-purple-900/10 ${className}`}>
        <div className="flex items-center gap-2 text-accent-primary">
          <Loader2 className="animate-spin" size={16} />
          <span className="font-medium text-sm flex items-center gap-1.5">
            <Sparkles size={14} />
            AI Layer: Structuring LaTeX into formal text asynchronously...
          </span>
        </div>
        <p className="text-xs text-secondary opacity-50 italic line-clamp-1">
          {originalText}
        </p>
      </div>
    );
  }

  // If no LaTeX was detected, we render it normally without any AI overhead
  if (!hasLatex(originalText)) {
    return <div className={`text-inherit ${className}`}>{formattedText}</div>;
  }

  // Once AI has finished processing the LaTeX into a formal format, render the result.
  return (
    <div className={`ai-formatted-result p-4 rounded-lg border border-green-500/20 bg-green-900/10 my-2 shadow-[0_0_15px_rgba(34,197,94,0.05)] transition-all duration-500 ${className}`}>
      <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold mb-3 uppercase tracking-wider">
        <Sparkles size={12} /> AI Formatted Output (Readable Text)
      </div>
      <div className="font-mono text-sm whitespace-pre-wrap text-blue-100/90 leading-relaxed overflow-x-auto">
         {formattedText || ''}
      </div>
    </div>
  );
};

export default AILatexConverter;
