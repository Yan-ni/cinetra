import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  IconInnerShadowTop,
  IconSettings,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboardIcon } from "lucide-react";

const navData = {
  navMain: [
    {
      title: "Shows",
      url: "/shows",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Movies",
      url: "/movies",
      icon: LayoutDashboardIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState({
    name: "Loading...",
    email: "",
    avatar: "/avatars/shadcn.jpg",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        axios.defaults.headers.common["Authorization"] =
          localStorage.getItem("Authorization");
        
        const response = await axios.get(
          `${import.meta.env.VITE_API_PATH || ""}/api/v1/user`
        );

        if (response.status === 200 && response.data) {
          setUser({
            name: response.data.username || "User",
            email: response.data.email || "",
            avatar: "/avatars/shadcn.jpg",
          });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        // Keep default values if fetch fails
        setUser({
          name: "User",
          email: "",
          avatar: "/avatars/shadcn.jpg",
        });
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Cinetra</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
        <NavSecondary items={navData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
