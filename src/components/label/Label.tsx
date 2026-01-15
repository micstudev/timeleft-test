export const Label = ({
  htmlFor,
  className,
  children
}: {
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
};
