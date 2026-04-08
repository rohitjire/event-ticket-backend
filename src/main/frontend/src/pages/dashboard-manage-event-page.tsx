import NavBar from "@/components/nav-bar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateEventRequest,
  CreateTicketTypeRequest,
  EventDetails,
  EventStatusEnum,
  UpdateEventRequest,
  UpdateTicketTypeRequest,
} from "@/domain/domain";
import { createEvent, getEvent, updateEvent } from "@/lib/api";
import { format } from "date-fns";
import {
  AlertCircle,
  CalendarIcon,
  Edit,
  Plus,
  Ticket,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router";

interface DateTimeSelectProperties {
  date: Date | undefined;
  setDate: (date: Date) => void;
  time: string | undefined;
  setTime: (time: string) => void;
  enabled: boolean;
  setEnabled: (isEnabled: boolean) => void;
}

const DateTimeSelect: React.FC<DateTimeSelectProperties> = ({
  date,
  setDate,
  time,
  setTime,
  enabled,
  setEnabled,
}) => {
  return (
    <div className="flex gap-2 items-center">
      <Switch checked={enabled} onCheckedChange={setEnabled} />

      {enabled && (
        <div className="w-full flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-gray-800 border-gray-700 border hover:bg-gray-700">
                <CalendarIcon />
                {date ? format(date, "PPP") : <span>Pick a Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  if (!selectedDate) return;
                  const correctedDate = new Date(
                    Date.UTC(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      selectedDate.getDate(),
                    ),
                  );
                  setDate(correctedDate);
                }}
                className="rounded-md border shadow"
              />
            </PopoverContent>
          </Popover>
          <Input
            type="time"
            className="w-[90px] bg-gray-800 text-white border-gray-700 border [&::-webkit-calendar-picker-indicator]:invert"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

const generateTempId = () => `temp_${crypto.randomUUID()}`;
const isTempId = (id: string | undefined) => id && id.startsWith("temp_");

interface TicketTypeData {
  id: string | undefined;
  name: string;
  price: number;
  totalAvailable?: number;
  description: string;
}

interface EventData {
  id: string | undefined;
  name: string;
  startDate: Date | undefined;
  startTime: string | undefined;
  endDate: Date | undefined;
  endTime: string | undefined;
  venueDetails: string;
  salesStartDate: Date | undefined;
  salesStartTime: string | undefined;
  salesEndDate: Date | undefined;
  salesEndTime: string | undefined;
  ticketTypes: TicketTypeData[];
  status: EventStatusEnum;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

const DashboardManageEventPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [eventData, setEventData] = useState<EventData>({
    id: undefined,
    name: "",
    startDate: undefined,
    startTime: undefined,
    endDate: undefined,
    endTime: undefined,
    venueDetails: "",
    salesStartDate: undefined,
    salesStartTime: undefined,
    salesEndDate: undefined,
    salesEndTime: undefined,
    ticketTypes: [],
    status: EventStatusEnum.DRAFT,
    createdAt: undefined,
    updatedAt: undefined,
  });

  const [currentTicketType, setCurrentTicketType] = useState<
    TicketTypeData | undefined
  >();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventDateEnabled, setEventDateEnabled] = useState(false);
  const [eventSalesDateEnabled, setEventSalesDateEnabled] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof EventData, value: any) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (isEditMode && !isLoading && user?.access_token) {
      const fetchEvent = async () => {
        const event: EventDetails = await getEvent(user.access_token, id);
        setEventData({
          id: event.id,
          name: event.name,
          startDate: event.start,
          startTime: event.start
            ? formatTimeFromDate(new Date(event.start))
            : undefined,
          endDate: event.end,
          endTime: event.end
            ? formatTimeFromDate(new Date(event.end))
            : undefined,
          venueDetails: event.venue,
          salesStartDate: event.salesStart,
          salesStartTime: event.salesStart
            ? formatTimeFromDate(new Date(event.salesStart))
            : undefined,
          salesEndDate: event.salesEnd,
          salesEndTime: event.salesEnd
            ? formatTimeFromDate(new Date(event.salesEnd))
            : undefined,
          status: event.status,
          ticketTypes: event.ticketTypes.map((ticket) => ({
            id: ticket.id,
            name: ticket.name,
            description: ticket.description,
            price: ticket.price,
            totalAvailable: ticket.totalAvailable,
          })),
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
        });
        setEventDateEnabled(!!(event.start || event.end));
        setEventSalesDateEnabled(!!(event.salesStart || event.salesEnd));
      };
      fetchEvent();
    }
  }, [id, user]);

  const formatTimeFromDate = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const combineDateTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time
      .split(":")
      .map((num) => Number.parseInt(num, 10));
    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(hours);
    combinedDateTime.setMinutes(minutes);
    combinedDateTime.setSeconds(0);
    return new Date(
      Date.UTC(
        combinedDateTime.getFullYear(),
        combinedDateTime.getMonth(),
        combinedDateTime.getDate(),
        hours,
        minutes,
        0,
        0,
      ),
    );
  };

  const handleEventUpdateSubmit = async (accessToken: string, id: string) => {
    const ticketTypes: UpdateTicketTypeRequest[] = eventData.ticketTypes.map(
      (ticketType) => ({
        id: isTempId(ticketType.id) ? undefined : ticketType.id,
        name: ticketType.name,
        price: ticketType.price,
        description: ticketType.description,
        totalAvailable: ticketType.totalAvailable,
      }),
    );

    const request: UpdateEventRequest = {
      id,
      name: eventData.name,
      start:
        eventData.startDate && eventData.startTime
          ? combineDateTime(eventData.startDate, eventData.startTime)
          : undefined,
      end:
        eventData.endDate && eventData.endTime
          ? combineDateTime(eventData.endDate, eventData.endTime)
          : undefined,
      venue: eventData.venueDetails,
      salesStart:
        eventData.salesStartDate && eventData.salesStartTime
          ? combineDateTime(eventData.salesStartDate, eventData.salesStartTime)
          : undefined,
      salesEnd:
        eventData.salesEndDate && eventData.salesEndTime
          ? combineDateTime(eventData.salesEndDate, eventData.salesEndTime)
          : undefined,
      status: eventData.status,
      ticketTypes,
    };

    try {
      await updateEvent(accessToken, id, request);
      navigate("/dashboard/events");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleEventCreateSubmit = async (accessToken: string) => {
    const ticketTypes: CreateTicketTypeRequest[] = eventData.ticketTypes.map(
      (ticketType) => ({
        name: ticketType.name,
        price: ticketType.price,
        description: ticketType.description,
        totalAvailable: ticketType.totalAvailable,
      }),
    );

    const request: CreateEventRequest = {
      name: eventData.name,
      start:
        eventData.startDate && eventData.startTime
          ? combineDateTime(eventData.startDate, eventData.startTime)
          : undefined,
      end:
        eventData.endDate && eventData.endTime
          ? combineDateTime(eventData.endDate, eventData.endTime)
          : undefined,
      venue: eventData.venueDetails,
      salesStart:
        eventData.salesStartDate && eventData.salesStartTime
          ? combineDateTime(eventData.salesStartDate, eventData.salesStartTime)
          : undefined,
      salesEnd:
        eventData.salesEndDate && eventData.salesEndTime
          ? combineDateTime(eventData.salesEndDate, eventData.salesEndTime)
          : undefined,
      status: eventData.status,
      ticketTypes,
    };

    try {
      await createEvent(accessToken, request);
      navigate("/dashboard/events");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (isLoading || !user || !user.access_token) {
      return;
    }

    if (isEditMode) {
      if (!eventData.id) {
        setError("Event does not have an ID");
        return;
      }
      await handleEventUpdateSubmit(user.access_token, eventData.id);
    } else {
      await handleEventCreateSubmit(user.access_token);
    }
  };

  const handleAddTicketType = () => {
    setCurrentTicketType({
      id: undefined,
      name: "",
      price: 0,
      totalAvailable: 0,
      description: "",
    });
    setDialogOpen(true);
  };

  const handleSaveTicketType = () => {
    if (!currentTicketType) return;

    const newTicketTypes = [...eventData.ticketTypes];

    if (currentTicketType.id) {
      const index = newTicketTypes.findIndex(
        (t) => t.id === currentTicketType.id,
      );
      if (index !== -1) {
        newTicketTypes[index] = currentTicketType;
      }
    } else {
      newTicketTypes.push({
        ...currentTicketType,
        id: generateTempId(),
      });
    }

    updateField("ticketTypes", newTicketTypes);
    setDialogOpen(false);
  };

  const handleEditTicketType = (ticketType: TicketTypeData) => {
    setCurrentTicketType(ticketType);
    setDialogOpen(true);
  };

  const handleDeleteTicketType = (id: string | undefined) => {
    if (!id) return;
    updateField(
      "ticketTypes",
      eventData.ticketTypes.filter((t) => t.id !== id),
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit Event" : "Create a New Event"}
          </h1>
          {isEditMode ? (
            <div className="text-sm text-gray-500 mt-1 space-y-0.5">
              {eventData.id && <p>ID: {eventData.id}</p>}
              {eventData.createdAt && (
                <p>Created: {format(eventData.createdAt, "PPP")}</p>
              )}
              {eventData.updatedAt && (
                <p>Updated: {format(eventData.updatedAt, "PPP")}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-sm mt-1">
              Fill out the form below to create your event
            </p>
          )}
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Event Details Section */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Event Details
            </h3>

            <div>
              <label htmlFor="event-name" className="text-sm font-medium">
                Event Name
              </label>
              <Input
                id="event-name"
                className="bg-gray-800 border-gray-700 text-white mt-1"
                placeholder="Event Name"
                value={eventData.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                This is the public name of your event.
              </p>
            </div>

            <div>
              <label htmlFor="venue-details" className="text-sm font-medium">
                Venue Details
              </label>
              <Textarea
                id="venue-details"
                className="bg-gray-800 border-gray-700 min-h-[80px] mt-1"
                value={eventData.venueDetails}
                onChange={(e) => updateField("venueDetails", e.target.value)}
              />
            </div>
          </div>

          {/* Schedule Section */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Schedule
            </h3>

            <div>
              <label className="text-sm font-medium">Event Start</label>
              <DateTimeSelect
                date={eventData.startDate}
                setDate={(date) => updateField("startDate", date)}
                time={eventData.startTime}
                setTime={(time) => updateField("startTime", time)}
                enabled={eventDateEnabled}
                setEnabled={setEventDateEnabled}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Event End</label>
              <DateTimeSelect
                date={eventData.endDate}
                setDate={(date) => updateField("endDate", date)}
                time={eventData.endTime}
                setTime={(time) => updateField("endTime", time)}
                enabled={eventDateEnabled}
                setEnabled={setEventDateEnabled}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Sales Start</label>
              <DateTimeSelect
                date={eventData.salesStartDate}
                setDate={(date) => updateField("salesStartDate", date)}
                time={eventData.salesStartTime}
                setTime={(time) => updateField("salesStartTime", time)}
                enabled={eventSalesDateEnabled}
                setEnabled={setEventSalesDateEnabled}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Sales End</label>
              <DateTimeSelect
                date={eventData.salesEndDate}
                setDate={(date) => updateField("salesEndDate", date)}
                time={eventData.salesEndTime}
                setTime={(time) => updateField("salesEndTime", time)}
                enabled={eventSalesDateEnabled}
                setEnabled={setEventSalesDateEnabled}
              />
            </div>
          </div>

          {/* Ticket Types Section */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  Ticket Types
                </h3>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleAddTicketType()}
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>

              <div className="space-y-2">
                {eventData.ticketTypes.map((ticketType) => (
                  <div
                    key={ticketType.id}
                    className="bg-gray-800 w-full p-4 rounded-lg border border-gray-700"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex gap-3 items-center">
                          <p className="font-medium">{ticketType.name}</p>
                          <Badge
                            variant="outline"
                            className="border-gray-600 text-gray-300 text-xs"
                          >
                            ${ticketType.price}
                          </Badge>
                        </div>
                        {ticketType.totalAvailable && (
                          <p className="text-gray-500 text-sm mt-0.5">
                            {ticketType.totalAvailable} tickets available
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                          onClick={() => handleEditTicketType(ticketType)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDeleteTicketType(ticketType.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <DialogContent className="bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>
                    {currentTicketType?.id ? "Edit" : "Add"} Ticket Type
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Enter details of the ticket type
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-1">
                  <Label htmlFor="ticket-type-name">Name</Label>
                  <Input
                    id="ticket-type-name"
                    className="bg-gray-800 border-gray-700"
                    value={currentTicketType?.name}
                    onChange={(e) =>
                      setCurrentTicketType(
                        currentTicketType
                          ? { ...currentTicketType, name: e.target.value }
                          : undefined,
                      )
                    }
                    placeholder="e.g General Admission, VIP"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="space-y-1 w-full">
                    <Label htmlFor="ticket-type-price">Price</Label>
                    <Input
                      id="ticket-type-price"
                      type="number"
                      value={currentTicketType?.price}
                      onChange={(e) =>
                        setCurrentTicketType(
                          currentTicketType
                            ? {
                                ...currentTicketType,
                                price: Number.parseFloat(e.target.value),
                              }
                            : undefined,
                        )
                      }
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>

                  <div className="space-y-1 w-full">
                    <Label htmlFor="ticket-type-total-available">
                      Total Available
                    </Label>
                    <Input
                      id="ticket-type-total-available"
                      type="number"
                      value={currentTicketType?.totalAvailable}
                      onChange={(e) =>
                        setCurrentTicketType(
                          currentTicketType
                            ? {
                                ...currentTicketType,
                                totalAvailable: Number.parseFloat(
                                  e.target.value,
                                ),
                              }
                            : undefined,
                        )
                      }
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ticket-type-description">Description</Label>
                  <Textarea
                    id="ticket-type-description"
                    className="bg-gray-800 border-gray-700"
                    value={currentTicketType?.description}
                    onChange={(e) =>
                      setCurrentTicketType(
                        currentTicketType
                          ? {
                              ...currentTicketType,
                              description: e.target.value,
                            }
                          : undefined,
                      )
                    }
                  />
                </div>
                <DialogFooter>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={handleSaveTicketType}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Status */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 space-y-2">
            <Label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Status
            </Label>
            <Select
              value={eventData.status}
              onValueChange={(value) => updateField("status", value)}
            >
              <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select Event Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-white">
                <SelectItem value={EventStatusEnum.DRAFT}>Draft</SelectItem>
                <SelectItem value={EventStatusEnum.PUBLISHED}>
                  Published
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-gray-900 border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={() => navigate("/dashboard/events")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              className="bg-purple-600 hover:bg-purple-700 flex-1"
            >
              {isEditMode ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardManageEventPage;
