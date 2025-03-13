"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Database } from "lucide-react";

export default function MigrationExecutor() {
  const [sql, setSql] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const executeMigration = async () => {
    if (!sql.trim()) {
      setResult({
        success: false,
        message: "Please enter SQL to execute",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/execute-migration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to execute migration");
      }

      setResult({
        success: true,
        message: "Migration executed successfully",
      });
    } catch (error: any) {
      setResult({
        success: false,
        message:
          error.message || "An error occurred while executing the migration",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Migration Executor
        </CardTitle>
        <CardDescription>
          Execute SQL migrations directly against your Supabase database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="sql" className="text-sm font-medium">
              SQL Migration
            </label>
            <Textarea
              id="sql"
              placeholder="Enter your SQL migration here..."
              className="min-h-[200px] font-mono text-sm"
              value={sql}
              onChange={(e) => setSql(e.target.value)}
            />
          </div>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={executeMigration}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Executing..." : "Execute Migration"}
        </Button>
      </CardFooter>
    </Card>
  );
}
