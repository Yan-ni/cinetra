import { useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface AccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AccountModal({ open, onOpenChange }: AccountModalProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (open) {
      fetchUserData();
    }
  }, [open]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      axios.defaults.headers.common["Authorization"] =
        localStorage.getItem("Authorization");
      
      const response = await axios.get<UserType>(
        `${import.meta.env.VITE_API_PATH || ""}/api/v1/user`,
      );

      if (response.status === 200 && response.data) {
        setUser(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
        });
        setHasChanges(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check if there are changes
    if (user) {
      const hasChanged =
        value !== user[name as keyof Pick<UserType, "username" | "email">] ||
        (name === "username" && value !== user.username) ||
        (name === "email" && value !== user.email);
      
      setHasChanges(hasChanged || formData.username !== user.username || formData.email !== user.email);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasChanges) return;

    try {
      setIsSaving(true);
      axios.defaults.headers.common["Authorization"] =
        localStorage.getItem("Authorization");

      const response = await axios.put<UserType>(
        `${import.meta.env.VITE_API_PATH || ""}/api/v1/user`,
        formData,
      );

      if (response.status === 200) {
        setUser(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
        });
        setHasChanges(false);
        toast.success("Account updated successfully");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update account");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your account information and preferences
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={!hasChanges || isSaving}
                className="w-full"
              >
                {isSaving ? "Updating..." : "Update Account"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
