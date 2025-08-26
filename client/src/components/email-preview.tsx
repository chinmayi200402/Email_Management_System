import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Monitor, Smartphone } from "lucide-react";
import { useState } from "react";

interface EmailPreviewProps {
  htmlContent: string;
}

export default function EmailPreview({ htmlContent }: EmailPreviewProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="mr-2 text-primary" />
          Email Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600">Preview</span>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("desktop")}
                data-testid="button-desktop-view"
              >
                <Monitor className="h-3 w-3 mr-1" />
                Desktop
              </Button>
              <Button
                variant={viewMode === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("mobile")}
                data-testid="button-mobile-view"
              >
                <Smartphone className="h-3 w-3 mr-1" />
                Mobile
              </Button>
            </div>
          </div>
          <div
            className={`h-96 overflow-auto bg-white transition-all duration-200 ${
              viewMode === "mobile" ? "max-w-sm mx-auto" : ""
            }`}
            data-testid="email-preview-content"
          >
            {htmlContent ? (
              <iframe
                srcDoc={htmlContent}
                className="w-full h-full border-0"
                title="Email Preview"
                sandbox="allow-same-origin"
              />
            ) : (
              <div className="p-4 text-center text-gray-500 h-full flex items-center justify-center flex-col">
                <Eye className="w-16 h-16 mb-4 text-gray-300" />
                <p>Upload an HTML file to see preview</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
