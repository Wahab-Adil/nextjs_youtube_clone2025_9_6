"use client";

import { Suspense } from "react";
import { trpc } from "@/app/trpc/client";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";

interface FormSectionProps {
  videoId: string;
}

export const FormSection = ({ videoId }: { videoId: string }) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={"Error"}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const FormSectionSkeleton = () => <p>Loading...</p>;

export const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">Video details</h1>
        <p className="text-xs text-muted-foreground">
          Manage your video details
        </p>
      </div>
      <div className="flex items-center gap-x-2">
        <Button type="submit" disabled={false}>
          Save
        </Button>
      </div>
    </div>
  );
};
