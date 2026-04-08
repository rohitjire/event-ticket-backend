import { Button } from "@/components/ui/button";
import { CalendarPlus, QrCode, Ticket } from "lucide-react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

const features = [
  {
    icon: CalendarPlus,
    title: "Create Events",
    description:
      "Set up events with custom ticket types, pricing, and availability.",
  },
  {
    icon: Ticket,
    title: "Sell Tickets",
    description:
      "Publish events and let attendees purchase tickets instantly online.",
  },
  {
    icon: QrCode,
    title: "Validate with QR",
    description:
      "Scan QR codes at the venue for fast, secure ticket validation.",
  },
];

const OrganizersLandingPage: React.FC = () => {
  const { isAuthenticated, isLoading, signinRedirect, signoutRedirect } =
    useAuth();

  const navigate = useNavigate();

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
                onClick={() => navigate("/dashboard/events")}
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
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Create, Manage, and Sell Event Tickets with Ease
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              A complete platform for event organizers to create events, sell
              tickets, and validate attendees with QR codes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                className="cursor-pointer bg-purple-600 hover:bg-purple-700 px-6"
                onClick={() => navigate("/dashboard/events/create")}
              >
                Create an Event
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => navigate("/")}
              >
                Browse Events
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center mb-12">
          Everything You Need
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-purple-500/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-600/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizersLandingPage;
