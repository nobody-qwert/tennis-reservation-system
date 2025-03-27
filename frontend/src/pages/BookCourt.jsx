import { useBookCourtLogic } from './BookCourtLogic';

const BookCourt = () => {
  const {
    courts,
    selectedCourt,
    setSelectedCourt,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    availableTimes,
    error,
    loading,
    submitLoading,
    today,
    maxDateString,
    checkAvailability,
    handleSubmit
  } = useBookCourtLogic();

  return (
    <div className="container mt-5 px-3">
      <h2 className="mb-4">Book a Tennis Court</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="courtSelect" className="form-label">Select Court</label>
              <select
                id="courtSelect"
                className="form-select"
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select a court</option>
                {courts.map((court) => (
                  <option key={court.id} value={court.id}>
                    {court.name} - {court.surface} {court.is_indoor ? '(Indoor)' : '(Outdoor)'}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-3">
              <label htmlFor="dateSelect" className="form-label">Select Date</label>
              <input
                type="date"
                id="dateSelect"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={today}
                max={maxDateString}
                required
                disabled={loading}
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="timeSelect" className="form-label">Select Time</label>
              <select
                id="timeSelect"
                className="form-select"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                disabled={!selectedDate || loading}
              >
                <option value="">Select a time</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedCourt && selectedDate && selectedTime && (
              <div className="d-flex">
                <button
                  type="button"
                  className="btn btn-outline-success me-2"
                  onClick={checkAvailability}
                  disabled={loading}
                >
                  Check Availability
                </button>
                
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={submitLoading || loading}
                >
                  {submitLoading ? 'Booking...' : 'Book Court'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookCourt;
