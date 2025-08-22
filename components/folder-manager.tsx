import React, { useState } from 'react';


// Accept the full FileItem tree structure
export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  parentId: string | null;
  content?: string;
  language?: string;
  children?: FileItem[];
  isOpen?: boolean;
  lastModified: string;
  isModified?: boolean;
}

interface FolderManagerProps {
  files: FileItem[];
  setFiles: (files: FileItem[]) => void;
  activeFileId: string | null;
  setActiveFileId: (id: string) => void;
}

const FolderManager: React.FC<FolderManagerProps> = ({ files, setFiles, activeFileId, setActiveFileId }) => {
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showFiles, setShowFiles] = useState(true);

  // Add file to the root folder (for demo; you can enhance to add to selected folder)
  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    // Find root folder
    setFiles(files.map((folder: FileItem) => {
      if (folder.type === 'folder') {
        return {
          ...folder,
          children: [
            ...(folder.children || []),
            {
              id: Date.now().toString(),
              name: newFileName,
              type: 'file',
              parentId: folder.id,
              content: '',
              lastModified: new Date().toISOString(),
              isModified: false,
            }
          ]
        }
      }
      return folder;
    }));
    setNewFileName('');
  };

  // Recursive render for folders and files, with add file input inside folder
  const renderTree = (items: FileItem[], level = 0) => (
    <div className={level === 0 ? '' : 'ml-3 border-l border-[#23272f] pl-2'}>
      {items.map(item => (
        <React.Fragment key={item.id}>
          {item.type === 'folder' ? (
            <div>
              <div className="flex items-center gap-2 mb-1 px-2 py-1 rounded cursor-pointer transition-colors text-white font-medium">
                <span className="mr-1 text-blue-400">{/* folder icon */}
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#60a5fa" strokeWidth="2" d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></svg>
                </span>
                <span>{item.name}</span>
              </div>
              {/* Add file input inside folder */}
              <div className="flex gap-2 mb-2 mt-1">
                <input
                  className="flex-1 px-2 py-1 rounded bg-[#23272f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="filename"
                  value={newFileName}
                  onChange={e => setNewFileName(e.target.value)}
                />
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-medium shadow-sm transition disabled:opacity-50"
                  onClick={() => {
                    if (!newFileName.trim()) return;
                    setFiles(files.map((folder: FileItem) => {
                      if (folder.id === item.id) {
                        return {
                          ...folder,
                          children: [
                            ...(folder.children || []),
                            {
                              id: Date.now().toString(),
                              name: newFileName,
                              type: 'file',
                              parentId: folder.id,
                              content: '',
                              lastModified: new Date().toISOString(),
                              isModified: false,
                            }
                          ]
                        }
                      }
                      return folder;
                    }));
                    setNewFileName('');
                  }}
                >
                  Add
                </button>
              </div>
              {/* Render children recursively */}
              {item.children && renderTree(item.children, level + 1)}
            </div>
          ) : (
            <div
              className={`flex items-center gap-2 mb-1 px-2 py-1 rounded cursor-pointer transition-colors ${activeFileId === item.id ? 'bg-[#23272f] text-blue-400' : 'text-gray-200 hover:bg-[#23272f]'}`}
              onClick={() => setActiveFileId(item.id)}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#23272f] border border-[#23272f] text-xs font-mono mr-1">
                {item.name.endsWith('.js') && <span title="JavaScript">🟨</span>}
                {item.name.endsWith('.ts') && <span title="TypeScript">🟦</span>}
                {item.name.endsWith('.html') && <span title="HTML">🟧</span>}
                {item.name.endsWith('.css') && <span title="CSS">🟦</span>}
                {!(item.name.endsWith('.js') || item.name.endsWith('.ts') || item.name.endsWith('.html') || item.name.endsWith('.css')) && <span>{item.name[0].toUpperCase()}</span>}
              </span>
              <span className="truncate text-sm font-medium">{item.name}</span>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="p-4 bg-[#181c23] h-full w-64 flex flex-col border-r border-[#23272f]">
      {/* Header */}
      <div className="flex items-center mb-4">
        <span className="text-lg font-semibold text-white flex-1">Project Files</span>
        <button className="ml-2 text-white bg-[#23272f] rounded p-1 hover:bg-[#2a2e38]" title="Add new folder (coming soon)" disabled>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#fff" strokeWidth="2" d="M12 5v14m7-7H5"/></svg>
        </button>
      </div>
      {/* Search Bar */}
      <input
        className="w-full mb-3 px-2 py-1 rounded bg-[#23272f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search files..."
        disabled
      />
      {/* Add File Row */}
      <div className="flex items-center gap-2 mb-2">
        <input
          className="flex-1 px-2 py-1 rounded bg-[#23272f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="filename"
          value={newFileName}
          onChange={e => setNewFileName(e.target.value)}
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-medium shadow-sm transition disabled:opacity-50"
          onClick={handleAddFile}
        >
          Add
        </button>
      </div>
      {/* Add Folder Row (disabled for now) */}
      <div className="flex items-center gap-2 mb-4 opacity-60">
        <input
          className="flex-1 px-2 py-1 rounded bg-[#23272f] text-white placeholder-gray-400 focus:outline-none"
          placeholder="folder"
          value={newFolderName}
          onChange={e => setNewFolderName(e.target.value)}
          disabled
        />
        <button className="bg-green-600 text-white px-3 py-1 rounded cursor-not-allowed" disabled>Add</button>
      </div>
      {/* File Tree */}
      <div>
        <div
          className="flex items-center cursor-pointer text-white mb-2 select-none group"
          onClick={() => setShowFiles(v => !v)}
        >
          <span className="mr-2 text-xs transition-transform group-hover:scale-110">{showFiles ? '▼' : '▶'}</span>
          <span className="font-medium">My Project</span>
        </div>
        {showFiles && (
          <div>
            {files.length === 0 && (
              <div className="text-gray-500 text-xs italic py-2">No files yet</div>
            )}
            {renderTree(files, 0)}
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderManager;
