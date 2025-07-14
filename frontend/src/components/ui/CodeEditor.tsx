
'use client';

import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, onChange }) {
    return (
        <Editor
            height="70vh"
            defaultLanguage="python"
            defaultValue="# Your code here"
            theme="vs-dark"
            value={code}
            onChange={(value) => onChange(value || '')}
        />
    );
}
