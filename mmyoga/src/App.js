import React, { useState, useEffect } from "react";
import "./styles.css";

const sortClassesByDateAndTime = (classes) => {
  return classes.sort((a, b) => {
    const dateA = new Date(a.date + "T" + a.time.split("-")[0]);
    const dateB = new Date(b.date + "T" + b.time.split("-")[0]);
    if (dateA - dateB === 0) {
      return a.name.localeCompare(b.name);
    } else {
      return dateA - dateB;
    }
  });
};

const groupClassesByDate = (classes) => {
  return classes.reduce((acc, classInfo) => {
    const date = classInfo.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(classInfo);
    return acc;
  }, {});
};

const thursdaysInMay = ["2023-05-04", "2023-05-11", "2023-05-18", "2023-05-25"];
const times = [
  { name: "Stretch", time: "7:30pm-8:30pm" },
  { name: "Hatha", time: "8:30pm-9:30pm" }
];

let classId = 1;
const classList = [];

thursdaysInMay.forEach((date) => {
  times.forEach(({ name, time }) => {
    classList.push({ classId, name, date, time });
    classId += 1;
  });
});

export default function App() {
  const [bookings, setBookings] = useState([]);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [sortedGroupedClasses, setSortedGroupedClasses] = useState({});

  useEffect(() => {
    setSortedGroupedClasses(
      groupClassesByDate(sortClassesByDateAndTime(classList))
    );
  }, [bookings]);

  const onNameChange = (event) => {
    setError("");
    setUserName(event.target.value);
  };

  const bookClass = (classId) => {
    if (!userName) {
      setError("Please enter a name");
      return;
    }

    const existingBooking = bookings.find(
      (booking) => booking.name === userName && booking.classId === classId
    );

    if (existingBooking) {
      setError("You have already booked this class");
      return;
    }

    setBookings([...bookings, { name: userName, classId }]);
    setError("");
  };

  const removeBooking = (name, classId) => {
    setBookings(
      bookings.filter(
        (booking) => !(booking.name === name && booking.classId === classId)
      )
    );
  };

  const groupedBookings = bookings.reduce((acc, booking) => {
    const classInfo = classList.find((c) => c.classId === booking.classId);
    const key = `${classInfo.date}_${classInfo.time}_${classInfo.name}`;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(booking);
    return acc;
  }, {});

  return (
    <div className="App">
      <h1>Class Booking System</h1>
      <div>
        <label htmlFor="name">Name: </label>
        <input type="text" id="name" value={userName} onChange={onNameChange} />
      </div>
      {error && <p className="error">{error}</p>}
      <h2>Available Classes</h2>
      {Object.entries(sortedGroupedClasses).map(([date, classes]) => (
        <div key={date} className="grey-box">
          <h3>{date}</h3>
          <ul>
            {classes.map((classInfo) => (
              <li key={classInfo.classId}>
                {classInfo.name} - {classInfo.time}{" "}
                <button
                  onClick={() => bookClass(classInfo.classId)}
                  className="book-btn"
                >
                  Book
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <h2>Booked Classes</h2>
      {Object.entries(sortedGroupedClasses).map(([date, classes]) =>
        classes.map((classInfo) => {
          const key = `${classInfo.date}_${classInfo.time}_${classInfo.name}`;
          const bookingsForClass = groupedBookings[key] || [];

          return (
            <div key={classInfo.classId} className="grey-box">
              <h3>{classInfo.date}</h3>
              <ul>
                {classInfo.name} - {classInfo.time} (Count:{" "}
                {bookingsForClass.length})
              </ul>
              <ul>
                {bookingsForClass.map((booking) => (
                  <li key={`${booking.name}_${booking.classId}`}>
                    {booking.name}{" "}
                    <button
                      onClick={() =>
                        removeBooking(booking.name, booking.classId)
                      }
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
}
