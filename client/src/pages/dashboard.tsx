import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import EmailUpload from "@/components/email-upload";
import EmailPreview from "@/components/email-preview";
import EmailLogs from "@/components/email-logs";
import LoadingOverlay from "@/components/loading-overlay";
import { Users, Send, TrendingUp } from "lucide-react";
import type { User } from "@shared/schema";

interface DashboardStats {
  totalUsers: number;
  emailsSentToday: number;
  successRate: number;
}

export default function Dashboard() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [sendProgress, setSendProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch dashboard stats
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  // Fetch users count for stats
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Send email mutation
  const sendEmailMutation = useMutation({
    mutationFn: async (data: { subject: string; htmlContent: string }) => {
      const response = await apiRequest("POST", "/api/send-email", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Emails sent successfully to all recipients!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/email-logs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setUploadedFile(null);
      setHtmlContent("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send emails",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setHtmlContent(content);
    };
    reader.readAsText(file);

    toast({
      title: "File uploaded",
      description: `${file.name} uploaded successfully`,
    });
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setHtmlContent("");
  };

  const handleSendEmail = async (subject: string, htmlContent: string) => {
    setSendProgress(0);
    setProgressText("Preparing to send emails...");
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setSendProgress(prev => {
        const newProgress = prev + Math.random() * 20;
        if (newProgress >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return newProgress;
      });
      
      setProgressText(`Sending emails... ${Math.floor(sendProgress)}% complete`);
    }, 500);

    try {
      await sendEmailMutation.mutateAsync({ subject, htmlContent });
      setSendProgress(100);
      setProgressText("All emails sent successfully!");
      
      setTimeout(() => {
        setSendProgress(0);
        setProgressText("");
      }, 2000);
    } catch (error) {
      setSendProgress(0);
      setProgressText("");
    } finally {
      clearInterval(progressInterval);
    }
  };

  const totalUsers = users?.length || stats?.totalUsers || 0;
  const emailsSentToday = stats?.emailsSentToday || 0;
  const successRate = stats?.successRate || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Email Campaign Dashboard</h1>
            <p className="mt-2 text-gray-600">Upload and send HTML emails to all registered users</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="text-primary" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Recipients</dt>
                    <dd className="text-2xl font-semibold text-gray-900" data-testid="stat-total-users">
                      {totalUsers.toLocaleString()}
                    </dd>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Send className="text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <dt className="text-sm font-medium text-gray-500 truncate">Emails Sent Today</dt>
                    <dd className="text-2xl font-semibold text-gray-900" data-testid="stat-emails-sent">
                      {emailsSentToday.toLocaleString()}
                    </dd>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="text-yellow-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                    <dd className="text-2xl font-semibold text-gray-900" data-testid="stat-success-rate">
                      {successRate.toFixed(1)}%
                    </dd>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email Upload and Preview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <EmailUpload
              onFileUpload={handleFileUpload}
              onSendEmail={handleSendEmail}
              isLoading={sendEmailMutation.isPending}
              uploadedFile={uploadedFile}
              onRemoveFile={handleRemoveFile}
            />
            <EmailPreview htmlContent={htmlContent} />
          </div>

          {/* Email Logs Section */}
          <EmailLogs />
        </div>
      </main>

      <LoadingOverlay
        isVisible={sendEmailMutation.isPending}
        progress={sendProgress}
        progressText={progressText}
      />
    </div>
  );
}
