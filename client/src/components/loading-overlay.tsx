import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LoadingOverlayProps {
  isVisible: boolean;
  progress: number;
  progressText: string;
}

export default function LoadingOverlay({ isVisible, progress, progressText }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="loading-overlay">
      <Card className="max-w-sm mx-4">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sending Emails</h3>
            <p className="text-sm text-gray-600 mb-4">Please wait while we send emails to all recipients...</p>
            <div className="space-y-2">
              <Progress value={progress} className="w-full" data-testid="progress-bar" />
              <p className="text-xs text-gray-500" data-testid="progress-text">{progressText}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
