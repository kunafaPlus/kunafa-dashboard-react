import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const ganttVariants = cva(
  "w-full overflow-auto border rounded-lg bg-background",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border-2",
        ghost: "bg-muted/50 border-none",
      },
      size: {
        sm: "min-h-[300px]",
        md: "min-h-[400px]",
        lg: "min-h-[500px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress?: number;
  dependencies?: string[];
  assignee?: string;
  status?: "todo" | "in-progress" | "completed" | "blocked";
  color?: string;
}

interface GanttProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ganttVariants> {
  tasks: GanttTask[];
  viewMode?: "day" | "week" | "month";
  startDate?: Date;
  endDate?: Date;
  onTaskClick?: (task: GanttTask) => void;
  onDateChange?: (task: GanttTask, start: Date, end: Date) => void;
  highlightToday?: boolean;
  showWeekends?: boolean;
  readonly?: boolean;
}

const Gantt = React.forwardRef<HTMLDivElement, GanttProps>(
  (
    {
      className,
      variant,
      size,
      tasks,
      viewMode = "week",
      startDate: propStartDate,
      endDate: propEndDate,
      onTaskClick,
      onDateChange,
      highlightToday = true,
      showWeekends = true,
      readonly = false,
      ...props
    },
    ref
  ) => {
    // Calculate date range
    const calculateDateRange = () => {
      if (propStartDate && propEndDate) {
        return { start: propStartDate, end: propEndDate };
      }

      const start = new Date(
        Math.min(...tasks.map((task) => task.start.getTime()))
      );
      const end = new Date(
        Math.max(...tasks.map((task) => task.end.getTime()))
      );

      // Add padding
      start.setDate(start.getDate() - 7);
      end.setDate(end.getDate() + 7);

      return { start, end };
    };

    const { start: startDate, end: endDate } = calculateDateRange();

    // Generate time slots based on view mode
    const generateTimeSlots = () => {
      const slots: Date[] = [];
      const current = new Date(startDate);

      while (current <= endDate) {
        if (showWeekends || (current.getDay() !== 0 && current.getDay() !== 6)) {
          slots.push(new Date(current));
        }

        switch (viewMode) {
          case "day":
            current.setDate(current.getDate() + 1);
            break;
          case "week":
            current.setDate(current.getDate() + 7);
            break;
          case "month":
            current.setMonth(current.getMonth() + 1);
            break;
        }
      }

      return slots;
    };

    const timeSlots = generateTimeSlots();

    // Calculate task position and width
    const getTaskStyle = (task: GanttTask) => {
      const totalDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const taskStart = Math.ceil(
        (task.start.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const taskDuration = Math.ceil(
        (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        left: `${(taskStart / totalDays) * 100}%`,
        width: `${(taskDuration / totalDays) * 100}%`,
        backgroundColor: task.color || "var(--primary)",
      };
    };

    const getStatusColor = (status?: GanttTask["status"]) => {
      switch (status) {
        case "todo":
          return "bg-muted";
        case "in-progress":
          return "bg-blue-500";
        case "completed":
          return "bg-green-500";
        case "blocked":
          return "bg-red-500";
        default:
          return "bg-muted";
      }
    };

    const formatDate = (date: Date) => {
      switch (viewMode) {
        case "day":
          return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });
        case "week":
          return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });
        case "month":
          return date.toLocaleDateString(undefined, { month: "short" });
      }
    };

    const today = new Date();

    return (
      <div
        ref={ref}
        className={cn(ganttVariants({ variant, size }), className)}
        {...props}
      >
        <div className="flex">
          {/* Task names column */}
          <div className="min-w-[200px] border-r bg-muted/10">
            <div className="sticky top-0 p-2 font-medium border-b bg-background">
              Tasks
            </div>
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-2 border-b hover:bg-accent/50 cursor-pointer"
                onClick={() => onTaskClick?.(task)}
              >
                <div className="font-medium">{task.name}</div>
                {task.assignee && (
                  <div className="text-sm text-muted-foreground">
                    {task.assignee}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative flex-1">
            {/* Header */}
            <div className="sticky top-0 flex border-b bg-background">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex-1 p-2 text-center border-r text-sm",
                    !showWeekends &&
                      (slot.getDay() === 0 || slot.getDay() === 6) &&
                      "bg-muted/10"
                  )}
                >
                  {formatDate(slot)}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="relative">
              {/* Today line */}
              {highlightToday && today >= startDate && today <= endDate && (
                <div
                  className="absolute top-0 bottom-0 w-px bg-primary"
                  style={{
                    left: `${
                      ((today.getTime() - startDate.getTime()) /
                        (endDate.getTime() - startDate.getTime())) *
                      100
                    }%`,
                  }}
                />
              )}

              {/* Tasks */}
              {tasks.map((task) => (
                <div key={task.id} className="relative h-16 border-b">
                  <div
                    className={cn(
                      "absolute top-2 h-8 rounded",
                      getStatusColor(task.status)
                    )}
                    style={getTaskStyle(task)}
                  >
                    {/* Progress bar */}
                    {task.progress !== undefined && (
                      <div
                        className="absolute top-0 left-0 h-full bg-black/10"
                        style={{ width: `${task.progress}%` }}
                      />
                    )}

                    {/* Dependencies */}
                    {task.dependencies?.map((depId) => {
                      const dep = tasks.find((t) => t.id === depId);
                      if (!dep) return null;

                      return (
                        <div
                          key={depId}
                          className="absolute -top-2 w-2 h-2 border-2 border-primary rounded-full bg-background"
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Gantt.displayName = "Gantt";

export { Gantt, type GanttTask };
