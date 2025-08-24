import { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import EmptyState from '../ui/EmptyState';
import Header from '../ui/Header';
import Outline from '../ui/Outline';

import LinkModal from './LinkModal';
import ModuleCard from './ModuleCard';
import ModuleModal from './ModuleModal';
import ResourceItem from './ResourceItem';
import UploadModal from './UploadModal';

const CourseBuilder = () => {
  const [modules, setModules] = useState([]);
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModuleId, setActiveModuleId] = useState(null);

  // Modal states
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Current items for editing
  const [currentModule, setCurrentModule] = useState(null);
  const [currentResource, setCurrentResource] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);

  // Refs for scroll tracking
  const moduleRefs = useRef({});

  // Filter resources and modules based on search
  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResources = resources.filter(
    resource =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.type === 'link' &&
        resource.url.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (resource.type === 'file' &&
        resource.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get resources for a specific module
  const getModuleResources = moduleId => {
    return resources.filter(resource => resource.moduleId === moduleId);
  };

  // Get resources outside modules
  const getUnassignedResources = () => {
    return resources.filter(resource => !resource.moduleId);
  };

  // Handle scroll to module
  const scrollToModule = moduleId => {
    if (moduleRefs.current[moduleId]) {
      moduleRefs.current[moduleId].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Track active module on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      let newActiveModuleId = null;
      Object.entries(moduleRefs.current).forEach(([moduleId, element]) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;

          if (
            scrollPosition >= elementTop &&
            scrollPosition < elementTop + rect.height
          ) {
            newActiveModuleId = moduleId;
          }
        }
      });

      setActiveModuleId(newActiveModuleId);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [modules]);

  const handleAddClick = type => {
    switch (type) {
      case 'module':
        setCurrentModule(null);
        setIsModuleModalOpen(true);
        break;
      case 'link':
        setCurrentResource(null);
        setCurrentModuleId(null);
        setIsLinkModalOpen(true);
        break;
      case 'upload':
        setCurrentResource(null);
        setCurrentModuleId(null);
        setIsUploadModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleCloseModuleModal = () => {
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleCloseLinkModal = () => {
    setIsLinkModalOpen(false);
    setCurrentResource(null);
    setCurrentModuleId(null);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setCurrentResource(null);
    setCurrentModuleId(null);
  };

  const handleSaveModule = module => {
    if (currentModule) {
      // Edit existing module
      setModules(modules.map(m => (m.id === module.id ? module : m)));
    } else {
      // Add new module
      setModules([...modules, module]);
    }
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleEditModule = module => {
    setCurrentModule(module);
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = moduleId => {
    setModules(modules.filter(module => module.id !== moduleId));
    // Move resources from deleted module to unassigned
    setResources(
      resources.map(resource =>
        resource.moduleId === moduleId
          ? { ...resource, moduleId: null }
          : resource
      )
    );
  };

  const handleAddItem = (moduleId, type) => {
    setCurrentModuleId(moduleId);
    setCurrentResource(null);
    if (type === 'link') {
      setIsLinkModalOpen(true);
    } else if (type === 'file') {
      setIsUploadModalOpen(true);
    }
  };

  const handleEditResource = resource => {
    setCurrentResource(resource);
    setCurrentModuleId(resource.moduleId);
    if (resource.type === 'link') {
      setIsLinkModalOpen(true);
    } else if (resource.type === 'file') {
      setIsUploadModalOpen(true);
    }
  };

  const handleSaveLink = linkItem => {
    if (currentResource) {
      // Edit existing resource
      setResources(
        resources.map(r =>
          r.id === currentResource.id
            ? { ...linkItem, id: currentResource.id }
            : r
        )
      );
    } else {
      // Add new resource
      setResources([...resources, linkItem]);
    }
    setIsLinkModalOpen(false);
    setCurrentResource(null);
    setCurrentModuleId(null);
  };

  const handleSaveUpload = fileItem => {
    if (currentResource) {
      // Edit existing resource
      setResources(
        resources.map(r =>
          r.id === currentResource.id
            ? { ...fileItem, id: currentResource.id }
            : r
        )
      );
    } else {
      // Add new resource
      setResources([...resources, fileItem]);
    }
    setIsUploadModalOpen(false);
    setCurrentResource(null);
    setCurrentModuleId(null);
  };

  const handleDeleteResource = resourceId => {
    setResources(resources.filter(resource => resource.id !== resourceId));
  };

  // Drag and drop handlers
  const handleMoveModule = (dragIndex, hoverIndex) => {
    const draggedModule = modules[dragIndex];
    const newModules = [...modules];
    newModules.splice(dragIndex, 1);
    newModules.splice(hoverIndex, 0, draggedModule);
    setModules(newModules);
  };

  const handleMoveResource = (
    dragIndex,
    hoverIndex,
    sourceModuleId,
    targetModuleId
  ) => {
    const sourceResources = sourceModuleId
      ? resources.filter(r => r.moduleId === sourceModuleId)
      : resources.filter(r => !r.moduleId);

    const targetResources = targetModuleId
      ? resources.filter(r => r.moduleId === targetModuleId)
      : resources.filter(r => !r.moduleId);

    const draggedResource = sourceResources[dragIndex];

    // Remove from source
    const newResources = resources.map(r =>
      r.id === draggedResource.id ? { ...r, moduleId: targetModuleId } : r
    );

    // Reorder within target
    const targetResourceIds = targetResources.map(r => r.id);
    if (draggedResource.moduleId === targetModuleId) {
      // Same module, just reorder
      targetResourceIds.splice(dragIndex, 1);
      targetResourceIds.splice(hoverIndex, 0, draggedResource.id);
    } else {
      // Different module, add to target
      targetResourceIds.splice(hoverIndex, 0, draggedResource.id);
    }

    // Apply new order
    const orderedResources = [];
    newResources.forEach(resource => {
      if (targetResourceIds.includes(resource.id)) {
        const index = targetResourceIds.indexOf(resource.id);
        orderedResources[index] = resource;
      } else {
        orderedResources.push(resource);
      }
    });

    setResources(orderedResources.filter(Boolean));
  };

  const handleSearchChange = query => {
    setSearchQuery(query);
  };

  // Check if we should show search results
  const showSearchResults = searchQuery.trim().length > 0;
  const hasContent = modules.length > 0 || resources.length > 0;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="course-builder">
        <Header
          onAddClick={handleAddClick}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        <div className="builder-content">
          {!hasContent ? (
            <EmptyState />
          ) : showSearchResults ? (
            <div className="search-results">
              <h2 className="search-results-title">
                Search results for "{searchQuery}"
              </h2>

              {/* Show matching modules with their resources */}
              {filteredModules.map(module => (
                <div key={module.id} className="search-result-module">
                  <h3 className="search-module-title">{module.name}</h3>
                  <div className="search-module-resources">
                    {getModuleResources(module.id)
                      .filter(
                        resource =>
                          resource.title
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          (resource.type === 'link' &&
                            resource.url
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())) ||
                          (resource.type === 'file' &&
                            resource.fileName
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()))
                      )
                      .map(resource => (
                        <ResourceItem
                          key={resource.id}
                          resource={resource}
                          onEdit={handleEditResource}
                          onDelete={handleDeleteResource}
                          showModule={false}
                        />
                      ))}
                  </div>
                </div>
              ))}

              {/* Show matching unassigned resources */}
              {getUnassignedResources()
                .filter(
                  resource =>
                    resource.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    (resource.type === 'link' &&
                      resource.url
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) ||
                    (resource.type === 'file' &&
                      resource.fileName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()))
                )
                .map(resource => (
                  <div key={resource.id} className="search-result-unassigned">
                    <span className="unassigned-label">
                      Unassigned resource:
                    </span>
                    <ResourceItem
                      resource={resource}
                      onEdit={handleEditResource}
                      onDelete={handleDeleteResource}
                      showModule={false}
                    />
                  </div>
                ))}

              {filteredModules.length === 0 &&
                filteredResources.length === 0 && (
                  <div className="no-search-results">
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                )}
            </div>
          ) : (
            <div className="builder-main-content">
              <div className="content-area">
                {/* Unassigned resources */}
                {getUnassignedResources().length > 0 && (
                  <div className="unassigned-resources">
                    <h2 className="section-title">Unassigned Resources</h2>
                    <div className="resources-list">
                      {getUnassignedResources().map(resource => (
                        <ResourceItem
                          key={resource.id}
                          resource={resource}
                          onEdit={handleEditResource}
                          onDelete={handleDeleteResource}
                          onMove={handleMoveResource}
                          moduleId={null}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Modules */}
                <div className="module-list">
                  {modules.map((module, index) => (
                    <div
                      key={module.id}
                      ref={el => (moduleRefs.current[module.id] = el)}
                    >
                      <ModuleCard
                        module={module}
                        resources={getModuleResources(module.id)}
                        onEdit={handleEditModule}
                        onDelete={handleDeleteModule}
                        onAddItem={handleAddItem}
                        onEditResource={handleEditResource}
                        onDeleteResource={handleDeleteResource}
                        onMoveResource={handleMoveResource}
                        onMoveModule={handleMoveModule}
                        index={index}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Outline */}
              <Outline
                modules={modules}
                activeModuleId={activeModuleId}
                onModuleClick={scrollToModule}
              />
            </div>
          )}
        </div>

        {/* Module Modal */}
        <ModuleModal
          isOpen={isModuleModalOpen}
          onClose={handleCloseModuleModal}
          onSave={handleSaveModule}
          module={currentModule}
        />

        {/* Link Modal */}
        <LinkModal
          isOpen={isLinkModalOpen}
          onClose={handleCloseLinkModal}
          onSave={handleSaveLink}
          moduleId={currentModuleId}
          resource={currentResource}
        />

        {/* Upload Modal */}
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={handleCloseUploadModal}
          onSave={handleSaveUpload}
          moduleId={currentModuleId}
          resource={currentResource}
        />
      </div>
    </DndProvider>
  );
};

export default CourseBuilder;
