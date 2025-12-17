"use client";

import type { ReactNode } from "react";
import clsx from "clsx";

export type TabItem = {
  id: string;
  label: string;
  icon?: ReactNode;
};

interface TabBarProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

const TabBar = ({ items, activeId, onChange, className }: TabBarProps) => {
  return (
    <div className={clsx("bg-white rounded-lg border border-gray-200", className)}>
      <div className="overflow-x-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 px-2 sm:px-3 py-2">
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(item.id)}
                className={clsx(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  isActive
                    ? "bg-[#0F4C5C] text-white hover:bg-[#0b3a46] focus-visible:ring-[#0b3a46] focus-visible:ring-offset-white"
                    : "bg-white text-[#0F4C5C] border border-gray-300 hover:bg-gray-50 focus-visible:ring-[#0F4C5C] focus-visible:ring-offset-white"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.icon && <span className="h-4 w-4">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabBar;