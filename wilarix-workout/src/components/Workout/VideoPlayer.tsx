import { useState, useRef } from 'react';
import { Upload, Download, Trash2, Film, AlertCircle } from 'lucide-react';
import { getVideoForExercise, saveVideo, deleteVideo } from '../../utils/storage';
import { useAuth } from '../../context/AuthContext';

interface Props {
  exerciseId: string;
  exerciseName: string;
}

const MAX_SIZE_MB = 50;

export default function VideoPlayer({ exerciseId, exerciseName }: Props) {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [entry, setEntry] = useState(() => getVideoForExercise(exerciseId));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file (MP4, MOV, etc.)');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Video is too large. Max size is ${MAX_SIZE_MB} MB.`);
      return;
    }
    setError('');
    setUploading(true);
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      const newEntry = { exerciseId, fileName: file.name, dataUrl };
      saveVideo(newEntry);
      setEntry(newEntry);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  function handleDownload() {
    if (!entry) return;
    const a = document.createElement('a');
    a.href = entry.dataUrl;
    a.download = entry.fileName;
    a.click();
  }

  function handleDelete() {
    if (!confirm('Remove this video?')) return;
    deleteVideo(exerciseId);
    setEntry(undefined);
  }

  if (uploading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Uploading video…</p>
      </div>
    );
  }

  if (entry) {
    return (
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <video
          src={entry.dataUrl}
          controls
          className="w-full max-h-64 bg-black"
          playsInline
        />
        <div className="px-3 py-2 flex items-center justify-between gap-2">
          <span className="text-gray-400 text-xs truncate flex-1">{entry.fileName}</span>
          <div className="flex gap-2">
            <button onClick={handleDownload} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
            {user?.isAdmin && (
              <>
                <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300">
                  <Upload className="w-3.5 h-3.5" /> Replace
                </button>
                <button onClick={handleDelete} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </>
            )}
          </div>
        </div>
        <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-6 flex flex-col items-center gap-3 text-center">
      <Film className="w-10 h-10 text-gray-600" />
      <div>
        <p className="text-gray-400 text-sm font-medium">{exerciseName}</p>
        <p className="text-gray-600 text-xs mt-0.5">No video uploaded yet</p>
      </div>
      {user?.isAdmin ? (
        <>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload MP4 Video
          </button>
          <p className="text-gray-600 text-xs">Max {MAX_SIZE_MB} MB · MP4, MOV, WebM supported</p>
        </>
      ) : (
        <p className="text-gray-500 text-xs">Video coming soon — check back later!</p>
      )}
      {error && (
        <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}
