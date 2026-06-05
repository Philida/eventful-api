'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/events')
      .then((res) => {
        setEvents(res.data.data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Eventful Events
      </h1>

      <div className="grid gap-4">
        {events.map((event: any) => (
          <div
            key={event.id}
            className="border p-4 rounded"
          >
            <h2 className="text-xl font-bold">
              {event.title}
            </h2>

            <p>{event.description}</p>

            <p>
              📍 {event.location}
            </p>

            <p>
              💰 ₦{event.ticketPrice}
            </p>

            <p>
              🏷️ {event.category}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}