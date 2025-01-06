import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type Zone = "productivity" | "entertainment";

interface ZoneSelectorProps {
  onZoneSelect: (zone: Zone) => void;
}

export const ZoneSelector = ({ onZoneSelect }: ZoneSelectorProps) => {
  const [open, setOpen] = useState(true);

  const handleZoneSelect = (zone: Zone) => {
    setOpen(false);
    onZoneSelect(zone);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Choose Your Zone</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => handleZoneSelect("productivity")}
          >
            Productivity Zone
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => handleZoneSelect("entertainment")}
          >
            Entertainment Zone
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};