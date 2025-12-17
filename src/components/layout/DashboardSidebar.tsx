"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import { ReactNode } from "react";

export type SidebarItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  active?: boolean;
};

interface DashboardSidebarProps {
  title: string;
  items: SidebarItem[];
  footerLinks?: { label: string; href: string }[];
}

const DashboardSidebar = ({ title, items, footerLinks = [] }: DashboardSidebarProps) => {
  return (
    <aside className="lg:col-span-1">
      <Card className="bg-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">{title}</h2>
        </div>
        <nav className="space-y-2">
          {items.map((item) => {
            const common = "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm md:text-base";
            const active = item.active;
            const classes = active
              ? "bg-[#E6F0FA] text-[#0056A3]"
              : "text-[#1A1A1A] hover:bg-[#F5F8FC]";
            if (item.href) {
              return (
                <Link key={item.label} href={item.href} className={`${common} ${classes}`}>
                  {item.icon}
                  {item.label}
                </Link>
              );
            }
            return (
              <button key={item.label} className={`${common} ${classes}`} onClick={item.onClick}>
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {footerLinks.length > 0 && (
          <div className="pt-2 border-t border-[#E5E7EB] mt-4">
            <div className="text-xs text-[#666666] mb-2">Quick Access</div>
            {footerLinks.map((l) => (
              <Link key={l.href} href={l.href} className="block px-3 py-2 rounded-md text-sm hover:bg-[#F5F8FC]">
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </Card>
    </aside>
  );
};

export default DashboardSidebar;