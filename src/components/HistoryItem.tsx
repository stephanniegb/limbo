const HistoryItem = ({
  multiplier,
  won,
}: {
  multiplier: string;
  won: boolean;
}) => {
  return (
    <div
      className={`px-4 py-2 ${
        won ? "bg-green-600" : "bg-slate-700/50"
      } text-white rounded text-sm font-medium`}
    >
      {multiplier}x
    </div>
  );
};

export default HistoryItem;
