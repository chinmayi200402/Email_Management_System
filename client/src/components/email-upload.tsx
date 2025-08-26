import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileCode, X, Send } from "lucide-react";

interface EmailUploadProps {
  onFileUpload: (file: File) => void;
  onSendEmail: (subject: string, htmlContent: string) => void;
  isLoading: boolean;
  uploadedFile: File | null;
  onRemoveFile: () => void;
}

export default function EmailUpload({
  onFileUpload,
  onSendEmail,
  isLoading,
  uploadedFile,
  onRemoveFile,
}: EmailUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [subject, setSubject] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file: File) => {
    if (file.type !== "text/html" && !file.name.endsWith(".html")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an HTML file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast({
        title: "File too large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    onFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleSend = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file uploaded",
        description: "Please upload an HTML file first",
        variant: "destructive",
      });
      return;
    }

    if (!subject.trim()) {
      toast({
        title: "Subject required",
        description: "Please enter an email subject",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const htmlContent = e.target?.result as string;
      onSendEmail(subject, htmlContent);
    };
    reader.readAsText(uploadedFile);
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="mr-2 text-primary" />
          Upload Email Template
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Subject Input */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Email Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            data-testid="input-subject"
          />
        </div>

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            isDragOver
              ? "border-primary bg-blue-50"
              : "border-gray-300 hover:border-primary"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <Upload className="w-full h-full" />
          </div>
          <div className="text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80"
            >
              <span>Upload HTML file</span>
              <input
                ref={fileInputRef}
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".html"
                className="sr-only"
                onChange={handleFileChange}
                data-testid="input-file"
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">HTML files up to 10MB</p>
        </div>

        {/* Uploaded File Info */}
        {uploadedFile && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200" data-testid="file-info">
            <div className="flex items-center">
              <FileCode className="text-green-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">{uploadedFile.name}</p>
                <p className="text-xs text-green-700">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemoveFile}
                className="text-green-700 hover:text-green-900"
                data-testid="button-remove-file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!uploadedFile || isLoading || !subject.trim()}
          className="w-full"
          data-testid="button-send-email"
        >
          <Send className="mr-2 h-4 w-4" />
          {isLoading ? "Sending..." : "Send to All Recipients"}
        </Button>
      </CardContent>
    </Card>
  );
}
