import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  TicketValidationMethod,
  TicketValidationStatus,
} from "@/domain/domain";
import { AlertCircle, Check, RotateCcw, ScanLine, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { validateTicket } from "@/lib/api";
import { useAuth } from "react-oidc-context";
import NavBar from "@/components/nav-bar";

const DashboardValidateQrPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const [isManual, setIsManual] = useState(false);
  const [data, setData] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [validationStatus, setValidationStatus] = useState<
    TicketValidationStatus | undefined
  >();

  const handleReset = () => {
    setIsManual(false);
    setData(undefined);
    setError(undefined);
    setValidationStatus(undefined);
  };

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else if (typeof err === "string") {
      setError(err);
    } else {
      setError("An unknown error occurred");
    }
  };

  const handleValidate = async (id: string, method: TicketValidationMethod) => {
    if (!user?.access_token) {
      return;
    }
    try {
      const response = await validateTicket(user.access_token, {
        id,
        method,
      });
      setValidationStatus(response.status);
    } catch (err) {
      handleError(err);
    }
  };

  if (isLoading || !user?.access_token) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar />

      <div className="container mx-auto px-4 py-8 max-w-sm">
        <div className="text-center mb-6">
          <ScanLine className="h-8 w-8 text-purple-400 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Ticket Validation</h1>
          <p className="text-gray-400 text-sm mt-1">
            Scan a QR code or enter a ticket ID
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-5">
          {error && (
            <Alert variant="destructive" className="bg-gray-900 border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Scanner Viewport */}
          <div className="rounded-lg overflow-hidden relative">
            <Scanner
              key={`scanner-${data}-${validationStatus}`}
              onScan={(result) => {
                if (result) {
                  const qrCodeId = result[0].rawValue;
                  setData(qrCodeId);
                  handleValidate(qrCodeId, TicketValidationMethod.QR_SCAN);
                }
              }}
              onError={handleError}
            />

            {validationStatus && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                {validationStatus === TicketValidationStatus.VALID ? (
                  <div className="bg-green-500 rounded-full p-4 shadow-lg shadow-green-500/30">
                    <Check className="w-16 h-16" />
                  </div>
                ) : (
                  <div className="bg-red-500 rounded-full p-4 shadow-lg shadow-red-500/30">
                    <X className="w-16 h-16" />
                  </div>
                )}
              </div>
            )}
          </div>

          {isManual ? (
            <div className="space-y-3">
              <Input
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter ticket ID..."
                onChange={(e) => setData(e.target.value)}
              />
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 h-12 cursor-pointer"
                onClick={() =>
                  handleValidate(data || "", TicketValidationMethod.MANUAL)
                }
              >
                Validate
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-gray-800 border border-gray-700 h-10 rounded-lg font-mono text-sm flex justify-center items-center text-gray-400">
                {data || "Waiting for scan..."}
              </div>
              <Button
                className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 h-12 cursor-pointer"
                onClick={() => setIsManual(true)}
              >
                Enter Manually
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            className="w-full text-gray-400 hover:text-white cursor-pointer"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardValidateQrPage;
