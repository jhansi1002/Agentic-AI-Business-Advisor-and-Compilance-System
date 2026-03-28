import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function PlanViewer({ markdownContent }) {
  if (!markdownContent) return null;

  return (
    <div className="markdown-body">
      <ReactMarkdown>
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}
