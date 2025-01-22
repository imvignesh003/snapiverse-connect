import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Timer } from "./Timer";
import { useToast } from "@/components/ui/use-toast";

export type Zone = "productivity" | "entertainment";

interface ZoneSelectorProps {
  onZoneSelect: (zone: Zone) => void;
}

export const ZoneSelector = ({ onZoneSelect }: ZoneSelectorProps) => {
  const [open, setOpen] = useState(true);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const { toast } = useToast();

  const handleZoneSelect = (zone: Zone) => {
    setSelectedZone(zone);
  };

  const handleTimerEnd = () => {
    if (selectedZone) {
      const newZone = selectedZone === "productivity" ? "entertainment" : "productivity";
      setSelectedZone(newZone);
      onZoneSelect(newZone);
      toast({
        title: `Switching to ${newZone.charAt(0).toUpperCase() + newZone.slice(1)} Zone`,
        description: "Please set a new timer duration.",
      });
    }
  };

  const handleTimeSet = (minutes: number) => {
    if (selectedZone) {
      toast({
        title: `${selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1)} Zone Started`,
        description: `Timer set for ${minutes} minutes.`,
      });
      onZoneSelect(selectedZone);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Choose Your Zone</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          {!selectedZone ? (
            <>
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
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="text-center text-lg font-medium">
                Set timer for {selectedZone} zone
              </div>
              <Timer 
                onTimerEnd={handleTimerEnd} 
                onTimeSet={handleTimeSet} 
                showInput={true}
                initialMinutes={25}
              />
              <Button
                variant="outline"
                onClick={() => setSelectedZone(null)}
              >
                Back to Zone Selection
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};