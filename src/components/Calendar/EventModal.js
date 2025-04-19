import React, { useState } from 'react';
import './Calendar.css';

const EventModal = ({ 
  showModal, 
  selectedDay, 
  newEvent, 
  onEventChange, 
  onAddEvent, 
  onClose,
  isEditing,
  isViewing 
}) => {
  const [includeTime, setIncludeTime] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  if (!showModal) return null;

  const handleSubmit = () => {
    const eventDetails = {
      title: newEvent,
      hasTime: includeTime,
      startTime: includeTime ? startTime : null,
      endTime: includeTime ? endTime : null
    };
    onAddEvent(eventDetails);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>
          {isViewing ? 'View Event' : isEditing ? 'Edit Event for' : 'Add Event for'} 
          {selectedDay?.toLocaleDateString()}
        </h3>
        <div className="modal-form">
          <input
            type="text"
            placeholder="Enter event details"
            value={newEvent}
            onChange={(e) => onEventChange(e.target.value)}
            className="event-input"
            disabled={isViewing}
            autoFocus={!isViewing}
          />
          
          <div className="time-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={includeTime}
                onChange={(e) => setIncludeTime(e.target.checked)}
              />
              Include time
            </label>
          </div>

          {includeTime && (
            <div className="time-inputs">
              <div className="time-field">
                <label>Start Time:</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="time-field">
                <label>End Time:</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        <div className="modal-buttons">
          {!isViewing && (
            <button onClick={handleSubmit}>
              {isEditing ? 'Save Changes' : 'Add Event'}
            </button>
          )}
          <button onClick={onClose}>
            {isViewing ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;