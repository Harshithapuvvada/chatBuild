import { useState, useEffect } from 'react';

const UploadModal = ({
  isOpen,
  onClose,
  onSave,
  moduleId,
  resource = null,
}) => {
  const [fileTitle, setFileTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Allowed file types
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  // Initialize form when editing
  useEffect(() => {
    if (resource) {
      setFileTitle(resource.title || '');
      setSelectedFile(null); // Don't show file when editing
    } else {
      setFileTitle('');
      setSelectedFile(null);
    }
    setErrors({});
  }, [resource, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!fileTitle.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!resource && !selectedFile) {
      newErrors.file = 'Please select a file';
    }

    if (selectedFile) {
      if (!allowedTypes.includes(selectedFile.type)) {
        newErrors.file =
          'Please select a valid file type (PDF, JPEG, PNG, GIF, WebP)';
      }

      if (selectedFile.size > maxFileSize) {
        newErrors.file = 'File size must be less than 10MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrors({ ...errors, file: null });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real app, you would upload the file to a server
    // Here we just create a mock file entry
    onSave({
      id: resource ? resource.id : Date.now().toString(),
      moduleId,
      type: 'file',
      title: fileTitle.trim(),
      fileName: selectedFile ? selectedFile.name : resource.fileName,
      fileSize: selectedFile ? selectedFile.size : resource.fileSize,
      fileType: selectedFile ? selectedFile.type : resource.fileType,
    });

    setFileTitle('');
    setSelectedFile(null);
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{resource ? 'Edit file' : 'Upload file'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="file-title">File title</label>
              <input
                id="file-title"
                type="text"
                value={fileTitle}
                onChange={e => setFileTitle(e.target.value)}
                placeholder="File title"
                className={`form-input ${errors.title ? 'error' : ''}`}
                autoFocus
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="file-upload">
                {resource ? 'Current file' : 'Select file'}
              </label>
              {resource && !selectedFile && (
                <div className="current-file">
                  <span className="file-name">{resource.fileName}</span>
                  <span className="file-size">
                    ({Math.round(resource.fileSize / 1024)} KB)
                  </span>
                </div>
              )}
              {!resource && (
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className={`file-input ${errors.file ? 'error' : ''}`}
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                />
              )}
              {!resource && selectedFile && (
                <div className="selected-file">
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-size">
                    ({Math.round(selectedFile.size / 1024)} KB)
                  </span>
                </div>
              )}
              {errors.file && (
                <span className="error-message">{errors.file}</span>
              )}
              <p className="file-help">
                Supported formats: PDF, JPEG, PNG, GIF, WebP (max 10MB)
              </p>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-create">
              {resource ? 'Save changes' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
