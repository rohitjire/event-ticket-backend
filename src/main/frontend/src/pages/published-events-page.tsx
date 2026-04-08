import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  PublishedEventDetails,
  PublishedEventTicketTypeDetails,
} from "@/domain/domain";
import { getPublishedEvent } from "@/lib/api";
import { getEventGradient, getEventAccent } from "@/lib/utils";
import { AlertCircle, Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link, useNavigate, useParams } from "react-router";
import { format } from "date-fns";

const PublishedEventsPage: React.FC = () => {
  const { isAuthenticated, isLoading, signinRedirect, signoutRedirect } =
    useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState<string | undefined>();
  const [publishedEvent, setPublishedEvent] = useState<
    PublishedEventDetails | undefined
  >();
  const [selectedTicketType, setSelectedTicketType] = useState<
    PublishedEventTicketTypeDetails | undefined
  >();

  useEffect(() => {
    if (!id) {
      setError("ID must be provided!");
      return;
    }

    const doUseEffect = async () => {
      try {
        const eventData = await getPublishedEvent(id);
        setPublishedEvent(eventData);
        if (eventData.ticketTypes.length > 0) {
          setSelectedTicketType(eventData.ticketTypes[0]);
        }
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
    doUseEffect();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4">
        <Alert variant="destructive" className="bg-gray-900 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading || !publishedEvent) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  const gradient = getEventGradient(publishedEvent.name);
  const accent = getEventAccent(publishedEvent.name);

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 flex justify-between items-center h-14">
          <Link
            to="/"
            className="text-lg font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"
          >
            EventTix
          </Link>
          {isAuthenticated ? (
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer text-gray-300 hover:text-white"
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="cursor-pointer text-gray-300 hover:text-white"
                onClick={() => signoutRedirect()}
              >
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                className="cursor-pointer bg-purple-600 hover:bg-purple-700"
                onClick={() => signinRedirect()}
              >
                Log in
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Banner */}
      <div className={`bg-gradient-to-br ${gradient} border-b border-gray-800`}>
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {publishedEvent.name}
          </h1>
          <div className="flex flex-wrap gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <MapPin className={`h-5 w-5 ${accent}`} />
              <span>{publishedEvent.venue}</span>
            </div>
            {publishedEvent.start && (
              <div className="flex items-center gap-2">
                <Calendar className={`h-5 w-5 ${accent}`} />
                <span>
                  {format(publishedEvent.start, "PPP p")}
                  {publishedEvent.end &&
                    ` - ${format(publishedEvent.end, "PPP p")}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Available Tickets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Ticket Type List */}
          <div className="space-y-3">
            {publishedEvent.ticketTypes.map((ticketType) => (
              <button
                key={ticketType.id}
                className={`w-full text-left bg-gray-900 rounded-xl p-5 border transition-all cursor-pointer ${
                  selectedTicketType?.id === ticketType.id
                    ? "border-purple-500 shadow-lg shadow-purple-500/10"
                    : "border-gray-800 hover:border-gray-700"
                }`}
                onClick={() => setSelectedTicketType(ticketType)}
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-white">
                    {ticketType.name}
                  </h3>
                  <span className="text-xl font-bold text-purple-400">
                    ${ticketType.price}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{ticketType.description}</p>
              </button>
            ))}
          </div>

          {/* Purchase Panel */}
          {selectedTicketType && (
            <div className="md:sticky md:top-20 self-start">
              <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-1">
                  {selectedTicketType.name}
                </h2>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-purple-400">
                    ${selectedTicketType.price}
                  </span>
                </div>
                <p className="text-gray-400 mb-6">
                  {selectedTicketType.description}
                </p>
                <Link
                  to={`/events/${publishedEvent.id}/purchase/${selectedTicketType.id}`}
                >
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer h-11">
                    Purchase Ticket
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PublishedEventsPage;
