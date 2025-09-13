"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const StudioUploadModal = () => {
  return (
    <Button variant="secondary">
      <Plus className="size-4" />
      Create
    </Button>
  );
};

export default StudioUploadModal;
