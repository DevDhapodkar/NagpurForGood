import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const FileUpload = ({ 
    label, 
    icon: Icon = Upload, 
    onUploadComplete, 
    initialPreview = '',
    pathPrefix = 'general', // Not strictly used by Cloudinary unsigned presets, but kept for prop compatibility
    accept = "image/*",
    required = false,
    className = ""
}) => {
    const { showToast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState(initialPreview);
    const [status, setStatus] = useState(''); // 'uploading', 'complete'

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check if file is too large (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            showToast("File is too large. Max 10MB allowed.", "error");
            return;
        }

        setUploading(true);
        setProgress(10);
        setStatus('uploading');

        // Create a fast local preview using object URL (low memory)
        try {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        } catch (e) {
            console.warn("Could not create local preview");
        }

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            console.error("Missing Cloudinary environment variables");
            showToast("Upload configuration error. Please contact support.", "error");
            setUploading(false);
            setStatus('');
            setProgress(0);
            return;
        }

        const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        // Optional: append a folder based on pathPrefix if your preset allows folder overrides
        // formData.append('folder', pathPrefix);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                // Scale progress from 10 to 90
                const percentComplete = (event.loaded / event.total) * 100;
                setProgress(10 + (percentComplete * 0.8));
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    const secureUrl = response.secure_url;
                    
                    onUploadComplete(secureUrl);
                    showToast("Media uploaded successfully", "success");
                    setProgress(100);
                    setStatus('complete');
                    setUploading(false);
                } catch (err) {
                    console.error("Error parsing Cloudinary response:", err);
                    showToast("Upload succeeded but failed to parse response.", "error");
                    setUploading(false);
                    setStatus('');
                    setProgress(0);
                }
            } else {
                console.error("Cloudinary Upload Error:", xhr.status, xhr.responseText);
                let errorMsg = "Upload failed.";
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMsg += ` ${errorResponse.error?.message || xhr.statusText}`;
                } catch (e) {
                    errorMsg += ` ${xhr.statusText}`;
                }
                showToast(errorMsg, "error");
                setUploading(false);
                setStatus('');
                setProgress(0);
            }
        };

        xhr.onerror = () => {
            console.error("Network Error during upload");
            showToast("Network error during upload. Please check your connection.", "error");
            setUploading(false);
            setStatus('');
            setProgress(0);
        };

        // Add a 60-second timeout just in case it hangs
        xhr.timeout = 60000; 
        xhr.ontimeout = () => {
            console.error("Upload Timed Out");
            showToast("Upload timed out (60 seconds). Try again.", "error");
            setUploading(false);
            setStatus('');
            setProgress(0);
        };

        xhr.send(formData);
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest flex items-center gap-2 mb-2">
                {Icon && <Icon className="w-3 h-3 text-orange-500/50" />} {label}
                {required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            
            <div className={`relative group border-2 border-dashed rounded-2xl transition-all min-h-[120px] flex items-center justify-center overflow-hidden ${uploading ? 'border-orange-500/50 bg-orange-500/5' : 'border-[var(--border-color)] hover:border-orange-400/30'}`}>
                <input 
                    type="file" 
                    accept={accept}
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    disabled={uploading}
                />
                
                <div className="p-4 flex flex-col items-center justify-center gap-3 text-center transition-all group-hover:scale-105 duration-300">
                    <div className="relative">
                        {preview ? (
                            <div className="relative group/preview w-24 h-16 sm:w-32 sm:h-20 overflow-hidden rounded-xl shadow-2xl border border-white/10">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-opacity">
                                    <X className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        ) : (
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-orange-500/5 border border-orange-500/10 ${uploading ? 'animate-pulse' : ''}`}>
                                {uploading ? <Loader2 className="w-6 h-6 text-orange-500 animate-spin" /> : <Upload className="w-6 h-6 text-orange-500/50" />}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-primary)]">
                            {uploading ? (
                                status === 'processing' ? 'Preparing Media...' : 'Sending to Server...'
                            ) : (preview ? 'Click to Change' : 'Choose File')}
                        </span>
                        {!uploading && !preview && (
                            <span className="text-[8px] uppercase tracking-tighter text-[var(--text-muted)] font-bold">Image, PDF (Max 5MB)</span>
                        )}
                    </div>
                </div>

                {uploading && (
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-600 to-red-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                )}
            </div>
        </div>
    );
};

export default FileUpload;
