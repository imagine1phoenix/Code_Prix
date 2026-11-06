'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Monaco to prevent SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodeEditorProps {
  language: 'cpp17' | 'python3' | 'java17';
  value: string;
  onChange: (value: string) => void;
  fontSize?: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  value,
  onChange,
  fontSize = 14,
}) => {
  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case 'cpp17':
        return 'cpp';
      case 'python3':
        return 'python';
      case 'java17':
        return 'java';
      default:
        return 'cpp';
    }
  };

  const handleEditorWillMount = (monaco: typeof import('monaco-editor')) => {
    monaco.editor.defineTheme('f1-paddock-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6C7086', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'CE2F2C', fontStyle: 'bold' },
        { token: 'identifier', foreground: 'E5E7EB' },
        { token: 'number', foreground: 'F5C518' },
        { token: 'string', foreground: '2BB673' },
        { token: 'type', foreground: '8F9CF8', fontStyle: 'bold' },
      ],
      colors: {
        'editor.background': '#0A0A0C',
        'editor.foreground': '#E5E7EB',
        'editor.lineHighlightBackground': '#141518',
        'editorLineNumber.foreground': '#3B3B42',
        'editorLineNumber.activeForeground': '#CE2F2C',
        'editorCursor.foreground': '#CE2F2C',
        'editor.selectionBackground': '#CE2F2C40',
        'editorIndentGuide.background': '#1A1B20',
        'editorIndentGuide.activeBackground': '#2A2B32',
      },
    });
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0A0A0C]">
      <MonacoEditor
        height="100%"
        width="100%"
        language={getMonacoLanguage(language)}
        value={value}
        theme="f1-paddock-dark"
        beforeMount={handleEditorWillMount}
        onChange={(val) => onChange(val || '')}
        options={{
          fontSize,
          fontFamily: '"JetBrains Mono", monospace',
          fontLigatures: true,
          lineHeight: 22,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          padding: { top: 12, bottom: 12 },
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          // Anti-Cheat constraints per PRD section 7:
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          snippetSuggestions: 'none',
          wordBasedSuggestions: 'off',
        }}
        loading={
          <div className="w-full h-full flex items-center justify-center bg-[#0A0A0C] text-xs font-mono text-[#8A8A93]">
            INITIALIZING MONACO RACING COCKPIT...
          </div>
        }
      />
    </div>
  );
};

