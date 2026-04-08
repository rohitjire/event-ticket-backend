import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { purchaseTicket } from "@/lib/api";
import { CheckCircle, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router";

const PurchaseTicketPage: React.FC = () => {
  const { eventId, ticketTypeId } = useParams();
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const [isPurchaseSuccess, setIsPurchaseASuccess] = useState(false);

  useEffect(() => {
    if (!isPurchaseSuccess) {
      return;
    }
    const timer = setTimeout(() => {
      navigate("/dashboard/tickets");
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPurchaseSuccess]);

  const handlePurchase = async () => {
    if (isLoading || !user?.access_token || !eventId || !ticketTypeId) {
      return;
    }
    try {
      await purchaseTicket(user.access_token, eventId, ticketTypeId);
      setIsPurchaseASuccess(true);
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

  if (isPurchaseSuccess) {
    return (
      <div className="bg-gray-950 min-h-screen text-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl p-8 text-center shadow-2xl">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
            <p className="text-purple-200">
              Your ticket purchase was successful.
            </p>
            <p className="text-purple-300 text-sm mt-2">
              Redirecting to your tickets...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
          <div className="text-center mb-2">
            <CreditCard className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <h2 className="text-xl font-bold">Complete Purchase</h2>
          </div>

          {error && (
            <div className="border border-red-800 rounded-lg p-4 bg-red-900/20">
              <div className="text-red-400 text-sm">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          {/* Credit Card Number */}
          <div className="space-y-2">
            <Label className="text-gray-400">Credit Card Number</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="bg-gray-800 border-gray-700 text-white pl-10"
              />
              <CreditCard className="absolute h-4 w-4 text-gray-500 top-2.5 left-3" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400">Cardholder Name</Label>
            <Input
              type="text"
              placeholder="John Smith"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer h-11"
            onClick={handlePurchase}
          >
            Purchase Ticket
          </Button>

          <p className="text-gray-500 text-xs text-center">
            This is a demo -- no real payment is processed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTicketPage;
