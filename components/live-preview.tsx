"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Maximize2, Minimize2, AlertCircle, CheckCircle } from "lucide-react"

interface LivePreviewProps {
  html: string
  css: string
  js: string
  isRunning: boolean
  onToggleRun: () => void
  onReset: () => void
  isDarkMode?: boolean
}

export function LivePreview({ html, css, js, isRunning, onToggleRun, onReset, isDarkMode = false }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isMaximized, setIsMaximized] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState<Array<{ type: string; message: string; timestamp: string }>>([])
  const [showConsole, setShowConsole] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    if (iframeRef.current) {
      const iframe = iframeRef.current
      const document = iframe.contentDocument || iframe.contentWindow?.document

      if (document) {
        const fullHTML = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>DevMirror Preview</title>
            <style>
              ${css}
            </style>
          </head>
          <body>
            ${html}
            <script>
              // Capture console logs and errors
              const originalLog = console.log;
              const originalError = console.error;
              const originalWarn = console.warn;
              
              console.log = function(...args) {
                originalLog.apply(console, args);
                window.parent.postMessage({
                  type: 'console',
                  level: 'log',
                  args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
                }, '*');
              };
              
              console.error = function(...args) {
                originalError.apply(console, args);
                window.parent.postMessage({
                  type: 'console',
                  level: 'error',
                  args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
                }, '*');
              };

              console.warn = function(...args) {
                originalWarn.apply(console, args);
                window.parent.postMessage({
                  type: 'console',
                  level: 'warn',
                  args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
                }, '*');
              };
              
              window.addEventListener('error', function(e) {
                window.parent.postMessage({
                  type: 'console',
                  level: 'error',
                  args: [e.message + ' at line ' + e.lineno]
                }, '*');
              });
              
              try {
                ${js}
              } catch (error) {
                console.error('JavaScript Error:', error.message);
              }
            </script>
          </body>
          </html>
        `

        document.open()
        document.write(fullHTML)
        document.close()
      }
    }
  }, [html, css, js, isRunning])

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "console") {
        const newMessage = {
          type: event.data.level,
          message: event.data.args.join(" "),
          timestamp: new Date().toLocaleTimeString(),
        }

        setConsoleOutput((prev) => [...prev.slice(-49), newMessage])
        setHasError(event.data.level === "error")
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  const clearConsole = () => {
    setConsoleOutput([])
    setHasError(false)
  }

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
      {/* Preview Header */}
      <div className={`p-3 ${isDarkMode ? "border-slate-700 bg-slate-800/50" : "border-gray-200 bg-gray-50"} border-b`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isRunning ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
              <span className={`${isDarkMode ? "text-white" : "text-gray-900"} font-medium text-sm`}>Live Preview</span>
              {hasError && (
                <Badge variant="destructive" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Error
                </Badge>
              )}
              {isRunning && !hasError && (
                <Badge
                  variant="secondary"
                  className={`text-xs ${isDarkMode ? "bg-green-100 text-green-700" : "bg-green-100 text-green-700"}`}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Running
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowConsole(!showConsole)}
              className={`h-7 w-7 p-0 ${isDarkMode ? "text-slate-400 hover:text-white hover:bg-slate-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
              title="Toggle Console"
            >
              <span className="text-xs">{}</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onReset}
              className={`h-7 w-7 p-0 ${isDarkMode ? "text-slate-400 hover:text-white hover:bg-slate-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
              title="Reset Preview"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleRun}
              className={`h-7 w-7 p-0 ${isDarkMode ? "text-slate-400 hover:text-white hover:bg-slate-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
              title={isRunning ? "Pause Preview" : "Run Preview"}
            >
              {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMaximized(!isMaximized)}
              className={`h-7 w-7 p-0 ${isDarkMode ? "text-slate-400 hover:text-white hover:bg-slate-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
              title={isMaximized ? "Minimize" : "Maximize"}
            >
              {isMaximized ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Preview */}
        <div className={`${showConsole ? "flex-1" : "h-full"} bg-white relative`}>
          {isRunning ? (
            <iframe
              ref={iframeRef}
              className="w-full h-full border-none"
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="text-6xl mb-4">⏸️</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Preview Paused</h3>
                <p className="text-gray-500 mb-4">Click the play button to run your code</p>
                <Button onClick={onToggleRun} className="bg-green-600 hover:bg-green-700 text-white">
                  <Play className="h-4 w-4 mr-2" />
                  Run Preview
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Console */}
        {showConsole && (
          <div
            className={`h-48 ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-gray-900 border-gray-700"} border-t`}
          >
            <div className="flex items-center justify-between p-2 border-b border-slate-700">
              <span className="text-white text-sm font-medium">Console</span>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearConsole}
                  className="h-6 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowConsole(false)}
                  className="h-6 text-xs text-slate-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="p-2 h-40 overflow-y-auto font-mono text-sm">
              {consoleOutput.length === 0 ? (
                <div className="text-slate-500 text-center py-8">Console output will appear here...</div>
              ) : (
                consoleOutput.map((output, index) => (
                  <div
                    key={index}
                    className={`mb-1 ${
                      output.type === "error"
                        ? "text-red-400"
                        : output.type === "warn"
                          ? "text-yellow-400"
                          : "text-green-400"
                    }`}
                  >
                    <span className="text-slate-500 text-xs mr-2">{output.timestamp}</span>
                    <span
                      className={`${
                        output.type === "error"
                          ? "text-red-400"
                          : output.type === "warn"
                            ? "text-yellow-400"
                            : "text-white"
                      }`}
                    >
                      {output.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
