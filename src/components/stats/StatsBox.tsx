interface StatsBoxProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeVariants = {
  sm: {
    container: "p-3",
    title: "text-xs font-medium",
    content: "text-lg font-bold mt-1"
  },
  md: {
    container: "p-4",
    title: "text-sm font-medium",
    content: "text-2xl font-bold mt-2"
  },
  lg: {
    container: "p-6",
    title: "text-sm font-medium",
    content: "text-4xl font-bold mt-3"
  }
};

export function StatsBox({ title, children, className = "", size = "lg" }: StatsBoxProps) {
  const variant = sizeVariants[size];

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${variant.container} ${className}`}>
      <p className={`text-gray-600 uppercase tracking-wide ${variant.title}`}>{title}</p>
      <p className={`text-gray-900 capitalize ${variant.content}`}>{children}</p>
    </div>
  );
}
