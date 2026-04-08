import NavBar from "@/components/nav-bar";
import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SpringBootPagination, TicketStatus, TicketSummary } from "@/domain/domain";
import { listTickets } from "@/lib/api";
import { AlertCircle, DollarSign, Tag, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";

const DashboardListTickets: React.FC = () => {
  const { isLoading, user } = useAuth();

  const [tickets, setTickets] = useState<
    SpringBootPagination<TicketSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (isLoading || !user?.access_token) {
      return;
    }

    const doUseEffect = async () => {
      try {
        setTickets(await listTickets(user.access_token, page));
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

    doUseEffect();
  }, [isLoading, user?.access_token, page]);

  const getStatusStyle = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.PURCHASED:
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case TicketStatus.CANCELLED:
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  if (error) {
    return (
      <div className="bg-gray-950 min-h-screen text-white">
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
        <div className="py-8">
          <h1 className="text-2xl font-bold">Your Tickets</h1>
          <p className="text-gray-400 text-sm mt-1">
            Tickets you have purchased
          </p>
        </div>

        {tickets?.content && tickets.content.length > 0 ? (
          <div className="space-y-3">
            {tickets.content.map((ticketItem) => (
              <Link to={`/dashboard/tickets/${ticketItem.id}`} key={ticketItem.id}>
                <div className="bg-gray-900 border border-gray-800 border-l-4 border-l-purple-500 rounded-xl p-5 hover:border-gray-700 transition-colors cursor-pointer mb-3">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-purple-400" />
                      <h3 className="font-semibold text-lg">
                        {ticketItem.ticketType.name}
                      </h3>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(ticketItem.status)}`}
                    >
                      {ticketItem.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">
                        ${ticketItem.ticketType.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Tag className="h-4 w-4" />
                      <span className="font-mono text-xs text-gray-500">
                        {ticketItem.id}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-20">
              <Ticket className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No tickets yet</p>
              <p className="text-gray-600 text-sm mt-1">
                Purchase tickets from the events page
              </p>
            </div>
          )
        )}

        <div className="flex justify-center py-8">
          {tickets && (
            <SimplePagination pagination={tickets} onPageChange={setPage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardListTickets;
