const Outline = ({ modules, activeModuleId, onModuleClick }) => {
  if (modules.length === 0) {
    return null;
  }

  return (
    <div className="outline">
      <h3 className="outline-title">Course Outline</h3>
      <div className="outline-list">
        {modules.map((module, index) => (
          <button
            key={module.id}
            className={`outline-item ${activeModuleId === module.id ? 'active' : ''}`}
            onClick={() => onModuleClick(module.id)}
          >
            <span className="outline-number">{index + 1}</span>
            <span className="outline-name">{module.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Outline;
