import NavBar from "@/components/nav-bar";
import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  EventSummary,
  EventStatusEnum,
  SpringBootPagination,
} from "@/domain/domain";
import { deleteEvent, listEvents } from "@/lib/api";
import {
  AlertCircle,
  Calendar,
  Clock,
  Edit,
  MapPin,
  Plus,
  Tag,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";

const DashboardListEventsPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const [events, setEvents] = useState<
    SpringBootPagination<EventSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [deleteEventError, setDeleteEventError] = useState<
    string | undefined
  >();

  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<
    EventSummary | undefined
  >();

  useEffect(() => {
    if (isLoading || !user?.access_token) {
      return;
    }
    refreshEvents(user.access_token);
  }, [isLoading, user, page]);

  const refreshEvents = async (accessToken: string) => {
    try {
      setEvents(await listEvents(accessToken, page));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error has occurred");
      }
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "TBD";
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status: EventStatusEnum) => {
    switch (status) {
      case EventStatusEnum.PUBLISHED:
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case EventStatusEnum.DRAFT:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
      case EventStatusEnum.CANCELLED:
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case EventStatusEnum.COMPLETED:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusBorder = (status: EventStatusEnum) => {
    switch (status) {
      case EventStatusEnum.PUBLISHED:
        return "border-l-green-500";
      case EventStatusEnum.DRAFT:
        return "border-l-gray-500";
      case EventStatusEnum.CANCELLED:
        return "border-l-red-500";
      case EventStatusEnum.COMPLETED:
        return "border-l-blue-500";
      default:
        return "border-l-gray-500";
    }
  };

  const handleOpenDeleteEventDialog = (eventToDelete: EventSummary) => {
    setEventToDelete(eventToDelete);
    setDialogOpen(true);
  };

  const handleCancelDeleteEventDialog = () => {
    setEventToDelete(undefined);
    setDialogOpen(false);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete || isLoading || !user?.access_token) {
      return;
    }

    try {
      setDeleteEventError(undefined);
      await deleteEvent(user.access_token, eventToDelete.id);
      setEventToDelete(undefined);
      setDialogOpen(false);
      refreshEvents(user.access_token);
    } catch (err) {
      if (err instanceof Error) {
        setDeleteEventError(err.message);
      } else if (typeof err === "string") {
        setDeleteEventError(err);
      } else {
        setDeleteEventError("An unknown error has occurred");
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="bg-gray-900 border-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <NavBar />

      <div className="container mx-auto px-4 max-w-2xl">
        {/* Title */}
        <div className="py-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Your Events</h1>
            <p className="text-gray-400 text-sm mt-1">
              Events you have created
            </p>
          </div>
          <Link to="/dashboard/events/create">
            <Button className="bg-purple-600 hover:bg-purple-700 cursor-pointer">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Event Cards */}
        <div className="space-y-3">
          {events?.content.map((eventItem) => (
            <div
              key={eventItem.id}
              className={`bg-gray-900 border border-gray-800 rounded-xl overflow-hidden border-l-4 ${getStatusBorder(eventItem.status)} hover:border-gray-700 transition-colors`}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{eventItem.name}</h3>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(eventItem.status)}`}
                  >
                    {eventItem.status}
                  </span>
                </div>

                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>
                      {formatDate(eventItem.start)} to{" "}
                      {formatDate(eventItem.end)}
                      {eventItem.start && (
                        <span className="text-gray-500 ml-1">
                          {formatTime(eventItem.start)} -{" "}
                          {formatTime(eventItem.end)}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>
                      Sales: {formatDate(eventItem.salesStart)} to{" "}
                      {formatDate(eventItem.salesEnd)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{eventItem.venue}</span>
                  </div>

                  <div className="flex items-start gap-2 text-gray-400">
                    <Tag className="h-4 w-4 shrink-0 mt-0.5" />
                    <div className="flex flex-wrap gap-2">
                      {eventItem.ticketTypes.map((ticketType) => (
                        <span
                          key={ticketType.id}
                          className="bg-gray-800 px-2 py-0.5 rounded text-xs"
                        >
                          {ticketType.name} - ${ticketType.price}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-800">
                  <Link to={`/dashboard/events/update/${eventItem.id}`}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer"
                    onClick={() => handleOpenDeleteEventDialog(eventItem)}
                  >
                    <Trash className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center py-8">
          {events && (
            <SimplePagination pagination={events} onPageChange={setPage} />
          )}
        </div>
      </div>

      <AlertDialog open={dialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will delete your event '{eventToDelete?.name}' and cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteEventError && (
            <Alert variant="destructive" className="border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{deleteEventError}</AlertDescription>
            </Alert>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancelDeleteEventDialog}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteEvent()}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardListEventsPage;
