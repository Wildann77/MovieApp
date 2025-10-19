import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/dashboard/navigation/app-sidebar";
import { SiteHeader } from "../../components/dashboard/navigation/site-header";
import MovieCreateForm from "../../components/dashboard/forms/movie/MovieCreateForm";
import MovieEditForm from "../../components/dashboard/forms/movie/MovieEditForm";
import MoviesList from "../../components/dashboard/tables/MoviesList";
import ActorForm from "../../components/dashboard/forms/master-data/ActorForm";
import DirectorForm from "../../components/dashboard/forms/master-data/DirectorForm";
import WriterForm from "../../components/dashboard/forms/master-data/WriterForm";
import GenreForm from "../../components/dashboard/forms/master-data/GenreForm";
import UserProfileForm from "../../components/dashboard/forms/user/UserProfileForm";

export default function DashboardLayout() {
  const location = useLocation();
  const [editMovieId, setEditMovieId] = useState(null);

  // Extract tab from URL path
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "movies"; // default
    return path.replace("/dashboard/", "");
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());

  // Update activeTab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  const renderContent = () => {
    // Handle edit mode
    if (editMovieId) {
      return <MovieEditForm movieId={editMovieId} onCancel={() => setEditMovieId(null)} isAdmin={true} />;
    }

    switch (activeTab) {
      case "movies":
        return <MoviesList onEditMovie={setEditMovieId} />;
      case "create-movie":
        return <MovieCreateForm onSuccess={() => setActiveTab("movies")} isAdmin={true} />;
      case "actors":
        return <ActorForm />;
      case "directors":
        return <DirectorForm />;
      case "writers":
        return <WriterForm />;
      case "genres":
        return <GenreForm />;
      case "profile":
        return <UserProfileForm />;
      default:
        return (
          <div className="px-4 lg:px-6">
            <h2 className="text-2xl font-bold">Welcome to Movie Admin Dashboard</h2>
            <p className="text-gray-600 mt-2">Select an option from the sidebar to get started.</p>
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
      <AppSidebar variant="inset" activeTab={activeTab} setActiveTab={setActiveTab} />
      <SidebarInset>
        <SiteHeader />
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
