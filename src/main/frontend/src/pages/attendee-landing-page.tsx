import { useAuth } from "react-oidc-context";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { AlertCircle, KeyRound, Search, Copy, Check } from "lucide-react";
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
      {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
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
      // `query` is guaranteed to be a string here because of the early return
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

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Alert variant="destructive" className="bg-gray-900 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Nav */}
      <div className="flex justify-end p-4 container mx-auto">
        {isAuthenticated ? (
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer"
            >
              Dashboard
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => signoutRedirect()}
            >
              Log out
            </Button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() =>
                signinRedirect({
                  extraQueryParams: { kc_action: "REGISTER" },
                })
              }
            >
              Register
            </Button>
            <Button className="cursor-pointer" onClick={() => signinRedirect()}>
              Log in
            </Button>
          </div>
        )}
      </div>
      {/* Hero */}
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-[url(/organizers-landing-hero.png)] bg-cover min-h-[200px] rounded-lg bg-bottom md:min-h-[250px]">
          <div className="bg-black/45 min-h-[200px] md:min-h-[250px] p-15 md:p-20">
            <h1 className="text-2xl font-bold mb-4">
              Find Tickets to Your Next Event
            </h1>
            <div className="flex gap-2 max-w-lg">
              <Input
                className="bg-white text-black"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button onClick={queryPublishedEvents}>
                <Search />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Published Event Cards */}
      <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-4">
        {publishedEvents?.content?.map((publishedEvent) => (
          <PublishedEventCard
            publishedEvent={publishedEvent}
            key={publishedEvent.id}
          />
        ))}
      </div>

      {publishedEvents && (
        <div className="w-full flex justify-center py-8">
          <SimplePagination
            pagination={publishedEvents}
            onPageChange={setPage}
          />{" "}
        </div>
      )}

      {/* Test Credentials Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <button className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-colors cursor-pointer">
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
