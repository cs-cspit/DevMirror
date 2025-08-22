"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Send, Lightbulb, Zap, Copy, Check, Wand2, Code, Palette, Bot } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIAssistantProps {
  currentCode: {
    html: string
    css: string
    js: string
  }
  onCodeSuggestion: (code: string, language: string) => void
  isDarkMode?: boolean
}

export function AIAssistant({ currentCode, onCodeSuggestion, isDarkMode = true }: AIAssistantProps) {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [suggestions, setSuggestions] = useState<
    Array<{
      type: string
      title: string
      description: string
      code: string
      language: string
      icon: React.JSX.Element
    }>
  >([])
  const { toast } = useToast()

  const quickSuggestions = [
    {
      type: "enhancement",
      title: "Add Responsive Design",
      description: "Make your layout mobile-friendly with modern CSS techniques",
      code: `/* Responsive Design Enhancement */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
    max-width: 100%;
    margin: 0 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  button {
    width: 100%;
    margin-top: 1rem;
  }
}

/* Flexible grid system */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* Mobile-first approach */
.mobile-menu {
  display: none;
}

@media (max-width: 768px) {
  .mobile-menu {
    display: block;
  }
  
  .desktop-menu {
    display: none;
  }
}`,
      language: "css",
      icon: <Palette className="h-4 w-4" />,
    },
    {
      type: "feature",
      title: "Add Dark Mode Toggle",
      description: "Implement a smooth dark/light mode switcher with animations",
      code: `// Dark Mode Toggle with Smooth Transitions
function initDarkMode() {
  const darkModeToggle = document.createElement('button');
  darkModeToggle.innerHTML = '🌙';
  darkModeToggle.className = 'dark-mode-toggle';
  darkModeToggle.style.cssText = \`
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255,255,255,0.1);
    border: 2px solid rgba(255,255,255,0.2);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 20px;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    z-index: 1000;
    color: white;
  \`;
  
  darkModeToggle.addEventListener('click', toggleDarkMode);
  darkModeToggle.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
    this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
  const [isLoading, setIsLoading] = useState(false)
  
  darkModeToggle.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = 'none';
  });
  
  document.body.appendChild(darkModeToggle);
  
  // Load saved preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '☀️';
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark.toString());
  
  const toggle = document.querySelector('.dark-mode-toggle');
  toggle.innerHTML = isDark ? '☀️' : '🌙';
  
  // Smooth transition effect
  document.body.style.transition = 'all 0.3s ease';
  
  // Add CSS for dark mode
  if (isDark && !document.querySelector('#dark-mode-styles')) {
    const darkStyles = document.createElement('style');
    darkStyles.id = 'dark-mode-styles';
    darkStyles.textContent = \`
      .dark-mode {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
        color: #ffffff !important;
      }
      .dark-mode .container {
        background: rgba(255,255,255,0.1) !important;
        backdrop-filter: blur(20px) !important;
        border: 1px solid rgba(255,255,255,0.2) !important;
      }
    \`;
    document.head.appendChild(darkStyles);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDarkMode);`,
      language: "javascript",
      icon: <Code className="h-4 w-4" />,
    },
    {
      type: "animation",
      title: "Add Smooth Animations",
      description: "Enhance user experience with beautiful CSS animations",
      code: `/* Smooth Animations & Micro-interactions */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}

/* Apply animations */
.animate-fade-in {
  animation: fadeInUp 0.6s ease-out;
}

.animate-slide-in {
  animation: slideInLeft 0.5s ease-out;
}

.animate-pulse {
  animation: pulse 2s infinite;
}

.animate-bounce {
  animation: bounce 1s;
}

/* Hover effects */
.interactive {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

/* Loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}`,
      language: "css",
      icon: <Wand2 className="h-4 w-4" />,
    },
    {
      type: "optimization",
      title: "Performance Optimization",
      description: "Improve loading speed and user experience",
      code: `// Performance Optimization Techniques
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.optimizeImages();
    this.setupServiceWorker();
    this.measurePerformance();
  }

  // Lazy loading for images
  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    images.forEach(img => imageObserver.observe(img));
  }

  // Optimize images
  optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.loading = 'lazy';
      img.decoding = 'async';
    });
  }

  // Debounce function for scroll events
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Optimize animations with requestAnimationFrame
  smoothAnimation(element, property, target, duration = 300) {
    const start = performance.now();
    const startValue = parseFloat(getComputedStyle(element)[property]);
    
    function animate(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (target - startValue) * easeOutCubic;
      
      element.style[property] = currentValue + 'px';
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  }

  // Measure performance
  measurePerformance() {
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
      console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
    });
  }

  // Setup service worker for caching
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('SW registered:', registration))
        .catch(error => console.log('SW registration failed:', error));
    }
  }
}

// Initialize optimizations
const optimizer = new PerformanceOptimizer();`,
      language: "javascript",
      icon: <Zap className="h-4 w-4" />,
    },
  ]

  const generateAIResponse = (userPrompt: string) => {
    const responses = [
      {
        type: "custom",
        title: "AI Code Solution",
        description: `Custom solution for: "${userPrompt.slice(0, 50)}${userPrompt.length > 50 ? "..." : ""}"`,
        code: generateCodeForPrompt(userPrompt),
        language: detectLanguageFromPrompt(userPrompt),
        icon: <Bot className="h-4 w-4" />,
      },
    ]
    return responses[0]
  }

  const generateCodeForPrompt = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase()

    if (lowerPrompt.includes("button") || lowerPrompt.includes("click")) {
      return `// Interactive Button Enhancement
function createInteractiveButton() {
  const button = document.querySelector('button') || document.createElement('button');
  
  // Enhanced styling
  button.style.cssText = \`
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  \`;
  
  // Add hover effects
  button.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px)';
    this.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
  });
  
  button.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
  });
  
  // Add click animation
  button.addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = 'scale(1)';
    }, 150);
    
    // Your custom click handler here
    console.log('Button clicked with enhanced effects!');
  });
  
  if (!document.body.contains(button)) {
    document.body.appendChild(button);
  }
}

createInteractiveButton();`
    }

    if (lowerPrompt.includes("form") || lowerPrompt.includes("input")) {
      return `<!-- Enhanced Form with Validation -->
<form class="enhanced-form" id="contactForm">
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" required>
    <span class="error-message" id="nameError"></span>
  </div>
  
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>
    <span class="error-message" id="emailError"></span>
  </div>
  
  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" name="message" rows="4" required></textarea>
    <span class="error-message" id="messageError"></span>
  </div>
  
  <button type="submit" class="submit-btn">
    <span class="btn-text">Send Message</span>
    <span class="btn-loader" style="display: none;">Sending...</span>
  </button>
</form>

<style>
.enhanced-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 0.5rem;
  display: block;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}
</style>`
    }

    if (lowerPrompt.includes("animation") || lowerPrompt.includes("animate")) {
      return `/* Advanced CSS Animations */
@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeInScale {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes rotateIn {
  0% {
    transform: rotate(-180deg) scale(0.5);
    opacity: 0;
  }
  100% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
}

/* Animation classes */
.slide-in-left {
  animation: slideInFromLeft 0.6s ease-out;
}

.fade-in-scale {
  animation: fadeInScale 0.5s ease-out;
}

.rotate-in {
  animation: rotateIn 0.8s ease-out;
}

/* Hover animations */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.hover-glow {
  transition: box-shadow 0.3s ease;
}

.hover-glow:hover {
  box-shadow: 0 0 30px rgba(102, 126, 234, 0.6);
}

/* Loading animation */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}`
    }

    // Default response
    return `// AI Generated Solution
// Based on your request: "${prompt}"

function enhanceWebsite() {
  console.log('🤖 AI Enhancement Applied!');
  
  // Add modern styling
  const style = document.createElement('style');
  style.textContent = \`
    * {
      transition: all 0.3s ease;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
    }
    
    .ai-enhanced {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      border-radius: 15px;
      color: white;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      transform: translateY(0);
      transition: transform 0.3s ease;
    }
    
    .ai-enhanced:hover {
      transform: translateY(-5px);
    }
  \`;
  
  document.head.appendChild(style);
  
  // Apply enhancements
  const elements = document.querySelectorAll('div, section, article');
  elements.forEach(el => {
    if (el.children.length > 0) {
      el.classList.add('ai-enhanced');
    }
  });
  
  console.log('✨ Website enhanced with AI suggestions!');
}

// Apply enhancements
enhanceWebsite();`
  }

  const detectLanguageFromPrompt = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase()

    if (lowerPrompt.includes("css") || lowerPrompt.includes("style") || lowerPrompt.includes("animation")) {
      return "css"
    }
    if (lowerPrompt.includes("html") || lowerPrompt.includes("form") || lowerPrompt.includes("element")) {
      return "html"
    }
    return "javascript"
  }

  const handleSuggestion = (suggestion: (typeof quickSuggestions)[0], index: number) => {
    onCodeSuggestion(suggestion.code, suggestion.language)

    // Copy feedback
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)

    toast({
      title: "✨ Code Applied",
      description: `${suggestion.title} has been added to your ${suggestion.language.toUpperCase()}.`,
    })
  }

  const handleCustomPrompt = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)

    // Simulate AI processing with realistic delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(prompt)
      setSuggestions([aiResponse, ...suggestions.slice(0, 4)])
      setPrompt("")
      setIsLoading(false)

      toast({
        title: "🎯 AI Response Generated",
        description: "New code suggestion created based on your prompt.",
      })
    }, 2000)
  }

  const copyToClipboard = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
      toast({
        title: "📋 Copied to Clipboard",
        description: "Code has been copied successfully.",
      })
    } catch (err) {
      toast({
        title: "❌ Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
      <div className={`p-4 ${isDarkMode ? "border-slate-700" : "border-gray-200"} border-b`}>
        <div className="flex items-center space-x-2 mb-4">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-purple-600" : "bg-purple-100"}`}
          >
            <Sparkles className={`h-4 w-4 ${isDarkMode ? "text-white" : "text-purple-600"}`} />
          </div>
          <div>
            <h3 className={`${isDarkMode ? "text-white" : "text-slate-800"} font-semibold`}>AI Assistant</h3>
            <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Powered by advanced AI</p>
          </div>
        </div>

        <div className="space-y-3">
          <Textarea
            placeholder="Ask AI for code suggestions, improvements, or help...

Examples:
• 'Add a contact form with validation'
• 'Make this responsive for mobile'
• 'Add smooth animations to buttons'
• 'Create a dark mode toggle'
• 'Optimize performance'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className={`${isDarkMode ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-gray-200 text-slate-800 placeholder-gray-400"} resize-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
            rows={4}
          />
          <Button
            onClick={handleCustomPrompt}
            disabled={isLoading || !prompt.trim()}
            className={`w-full ${isDarkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-600 hover:bg-purple-700"} transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none`}
            size="sm"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating AI Response...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Ask AI Assistant
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div
          className={`${isDarkMode ? "text-slate-400" : "text-slate-600"} text-sm font-medium mb-3 flex items-center`}
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Quick Suggestions
        </div>

        {quickSuggestions.map((suggestion, index) => (
          <Card
            key={index}
            className={`${isDarkMode ? "bg-slate-700 border-slate-600 hover:bg-slate-600" : "bg-white border-gray-200 hover:bg-gray-50"} transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg group cursor-pointer`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      suggestion.type === "enhancement"
                        ? isDarkMode
                          ? "bg-yellow-600"
                          : "bg-yellow-100"
                        : suggestion.type === "feature"
                          ? (isDarkMode ? "bg-blue-600" : "bg-blue-100")
                          : suggestion.type === "animation"
                            ? isDarkMode
                              ? "bg-purple-600"
                              : "bg-purple-100"
                            : isDarkMode
                              ? "bg-green-600"
                              : "bg-green-100"
                    }`}
                  >
                    {suggestion.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className={`text-sm ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                      {suggestion.title}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {suggestion.language}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(suggestion.code, index)
                    }}
                    className={`h-8 w-8 p-0 ${isDarkMode ? "hover:bg-slate-500" : "hover:bg-gray-200"}`}
                  >
                    {copiedIndex === index ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSuggestion(suggestion, index)
                    }}
                    className={`h-8 w-8 p-0 ${isDarkMode ? "text-purple-400 hover:text-purple-300 hover:bg-slate-500" : "text-purple-600 hover:text-purple-700 hover:bg-purple-50"}`}
                  >
                    <Wand2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className={`${isDarkMode ? "text-slate-300" : "text-slate-600"} text-xs mb-3 leading-relaxed`}>
                {suggestion.description}
              </p>
              <div
                className={`${isDarkMode ? "bg-slate-800" : "bg-gray-50"} p-3 rounded-lg text-xs font-mono ${isDarkMode ? "text-slate-300" : "text-slate-700"} max-h-24 overflow-y-auto border ${isDarkMode ? "border-slate-600" : "border-gray-200"}`}
              >
                {suggestion.code.split("\n").slice(0, 4).join("\n")}
                {suggestion.code.split("\n").length > 4 && (
                  <div className={`${isDarkMode ? "text-slate-500" : "text-gray-400"} mt-1`}>
                    ... {suggestion.code.split("\n").length - 4} more lines
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {suggestions.length > 0 && (
          <>
            <div
              className={`${isDarkMode ? "text-slate-400" : "text-slate-600"} text-sm font-medium mt-6 mb-3 flex items-center`}
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Generated Responses
            </div>
            {suggestions.map((suggestion, index) => (
              <Card
                key={index}
                className={`${isDarkMode ? "bg-gradient-to-br from-slate-700 to-slate-600 border-slate-500" : "bg-gradient-to-br from-white to-purple-50 border-purple-200"} transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg group cursor-pointer`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-purple-600" : "bg-purple-100"}`}
                      >
                        {suggestion.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className={`text-sm ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                          {suggestion.title}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {suggestion.language}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToClipboard(suggestion.code, index + 100)
                        }}
                        className={`h-8 w-8 p-0 ${isDarkMode ? "hover:bg-slate-500" : "hover:bg-purple-100"}`}
                      >
                        {copiedIndex === index + 100 ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSuggestion(suggestion, index + 100)
                        }}
                        className={`h-8 w-8 p-0 ${isDarkMode ? "text-purple-400 hover:text-purple-300 hover:bg-slate-500" : "text-purple-600 hover:text-purple-700 hover:bg-purple-100"}`}
                      >
                        <Wand2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className={`${isDarkMode ? "text-slate-300" : "text-slate-600"} text-xs mb-3 leading-relaxed`}>
                    {suggestion.description}
                  </p>
                  <div
                    className={`${isDarkMode ? "bg-slate-800" : "bg-white"} p-3 rounded-lg text-xs font-mono ${isDarkMode ? "text-slate-300" : "text-slate-700"} max-h-24 overflow-y-auto border ${isDarkMode ? "border-slate-600" : "border-gray-200"}`}
                  >
                    {suggestion.code.split("\n").slice(0, 4).join("\n")}
                    {suggestion.code.split("\n").length > 4 && (
                      <div className={`${isDarkMode ? "text-slate-500" : "text-gray-400"} mt-1`}>
                        ... {suggestion.code.split("\n").length - 4} more lines
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {suggestions.length === 0 && (
          <div className="text-center py-8">
            <Bot className={`h-12 w-12 ${isDarkMode ? "text-slate-600" : "text-gray-300"} mx-auto mb-3`} />
            <p className={`${isDarkMode ? "text-slate-500" : "text-gray-500"} text-sm`}>
              Ask AI anything about your code!
            </p>
            <p className={`${isDarkMode ? "text-slate-600" : "text-gray-400"} text-xs mt-1`}>
              Try asking for features, improvements, or bug fixes
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
