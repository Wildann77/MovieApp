import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  activeTab,
  onNavClick
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <div key={item.title}>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip={item.title}
                  onClick={() => onNavClick(item.url)}
                  className={activeTab === item.url.replace('#', '') ? 'bg-primary text-primary-foreground' : ''}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* Render children if they exist */}
              {item.children && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <SidebarMenuItem key={child.title}>
                      <SidebarMenuButton 
                        tooltip={child.title}
                        onClick={() => onNavClick(child.url)}
                        className={activeTab === child.url.replace('#', '') ? 'bg-primary text-primary-foreground' : ''}
                        size="sm"
                      >
                        {child.icon && <child.icon />}
                        <span>{child.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              )}
            </div>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
