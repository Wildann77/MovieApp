import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "../../ui/sidebar";
import { AdminSidebar } from "../AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import SystemStats from "./SystemStats";
import UserManagement from "../management/UserManagement";
import MovieManagement from "../management/MovieManagement";
import ReviewModeration from "../management/ReviewModeration";
import MasterDataWrapper from "../../shared/MasterDataWrapper";
import { useAdminActors, useAdminDirectors, useAdminWriters, useAdminGenres } from "../../../hooks/useAdminMasterData";

export default function AdminDashboard() {
  const location = useLocation();

  // Extract tab from URL path
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path === "/admin") return "dashboard"; // default
    return path.replace("/admin/", "");
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());

  // Update activeTab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  console.log('🔍 AdminDashboard activeTab:', activeTab);

  const renderContent = () => {
    console.log('🔍 AdminDashboard renderContent called with activeTab:', activeTab);
    switch (activeTab) {
      case "dashboard":
        return <SystemStats />;
      case "users":
        return <UserManagement />;
      case "movies":
        return <MovieManagement />;
      case "reviews":
        return <ReviewModeration />;
      case "master-data":
        // Default to actors when accessing master-data directly
        return (
          <MasterDataWrapper
            mode="admin"
            entityType="actor"
            hooks={useAdminActors}
          />
        );
      case "actors":
        console.log('🔍 AdminDashboard: Rendering MasterDataWrapper for actors');
        return (
          <MasterDataWrapper
            mode="admin"
            entityType="actor"
            hooks={useAdminActors}
          />
        );
      case "directors":
        return (
          <MasterDataWrapper
            mode="admin"
            entityType="director"
            hooks={useAdminDirectors}
          />
        );
      case "writers":
        return (
          <MasterDataWrapper
            mode="admin"
            entityType="writer"
            hooks={useAdminWriters}
          />
        );
      case "genres":
        return (
          <MasterDataWrapper
            mode="admin"
            entityType="genre"
            hooks={useAdminGenres}
          />
        );
      default:
        return (
          <div className="px-4 lg:px-6">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <p className="text-gray-600 mt-2">Select an option from the sidebar to manage the system.</p>
          </div>
        );
    }
  };

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AdminSidebar variant="inset" activeTab={activeTab} setActiveTab={setActiveTab} />
      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col min-h-0">
          <div className="flex flex-1 flex-col gap-2 min-h-0">
            <div className="flex flex-col gap-4 py-3 md:py-4 lg:gap-6 lg:py-6 min-h-0 overflow-hidden">
              {renderContent()}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

