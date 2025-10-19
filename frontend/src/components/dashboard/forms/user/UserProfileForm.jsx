import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useStore } from "@/store/store";
import { useAuthContext } from "@/context/auth-provider";
import { IconUser, IconEdit, IconSparkles } from "@tabler/icons-react";
import Loader from "@/components/kokonutui/loader";
import { PageLayout, PageHeader } from "@/components/layouts";
import { FormInput } from "@/components/forms";
import { FormActions } from "@/components/forms";
import { AvatarUpload, ErrorState } from "@/components/shared";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// Validation schema
const profileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
});

export default function UserProfileForm() {
  const [profilePicture, setProfilePicture] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const accessToken = useStore.use.accessToken();
  const {
    user,
    refetchAuth,
    isLoading: authLoading,
    error: authError,
  } = useAuthContext();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  // Load user data
  useEffect(() => {
    if (user) {
      setUserData(user);
      setProfilePicture(user.profilePic || "");
      setValue("username", user.username || "");
      setValue("email", user.email || "");
    }
  }, [user, setValue]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    if (userData) {
      setValue("username", userData.username || "");
      setValue("email", userData.email || "");
      setProfilePicture(userData.profilePic || "");
    }
  };

  const onSubmit = async (data) => {
    try {
      const profileData = {
        ...data,
        profilePic: profilePicture,
      };

      const response = await fetch(`${baseURL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
        refetchAuth();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Error updating profile");
      console.error("Error:", error);
    }
  };

  // Show loading state
  if (authLoading) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
        <Loader 
          title="Loading Profile"
          subtitle="Please wait while we fetch your profile information"
          size="lg"
          fullScreen={true}
        />
      </div>
    );
  }

  // Show error state
  if (authError) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <ErrorState
            title="Error Loading Profile"
            message="Unable to load your profile data"
            onRetry={refetchAuth}
          />
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="User Profile"
        description="Manage your account information and profile picture"
        icon={<IconUser className="h-6 w-6 text-primary" />}
        badges={[
          { variant: 'secondary', icon: <IconSparkles className="h-3 w-3" />, text: 'Profile Management' },
          { variant: 'outline', text: 'Account Settings' },
        ]}
      />

      <Card className="border shadow-lg bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
                <IconUser className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Profile Settings</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Update your personal information and profile picture
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <Badge variant="secondary" className="gap-1">
                  <IconEdit className="h-3 w-3" />
                  Editing
                </Badge>
              ) : (
                <Badge variant="outline">View Mode</Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <Separator className="mx-6" />

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Profile Picture Section */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Profile Picture</h3>
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-lg">
                      <AvatarImage src={profilePicture || "/placeholder-user.jpg"} alt="Profile" />
                      <AvatarFallback>
                        <IconUser className="h-12 w-12 sm:h-16 sm:w-16" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {isEditing && (
                    <AvatarUpload
                      value={profilePicture}
                      onChange={setProfilePicture}
                      endpoint="userAvatar"
                      placeholder="Upload profile picture"
                    />
                  )}
                </div>
              </div>
              
              {/* Profile Information Section */}
              <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
                <FormInput
                  id="username"
                  label="Username"
                  register={register("username")}
                  error={errors.username?.message}
                  placeholder="Enter your username"
                  disabled={!isEditing}
                  required
                />
                
                <FormInput
                  id="email"
                  label="Email Address"
                  type="email"
                  register={register("email")}
                  error={errors.email?.message}
                  placeholder="Enter your email address"
                  disabled={!isEditing}
                  required
                />

                {/* User Info Display */}
                {!isEditing && userData && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Account Information</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><span className="font-medium">Member since:</span> {new Date(userData.createdAt).toLocaleDateString()}</p>
                      <p><span className="font-medium">Role:</span> {userData.role || 'User'}</p>
                      <p><span className="font-medium">Status:</span> Active</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {isEditing ? (
                  <FormActions
                    isEditing={isEditing}
                    isSubmitting={false}
                    onReset={handleCancel}
                    submitText="Save Changes"
                  />
                ) : (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 px-4 py-2 w-full sm:w-auto"
                    >
                      <IconEdit className="h-4 w-4 mr-2 inline" />
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
