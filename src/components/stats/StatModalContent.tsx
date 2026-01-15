import { Event } from "@/types/events";
import { StatsBox } from "./StatsBox";

export const StatsModalContent = ({ selectedEvent }: { selectedEvent: Event }) => {
  const statsData = [
    { title: "Status", value: selectedEvent.status },
    { title: "Date", value: new Date(selectedEvent.date).toLocaleDateString() },
    { title: "Capacity", value: selectedEvent.capacity },
    { title: "Booked", value: selectedEvent.booked }
  ];

  const locationData = [
    { label: "Country", value: selectedEvent.zone.city.country.name },
    { label: "City", value: selectedEvent.zone.city.name },
    { label: "Zone", value: selectedEvent.zone.name }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {statsData.map((stat, index) => (
          <StatsBox key={index} size="md" title={stat.title}>
            {stat.value}
          </StatsBox>
        ))}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Location</h3>
        <div className="space-y-2">
          {locationData.map((location, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-600">{location.label}:</span>
              <span className="font-medium text-gray-900">{location.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
