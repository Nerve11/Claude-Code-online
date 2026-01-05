import React, { useState, useEffect } from 'react';
import { getAvailableModels } from '../services/puterService';

const ModelSelector = ({ selectedModel, onModelChange }) => {
  const [models, setModels] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const availableModels = await getAvailableModels();
        setModels(availableModels);
      } catch (error) {
        console.error('Failed to load models:', error);
      } finally {
        setLoading(false);
      }
    };
    loadModels();
  }, []);

  const filteredModels = models.filter(model =>
    model.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (model.name && model.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentModel = models.find(m => m.id === selectedModel) || { id: selectedModel, name: selectedModel };

  return (
    <div className="model-selector">
      <button 
        className="model-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="model-icon">🤖</span>
        <span className="model-name">{currentModel.name || currentModel.id}</span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="model-dropdown">
          <div className="model-search">
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="model-list">
            {loading ? (
              <div className="model-loading">Loading models...</div>
            ) : filteredModels.length > 0 ? (
              filteredModels.map(model => (
                <div
                  key={model.id}
                  className={`model-item ${model.id === selectedModel ? 'selected' : ''}`}
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <div className="model-item-name">{model.name || model.id}</div>
                  {model.provider && (
                    <div className="model-item-provider">{model.provider}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="model-empty">No models found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;