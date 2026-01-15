import { APP_MAX_WIDTH_PX } from "@/constants";

export function Nav() {
  return (
    <nav className="bg-gray-100 border-b border-gray-200">
      <div className={`max-w-[${APP_MAX_WIDTH_PX}] mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">TimeLeft</h1>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
