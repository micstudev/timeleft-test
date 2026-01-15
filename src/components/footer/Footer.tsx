import { APP_MAX_WIDTH_PX } from "@/constants";

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className={`max-w-[${APP_MAX_WIDTH_PX}] mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="py-8"></div>
      </div>
    </footer>
  );
}
