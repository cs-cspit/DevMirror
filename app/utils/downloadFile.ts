// utils/downloadFile.ts
export async function downloadFile(type: 'single' | 'folder', name: string, token: string) {
  try {
    const response = await fetch('http://localhost:3000/api/files/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // JWT token
      },
      body: JSON.stringify(
        type === 'single'
          ? { type, fileName: name }
          : { type, folderName: name }
      ),
    });

    if (!response.ok) {
      const err = await response.json();
      alert(err.message);
      return;
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = type === 'single' ? name : `${name}.zip`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

  } catch (error) {
    console.error('Download failed:', error);
    alert('Download failed');
  }
}
