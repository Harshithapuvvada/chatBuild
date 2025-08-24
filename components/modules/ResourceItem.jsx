import { useDrag, useDrop } from 'react-dnd';

const ResourceItem = ({
  resource,
  onEdit,
  onDelete,
  onMove,
  moduleId,
  index = 0,
  showModule = true,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'RESOURCE',
    item: {
      id: resource.id,
      index,
      moduleId,
      type: 'RESOURCE',
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'RESOURCE',
    hover: (item, monitor) => {
      if (!onMove) return;

      if (item.id === resource.id) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;
      const sourceModuleId = item.moduleId;
      const targetModuleId = moduleId;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && sourceModuleId === targetModuleId) {
        return;
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex, sourceModuleId, targetModuleId);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
      item.moduleId = targetModuleId;
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleEdit = e => {
    e.stopPropagation();
    onEdit(resource);
  };

  const handleDelete = e => {
    e.stopPropagation();
    onDelete(resource.id);
  };

  const opacity = isDragging ? 0.5 : 1;
  const backgroundColor = isOver ? '#f0f8ff' : 'transparent';

  if (resource.type === 'link') {
    return (
      <div
        ref={node => drag(drop(node))}
        className="resource-item link-item"
        style={{ opacity, backgroundColor }}
      >
        <div className="item-content">
          <div className="item-icon">
            <span className="icon-link">🔗</span>
          </div>
          <div className="item-info">
            <h4 className="item-title">{resource.title}</h4>
            <a
              href={resource.url}
              className="item-url"
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
            >
              {resource.url}
            </a>
            {showModule && resource.moduleId && (
              <span className="item-module">Module: {resource.moduleId}</span>
            )}
          </div>
        </div>
        <div className="item-actions">
          <button className="item-edit" onClick={handleEdit}>
            <span className="edit-icon">✏️</span>
          </button>
          <button className="item-delete" onClick={handleDelete}>
            <span className="delete-icon">🗑️</span>
          </button>
        </div>
      </div>
    );
  }

  if (resource.type === 'file') {
    return (
      <div
        ref={node => drag(drop(node))}
        className="resource-item file-item"
        style={{ opacity, backgroundColor }}
      >
        <div className="item-content">
          <div className="item-icon">
            <span className="icon-file">📄</span>
          </div>
          <div className="item-info">
            <h4 className="item-title">{resource.title}</h4>
            <p className="item-details">
              {resource.fileName} ({Math.round(resource.fileSize / 1024)} KB)
            </p>
            {showModule && resource.moduleId && (
              <span className="item-module">Module: {resource.moduleId}</span>
            )}
          </div>
        </div>
        <div className="item-actions">
          <button className="item-edit" onClick={handleEdit}>
            <span className="edit-icon">✏️</span>
          </button>
          <button className="item-delete" onClick={handleDelete}>
            <span className="delete-icon">🗑️</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ResourceItem;
