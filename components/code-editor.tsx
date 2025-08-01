"use client"

import Editor, { OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { useEffect, useRef, useState } from "react";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isDarkMode?: boolean;
  roomName?: string; // for collaboration
}

export function CodeEditor({ language, value, onChange, className, isDarkMode = false, roomName = "devmirror-room" }: CodeEditorProps) {
  const editorRef = useRef<import("monaco-editor").editor.IStandaloneCodeEditor | null>(null);
  const ydocRef = useRef<Y.Doc>();
  const providerRef = useRef<WebsocketProvider>();
  const yTextRef = useRef<Y.Text>();
  const bindingRef = useRef<MonacoBinding | null>(null);
  const [lineCount, setLineCount] = useState(1)
  const [awarenessUsers, setAwarenessUsers] = useState<any[]>([])

  useEffect(() => {
    ydocRef.current = new Y.Doc();
    providerRef.current = new WebsocketProvider("wss://demos.yjs.dev", roomName, ydocRef.current);
    yTextRef.current = ydocRef.current.getText("monaco");
    // Awareness (team presence)
    const awareness = providerRef.current.awareness;
    awareness.setLocalStateField("user", {
      name: "User-" + Math.floor(Math.random() * 1000),
      color: `hsl(${Math.floor(Math.random() * 360)},70%,60%)`
    });
    const onAwarenessChange = () => {
      const states = Array.from(awareness.getStates().values());
      setAwarenessUsers(states.map(s => s.user).filter(Boolean));
    };
    awareness.on("change", onAwarenessChange);
    onAwarenessChange();
    return () => {
      awareness.off("change", onAwarenessChange);
      providerRef.current?.destroy();
      ydocRef.current?.destroy();
    };
  }, [roomName]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    if (yTextRef.current && providerRef.current) {
      bindingRef.current = new MonacoBinding(
        yTextRef.current,
        editor.getModel()!,
        new Set([editor]),
        providerRef.current.awareness
      );
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(value)
      setLineCount(value.split("\n").length)
    }
  }, [value])

  const handleChange = (newValue: string) => {
    onChange(newValue)
    setLineCount(newValue.split("\n").length)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.substring(0, start) + "  " + value.substring(end)
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
      const newValue = value.substring(0, start) + pairs[e.key] + value.substring(end)
      onChange(newValue)

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1
      }, 0)
    }
  }

  return (
    <div className="relative h-full">
      {/* Team Presence Bar */}
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
        {awarenessUsers.map((user, i) => (
          <div key={i} className="flex items-center space-x-1">
            <span style={{ background: user.color }} className="w-3 h-3 rounded-full inline-block"></span>
            <span className="text-xs text-white bg-black/60 px-2 py-0.5 rounded">{user.name}</span>
          </div>
        ))}
      </div>
      <Editor
        height="100%"
        defaultLanguage={language}
        defaultValue={value}
        theme={isDarkMode ? "vs-dark" : "light"}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        className={className}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        placeholder={`Enter your ${language.toUpperCase()} code here...

Tips:
• Use Tab for indentation
• Brackets auto-close
• Ctrl+S to save
• AI assistant available on the right`}
        spellCheck={false}
        style={{
          paddingLeft: "3.5rem",
          fontFamily: '"Fira Code", "JetBrains Mono", "SF Mono", Consolas, monospace',
          fontSize: "14px",
          lineHeight: "1.6",
        }}
      />
    </div>
  )
}

export default CodeEditor