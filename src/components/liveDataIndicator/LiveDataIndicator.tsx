export const LiveDataIndicator = ({
  isLive,
  lastUpdated,
  refreshData
}: {
  isLive: boolean;
  lastUpdated: number;
  refreshData: () => void;
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
        <span className="text-sm text-gray-600">
          {isLive ? "Updating..." : `Last updated: ${new Date(lastUpdated).toLocaleTimeString()}`}
        </span>
      </div>
      <button
        onClick={refreshData}
        disabled={isLive}
        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
        {isLive ? "Updating..." : "Refresh"}
      </button>
    </div>
  );
};
