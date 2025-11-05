import React, { useState } from 'react';
import './BugForm.css';

const BugForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    priority: initialData.priority || 'medium',
    status: initialData.status || 'open',
    stepsToReproduce: initialData.stepsToReproduce || [''],
    expectedBehavior: initialData.expectedBehavior || '',
    actualBehavior: initialData.actualBehavior || '',
    environment: initialData.environment || { os: '', browser: '', device: '' },
    reporter: initialData.reporter || '',
    assignee: initialData.assignee || '',
    tags: initialData.tags || []
  });

  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.reporter.trim()) newErrors.reporter = 'Reporter name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Filter out empty steps
      const filteredSteps = formData.stepsToReproduce.filter(step => step.trim() !== '');
      onSubmit({ ...formData, stepsToReproduce: filteredSteps });
    }
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.stepsToReproduce];
    newSteps[index] = value;
    setFormData({ ...formData, stepsToReproduce: newSteps });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      stepsToReproduce: [...formData.stepsToReproduce, '']
    });
  };

  const removeStep = (index) => {
    const newSteps = formData.stepsToReproduce.filter((_, i) => i !== index);
    setFormData({ ...formData, stepsToReproduce: newSteps });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bug-form" data-testid="bug-form">
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="4"
          className={errors.description ? 'error' : ''}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Steps to Reproduce</label>
        {formData.stepsToReproduce.map((step, index) => (
          <div key={index} className="step-input">
            <input
              type="text"
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              placeholder={`Step ${index + 1}`}
            />
            {formData.stepsToReproduce.length > 1 && (
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="remove-btn"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addStep} className="add-btn">
          Add Step
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="expectedBehavior">Expected Behavior</label>
        <textarea
          id="expectedBehavior"
          value={formData.expectedBehavior}
          onChange={(e) => setFormData({ ...formData, expectedBehavior: e.target.value })}
          rows="2"
        />
      </div>

      <div className="form-group">
        <label htmlFor="actualBehavior">Actual Behavior</label>
        <textarea
          id="actualBehavior"
          value={formData.actualBehavior}
          onChange={(e) => setFormData({ ...formData, actualBehavior: e.target.value })}
          rows="2"
        />
      </div>

      <div className="form-group">
        <label>Environment</label>
        <div className="environment-inputs">
          <input
            type="text"
            placeholder="Operating System"
            value={formData.environment.os}
            onChange={(e) => setFormData({
              ...formData,
              environment: { ...formData.environment, os: e.target.value }
            })}
          />
          <input
            type="text"
            placeholder="Browser"
            value={formData.environment.browser}
            onChange={(e) => setFormData({
              ...formData,
              environment: { ...formData.environment, browser: e.target.value }
            })}
          />
          <input
            type="text"
            placeholder="Device"
            value={formData.environment.device}
            onChange={(e) => setFormData({
              ...formData,
              environment: { ...formData.environment, device: e.target.value }
            })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="reporter">Reporter *</label>
          <input
            type="text"
            id="reporter"
            value={formData.reporter}
            onChange={(e) => setFormData({ ...formData, reporter: e.target.value })}
            className={errors.reporter ? 'error' : ''}
          />
          {errors.reporter && <span className="error-message">{errors.reporter}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="assignee">Assignee</label>
          <input
            type="text"
            id="assignee"
            value={formData.assignee}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Tags</label>
        <div className="tags-input">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add a tag and press Enter"
          />
          <button type="button" onClick={addTag}>Add Tag</button>
        </div>
        <div className="tags-list">
          {formData.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
              <button type="button" onClick={() => removeTag(tag)}>×</button>
            </span>
          ))}
        </div>
      </div>

      <button type="submit" className="submit-btn">
        {isEditing ? 'Update Bug' : 'Report Bug'}
      </button>
    </form>
  );
};

export default BugForm;