import { useAuth } from "react-oidc-context";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CalendarSearch,
  KeyRound,
  Search,
  Copy,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PublishedEventSummary, SpringBootPagination } from "@/domain/domain";
import { listPublishedEvents, searchPublishedEvents } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PublishedEventCard from "@/components/published-event-card";
import { SimplePagination } from "@/components/simple-pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const testCredentials = [
  { role: "Attendee", email: "attendee@test.com", password: "test" },
  { role: "Organizer", email: "organizer@test.com", password: "test" },
  { role: "Staff", email: "staff@test.com", password: "test" },
];

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
      title="Copy"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
};

const AttendeeLandingPage: React.FC = () => {
  const { isAuthenticated, isLoading, signinRedirect, signoutRedirect } =
    useAuth();

  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [publishedEvents, setPublishedEvents] = useState<
    SpringBootPagination<PublishedEventSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [query, setQuery] = useState<string | undefined>();

  useEffect(() => {
    if (query && query.length > 0) {
      queryPublishedEvents();
    } else {
      refreshPublishedEvents();
    }
  }, [page]);

  const refreshPublishedEvents = async () => {
    try {
      setPublishedEvents(await listPublishedEvents(page));
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

  const queryPublishedEvents = async () => {
    if (!query) {
      await refreshPublishedEvents();
      return;
    }

    try {
      setPublishedEvents(await searchPublishedEvents(query, page));
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 flex justify-between items-center h-14">
          <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            EventTix
          </span>
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
                variant="ghost"
                className="cursor-pointer text-gray-300 hover:text-white"
                onClick={() =>
                  signinRedirect({
                    extraQueryParams: { kc_action: "REGISTER" },
                  })
                }
              >
                Register
              </Button>
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

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-gray-950 to-indigo-900/20"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 max-w-2xl">
            Find Tickets to Your Next Event
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-lg">
            Browse events, purchase tickets, and get instant QR codes for entry.
          </p>
          <div className="flex gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                className="bg-gray-900/80 border-gray-700 text-white pl-10 placeholder:text-gray-500"
                placeholder="Search events..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && queryPublishedEvents()}
              />
            </div>
            <Button
              onClick={queryPublishedEvents}
              className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="container mx-auto px-4 mb-6">
          <Alert variant="destructive" className="bg-gray-900 border-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Events Section */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="text-xl font-semibold mb-6 text-gray-200">
          Upcoming Events
        </h2>

        {publishedEvents?.content && publishedEvents.content.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {publishedEvents.content.map((publishedEvent) => (
              <PublishedEventCard
                publishedEvent={publishedEvent}
                key={publishedEvent.id}
              />
            ))}
          </div>
        ) : (
          !error && (
            <div className="text-center py-20">
              <CalendarSearch className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No events found</p>
              <p className="text-gray-600 text-sm mt-1">
                Check back later for upcoming events
              </p>
            </div>
          )
        )}

        {publishedEvents && (
          <div className="w-full flex justify-center pt-8">
            <SimplePagination
              pagination={publishedEvents}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Test Credentials Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <button className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-colors cursor-pointer z-50">
            <KeyRound className="h-5 w-5" />
            <span className="text-sm font-medium">Test Credentials</span>
          </button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Demo Test Credentials</DialogTitle>
            <DialogDescription className="text-gray-400">
              Use these accounts to explore different roles in the application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {testCredentials.map((cred) => (
              <div
                key={cred.role}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{cred.role}</span>
                  <Badge
                    variant="outline"
                    className="text-purple-400 border-purple-400"
                  >
                    {cred.role}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Email:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-gray-200">{cred.email}</code>
                      <CopyButton text={cred.email} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Password:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-gray-200">{cred.password}</code>
                      <CopyButton text={cred.password} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendeeLandingPage;
