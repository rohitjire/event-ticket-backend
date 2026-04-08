import { PublishedEventSummary } from "@/domain/domain";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import { getEventGradient, getEventAccent } from "@/lib/utils";

interface PublishedEventCardProperties {
  publishedEvent: PublishedEventSummary;
}

const PublishedEventCard: React.FC<PublishedEventCardProperties> = ({
  publishedEvent,
}) => {
  const gradient = getEventGradient(publishedEvent.name);
  const accent = getEventAccent(publishedEvent.name);

  return (
    <Link to={`/events/${publishedEvent.id}`}>
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
        {/* Gradient Header */}
        <div
          className={`h-24 bg-gradient-to-br ${gradient} flex items-center justify-center`}
        >
          <Calendar className={`h-8 w-8 ${accent} opacity-60 group-hover:opacity-100 transition-opacity`} />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2">
            {publishedEvent.name}
          </h3>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{publishedEvent.venue}</span>
            </div>

            {publishedEvent.start && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>
                  {format(publishedEvent.start, "MMM d, yyyy")}
                  {publishedEvent.end &&
                    ` - ${format(publishedEvent.end, "MMM d, yyyy")}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PublishedEventCard;
