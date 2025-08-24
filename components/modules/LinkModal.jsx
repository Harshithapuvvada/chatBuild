import { useState, useEffect } from 'react';

const LinkModal = ({ isOpen, onClose, onSave, moduleId, resource = null }) => {
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [errors, setErrors] = useState({});

  // Initialize form when editing
  useEffect(() => {
    if (resource) {
      setLinkTitle(resource.title || '');
      setLinkUrl(resource.url || '');
    } else {
      setLinkTitle('');
      setLinkUrl('');
    }
    setErrors({});
  }, [resource, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!linkTitle.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!linkUrl.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        const url = new URL(linkUrl);
        if (!url.protocol || !url.hostname) {
          newErrors.url = 'Please enter a valid URL';
        }
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave({
      id: resource ? resource.id : Date.now().toString(),
      moduleId,
      type: 'link',
      title: linkTitle.trim(),
      url: linkUrl.trim(),
    });

    setLinkTitle('');
    setLinkUrl('');
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{resource ? 'Edit link' : 'Add a link'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="link-title">Link title</label>
              <input
                id="link-title"
                type="text"
                value={linkTitle}
                onChange={e => setLinkTitle(e.target.value)}
                placeholder="Link title"
                className={`form-input ${errors.title ? 'error' : ''}`}
                autoFocus
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="link-url">URL</label>
              <input
                id="link-url"
                type="url"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className={`form-input ${errors.url ? 'error' : ''}`}
              />
              {errors.url && (
                <span className="error-message">{errors.url}</span>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-create">
              {resource ? 'Save changes' : 'Add link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkModal;
