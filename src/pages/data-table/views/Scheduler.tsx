import * as React from "react";
import { Scheduler, SchedulerEvent, Resource } from "../components/Scheduler";

const SchedulerExample: React.FC = () => {
  const events: SchedulerEvent[] = [
    {
      id: "1",
      title: "Meeting with John",
      start: new Date("2023-10-05T10:00:00"),
      end: new Date("2023-10-05T11:00:00"),
      resourceId: "1",
      color: "#FF9800",
      description: "Discuss project details",
      status: "confirmed",
    },
    {
      id: "2",
      title: "Team Lunch",
      start: new Date("2023-10-06T12:00:00"),
      end: new Date("2023-10-06T13:00:00"),
      resourceId: "2",
      color: "#4CAF50",
      description: "Casual lunch with the team",
      status: "tentative",
    },
    {
      id: "3",
      title: "Client Presentation",
      start: new Date("2023-10-07T14:00:00"),
      end: new Date("2023-10-07T15:00:00"),
      resourceId: "3",
      color: "#2196F3",
      description: "Present project to client",
      status: "confirmed",
    },
  ];

  const resources: Resource[] = [
    { id: "1", title: "Resource A" },
    { id: "2", title: "Resource B" },
    { id: "3", title: "Resource C" },
  ];

  const handleEventClick = (event: SchedulerEvent) => {
    console.log("Event Clicked:", event);
  };

  const handleEventChange = (event: SchedulerEvent, start: Date, end: Date) => {
    console.log("Event Changed:", event, start, end);
  };

  const handleDateChange = (date: Date) => {
    console.log("Date Changed:", date);
  };

  const handleViewChange = (view: "day" | "week" | "month" | "timeline") => {
    console.log("View Changed:", view);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Scheduler</h1>
      <Scheduler
        events={events}
        resources={resources}
        onEventClick={handleEventClick}
        onEventChange={handleEventChange}
        onDateChange={handleDateChange}
        onViewChange={handleViewChange}
        className="custom-scheduler"
        headerClassName="custom-header"
        contentClassName="custom-content"
        eventClassName="custom-event"
      />
    </div>
  );
};

export default SchedulerExample;
