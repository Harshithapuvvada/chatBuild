import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import ResourceItem from './ResourceItem';

const ModuleCard = ({
  module,
  resources = [],
  onEdit,
  onDelete,
  onAddItem,
  onEditResource,
  onDeleteResource,
  onMoveResource,
  onMoveModule,
  index = 0,
}) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  // Drag and drop for modules
  const [{ isDragging }, drag] = useDrag({
    type: 'MODULE',
    item: {
      id: module.id,
      index,
      type: 'MODULE',
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'MODULE',
    hover: (item, monitor) => {
      if (!onMoveModule) return;

      if (item.id === module.id) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Time to actually perform the action
      onMoveModule(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });

  const toggleOptions = e => {
    e.stopPropagation();
    setIsOptionsOpen(!isOptionsOpen);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEdit = () => {
    onEdit(module);
    setIsOptionsOpen(false);
  };

  const handleDelete = () => {
    onDelete(module.id);
    setIsOptionsOpen(false);
  };

  const toggleAddMenu = e => {
    e.stopPropagation();
    setIsAddMenuOpen(!isAddMenuOpen);
  };

  const handleAddClick = type => {
    onAddItem(module.id, type);
    setIsAddMenuOpen(false);
  };

  const opacity = isDragging ? 0.5 : 1;
  const backgroundColor = isOver ? '#f0f8ff' : 'transparent';

  return (
    <div
      className="module-card-container"
      ref={node => drag(drop(node))}
      style={{ opacity, backgroundColor }}
    >
      <div className="module-card" onClick={toggleExpanded}>
        <div className="module-content">
          <div className="module-icon">
            <span className={`icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          <div className="module-info">
            <h3 className="module-title">{module.name}</h3>
            <p className="module-subtitle">
              {resources.length === 0
                ? 'Add items to this module'
                : `${resources.length} item${resources.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <div className="module-actions">
          <button className="btn-options" onClick={toggleOptions}>
            <span className="options-icon">⋮</span>
          </button>
          {isOptionsOpen && (
            <div className="options-menu">
              <button className="option-item" onClick={handleEdit}>
                <span className="option-icon">✏️</span>
                Edit module name
              </button>
              <button className="option-item delete" onClick={handleDelete}>
                <span className="option-icon">🗑️</span>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="module-content-expanded">
          {resources.length === 0 ? (
            <div className="empty-module-content">
              <p className="empty-module-message">
                No content added to this module yet.
              </p>
              <div className="add-item-container">
                <button className="add-item-button" onClick={toggleAddMenu}>
                  <span className="add-icon">+</span> Add item
                </button>
                {isAddMenuOpen && (
                  <div className="add-item-menu">
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('link')}
                    >
                      <span className="item-icon">🔗</span>
                      Add a link
                    </button>
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('file')}
                    >
                      <span className="item-icon">⬆️</span>
                      Upload file
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="module-items">
              <div className="module-items-list">
                {resources.map((resource, resourceIndex) => (
                  <ResourceItem
                    key={resource.id}
                    resource={resource}
                    onEdit={onEditResource}
                    onDelete={onDeleteResource}
                    onMove={onMoveResource}
                    moduleId={module.id}
                    index={resourceIndex}
                  />
                ))}
              </div>
              <div className="add-item-container">
                <button className="add-item-button" onClick={toggleAddMenu}>
                  <span className="add-icon">+</span> Add item
                </button>
                {isAddMenuOpen && (
                  <div className="add-item-menu">
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('link')}
                    >
                      <span className="item-icon">🔗</span>
                      Add a link
                    </button>
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('file')}
                    >
                      <span className="item-icon">⬆️</span>
                      Upload file
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
