"use client";
import 'monaco-editor/min/vs/editor/editor.main.css';

import Editor from "@monaco-editor/react";
import * as Yjs from "yjs";
import { WebsocketProvider as YWebsocketProvider } from "y-websocket";
import { MonacoBinding as YMonacoBinding } from "y-monaco";
import { useEffect, useRef, useState } from "react";


interface CodeEditorProps {
  files: Array<{ id: any; name: string; content: string }>;
  setFiles: (files: Array<{ id: any; name: string; content: string }>) => void;
  activeFileId: any;
  setActiveFileId: (id: any) => void;
  onChange: (value: string) => void;
  className?: string;
  isDarkMode?: boolean;
  roomName?: string;
}

// VS Code-like file structure for tabs and sidebar


export function CodeEditor({ files, setFiles, activeFileId, setActiveFileId, onChange, className, isDarkMode = false, roomName = "devmirror-room" }: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const ydocRef = useRef<any>(null);
  const providerRef = useRef<any>(null);
  const yTextRef = useRef<any>(null);
  const bindingRef = useRef<any>(null);
  const [lineCount, setLineCount] = useState(1)
  const [awarenessUsers, setAwarenessUsers] = useState<any[]>([])

  useEffect(() => {
    ydocRef.current = new Yjs.Doc();
    providerRef.current = new YWebsocketProvider("wss://demos.yjs.dev", roomName, ydocRef.current);
    yTextRef.current = ydocRef.current.getText("monaco");
    // Awareness (team presence)
    const awareness = providerRef.current.awareness;
    awareness.setLocalStateField("user", {
      name: "User-" + Math.floor(Math.random() * 1000),
      color: `hsl(${Math.floor(Math.random() * 360)},70%,60%)`
    });
    const onAwarenessChange = () => {
      const states = Array.from(awareness.getStates().values());
      setAwarenessUsers(states.map((s: any) => s.user).filter(Boolean));
    };
    awareness.on("change", onAwarenessChange);
    onAwarenessChange();
    return () => {
      awareness.off("change", onAwarenessChange);
      providerRef.current?.destroy();
      ydocRef.current?.destroy();
    };
  }, [roomName]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    if (yTextRef.current && providerRef.current) {
      bindingRef.current = new YMonacoBinding(
        yTextRef.current,
        editor.getModel()!,
        new Set([editor]),
        providerRef.current.awareness
      );
    }
  };

  // Find the active file
  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  useEffect(() => {
    if (editorRef.current && activeFile) {
      // Only update value if it's different to avoid resetting cursor
      if (editorRef.current.getValue() !== activeFile.content) {
        editorRef.current.setValue(activeFile.content)
      }
      setLineCount((activeFile.content || '').split("\n").length)
    }
  }, [activeFile])

  const handleChange = (newValue: string) => {
    onChange(newValue)
    setLineCount((newValue || '').split("\n").length)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!activeFile) return;
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = (activeFile.content || '').substring(0, start) + "  " + (activeFile.content || '').substring(end)
      onChange(newValue)

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }

    // Auto-close brackets and quotes
    const pairs: { [key: string]: string } = {
      "(": ")",
      "[": "]",
      "{": "}",
      '"': '"',
      "'": "'",
    }
    if (e.key in pairs) {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = (activeFile.content || '').substring(0, start) + pairs[e.key] + (activeFile.content || '').substring(end)
      onChange(newValue)

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1
      }, 0)
    }
  }

  

  // Determine Monaco language from file extension
  const getLanguageFromFileName = (name: string) => {
    if (name.endsWith('.html')) return 'html';
    if (name.endsWith('.css')) return 'css';
    if (name.endsWith('.js')) return 'javascript';
    if (name.endsWith('.ts')) return 'typescript';
    if (name.endsWith('.json')) return 'json';
    if (name.endsWith('.md')) return 'markdown';
    return 'plaintext';
  };
  const activeLanguage = getLanguageFromFileName(activeFile?.name || '');

  // Tab switching
  const handleTabClick = (id: any) => setActiveFileId(id);

  // File content change
  const handleFileChange = (newValue: string) => {
    setFiles(files.map(f => f.id === activeFileId ? { ...f, content: newValue } : f));
    onChange(newValue);
  };

  // ...existing code...
  return (
    <div className="relative h-full flex">
      {/* Sidebar removed */}
      <div className="flex-1 flex flex-col">
        {/* Tab bar */}
        <div className="flex h-10 bg-gray-800 border-b border-gray-700">
          {files.map(file => (
            <button
              key={file.id}
              onClick={() => handleTabClick(file.id)}
              className={`px-4 h-full flex items-center ${file.id === activeFileId ? 'bg-gray-900 text-white' : 'text-gray-300'}`}
            >
              {file.name}
            </button>
          ))}
        </div>
        {/* Team Presence Bar */}
        <div className="absolute top-2 right-2 z-10 flex space-x-2">
          {awarenessUsers.map((user, i) => (
            <div key={i} className="flex items-center space-x-1">
              <span style={{ background: user.color }} className="w-3 h-3 rounded-full inline-block"></span>
              <span className="text-xs text-white bg-black/60 px-2 py-0.5 rounded">{user.name}</span>
            </div>
          ))}
        </div>
        {/* Editor */}
        <Editor
          height="100%"
          language={activeLanguage}
          value={activeFile.content}
          theme={isDarkMode ? "vs-dark" : "light"}
          onChange={handleFileChange}
          onMount={handleEditorDidMount}
          className={className}
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            wordWrap: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
          placeholder={`Enter your code here...\n\nTips:\n• Use Tab for indentation\n• Brackets auto-close\n• Ctrl+S to save\n• AI assistant available on the right`}
          spellCheck={false}
          style={{
            paddingLeft: "3.5rem",
            fontFamily: '"Fira Code", "JetBrains Mono", "SF Mono", Consolas, monospace',
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor

// Example: Simple TypeScript code for testing
const hardCoreExample = '// TypeScript Example: Greet Function\n'
  + 'function greet(name: string): string {\n'
  + '  return \'Hello, \'+ name +\'!\';\n'
  + '}\n\n'
  + 'const message = greet("World");\n'
  + 'console.log(message); // Output: Hello, World!\n';