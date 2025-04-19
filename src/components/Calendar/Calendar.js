import React, { useState } from 'react';
import EventModal from './EventModal';
import './Calendar.css';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const handleDayClick = (date) => {
    setSelectedDay(date);
    setShowModal(true);
  };

  const addEvent = (eventDetails) => {
    if (eventDetails.title.trim() && selectedDay) {
      const dateStr = selectedDay.toISOString().split('T')[0];
      const formattedEvent = eventDetails.hasTime
        ? `${eventDetails.title} (${eventDetails.startTime} - ${eventDetails.endTime})`
        : eventDetails.title;

      if (editingEvent !== null) {
        setEvents(prev => ({
          ...prev,
          [dateStr]: prev[dateStr].map((event, index) =>
            index === editingEvent ? formattedEvent : event
          )
        }));
      } else {
        setEvents(prev => ({
          ...prev,
          [dateStr]: [...(prev[dateStr] || []), formattedEvent]
        }));
      }
      handleCloseModal();
    }
  };

  const deleteEvent = (date, index) => {
    const dateStr = date.toISOString().split('T')[0];
    setEvents(prev => ({
      ...prev,
      [dateStr]: prev[dateStr].filter((_, i) => i !== index)
    }));
  };

  const editEvent = (date, index) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDay(date);
    setNewEvent(events[dateStr][index]);
    setEditingEvent(index);
    setShowModal(true);
  };

  const viewEvent = (date, index) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDay(date);
    setNewEvent(events[dateStr][index]);
    setViewingEvent(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewEvent('');
    setEditingEvent(null);
    setViewingEvent(null);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const renderDaysOfWeek = () => {
    return DAYS_OF_WEEK.map(day => (
      <div key={day} className="calendar-day day-of-week">
        {day}
      </div>
    ));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const firstDayOfWeek = firstDay.getDay(); // 0-6 (Sunday-Saturday)
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day empty"></div>
      );
    }

    // Add the actual days of the month
    for (let i = 0; i < daysInMonth; i++) {
      const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      days.push(
        <div 
          key={i} 
          className={`calendar-day ${isToday(currentDate) ? 'today' : ''}`}
          onClick={() => handleDayClick(currentDate)}
        >
          <div className="day-number">{i + 1}</div>
          <div className="events">
            {events[dateStr]?.map((event, index) => (
              <div key={index} className="event">
                <span>{event}</span>
                <div className="event-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      viewEvent(currentDate, index);
                    }}
                    className="event-btn view"
                    title="View Event"
                  >
                    👁
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      editEvent(currentDate, index);
                    }}
                    className="event-btn edit"
                    title="Edit Event"
                  >
                    ✎
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEvent(currentDate, index);
                    }}
                    className="event-btn delete"
                    title="Delete Event"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h2>{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <div className="calendar-controls">
          <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}>
            Previous
          </button>
          <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}>
            Next
          </button>
        </div>
      </div>
      <div className="calendar-grid">
        {renderDaysOfWeek()}
        {renderCalendar()}
      </div>
      <EventModal
        showModal={showModal}
        selectedDay={selectedDay}
        newEvent={newEvent}
        onEventChange={setNewEvent}
        onAddEvent={addEvent}
        onClose={handleCloseModal}
        isEditing={editingEvent !== null}
        isViewing={viewingEvent !== null}
      />
    </div>
  );
};

export default Calendar;