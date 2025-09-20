const HistoryItem = ({
  multiplier,
  won,
}: {
  multiplier: string;
  won: boolean;
}) => {
  return (
    <div
      className={`px-2 w-16 py-2 ${
        won ? "bg-green-600" : "bg-slate-700/50"
      } text-white rounded text-center text-sm font-medium`}
    >
      {multiplier}
    </div>
  );
};

export default HistoryItem;
