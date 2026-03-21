import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../utils/firebase';

const FileUpload = ({ 
    label, 
    icon: Icon = Upload, 
    required, 
    onUploadComplete, 
    pathPrefix = 'ngos', 
    accept = "image/*",
    initialPreview = null,
    className = ""
}) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState(initialPreview);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }

        setUploading(true);
        const storageRef = ref(storage, `${pathPrefix}/${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
            (snapshot) => {
                const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(p);
            },
            (error) => {
                console.error("Firebase Storage Error:", error.code, error.message);
                setUploading(false);
                let msg = "Upload failed. Please try again.";
                if (error.code === 'storage/unauthorized') msg = "Permission denied. Please ensure you are logged in.";
                if (error.code === 'storage/canceled') msg = "Upload canceled.";
                alert(msg);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    onUploadComplete(downloadURL);
                } catch (err) {
                    console.error("Failed to get download URL:", err);
                    alert("File uploaded but URL retrieval failed.");
                } finally {
                    setUploading(false);
                }
            }
        );
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest flex items-center gap-2 mb-2">
                {Icon && <Icon className="w-3 h-3" />} {label}
                {required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            
            <div className={`relative group border-2 border-dashed rounded-2xl transition-all min-h-[120px] flex items-center justify-center ${uploading ? 'border-orange-500/50 bg-orange-500/5' : 'border-[var(--border-color)] hover:border-orange-500/30'}`}>
                <input 
                    type="file" 
                    accept={accept}
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    disabled={uploading}
                />
                
                <div className="p-4 flex flex-col items-center justify-center gap-2 text-center">
                    {preview ? (
                        <div className="relative group/preview">
                            <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-xl shadow-lg border border-white/10" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                                <span className="text-[10px] text-white font-bold uppercase tracking-tighter">Change</span>
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                            <Upload className={`w-6 h-6 ${uploading ? 'text-orange-500 animate-bounce' : 'text-[var(--text-muted)]'}`} />
                        </div>
                    )}
                    
                    <div className="text-[10px] uppercase tracking-wider font-bold">
                        {uploading ? (
                            <span className="text-orange-500">Uploading {Math.round(progress)}%</span>
                        ) : (
                            <span className="text-[var(--text-secondary)]">
                                {preview ? 'Replace File' : 'Upload Media'}
                            </span>
                        )}
                    </div>
                </div>

                {uploading && (
                    <div className="absolute bottom-0 left-0 h-1 bg-orange-500 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
                )}
            </div>
        </div>
    );
};

export default FileUpload;
