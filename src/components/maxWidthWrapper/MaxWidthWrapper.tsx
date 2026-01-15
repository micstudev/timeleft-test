import { APP_MAX_WIDTH_PX } from "@/constants";

interface MaxWidthWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function MaxWidthWrapper({ children, className = "" }: MaxWidthWrapperProps) {
  return <div className={`mx-auto w-full max-w-[${APP_MAX_WIDTH_PX}]  ${className}`}>{children}</div>;
}
