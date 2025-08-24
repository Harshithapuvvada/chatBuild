import { useState, useEffect } from 'react';

const ModuleModal = ({ isOpen, onClose, onSave, module = null }) => {
  const [moduleName, setModuleName] = useState('');
  const [errors, setErrors] = useState({});

  // Initialize form when editing
  useEffect(() => {
    if (module) {
      setModuleName(module.name || '');
    } else {
      setModuleName('');
    }
    setErrors({});
  }, [module, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!moduleName.trim()) {
      newErrors.name = 'Module name is required';
    } else if (moduleName.trim().length < 3) {
      newErrors.name = 'Module name must be at least 3 characters long';
    } else if (moduleName.trim().length > 100) {
      newErrors.name = 'Module name must be less than 100 characters';
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
      id: module ? module.id : Date.now().toString(),
      name: moduleName.trim(),
    });
    setModuleName('');
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{module ? 'Edit module' : 'Create new module'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="module-name">Module name</label>
              <input
                id="module-name"
                type="text"
                value={moduleName}
                onChange={e => setModuleName(e.target.value)}
                placeholder="Introduction to Trigonometry"
                className={`form-input ${errors.name ? 'error' : ''}`}
                autoFocus
                maxLength={100}
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-create">
              {module ? 'Save changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModuleModal;
