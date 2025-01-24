import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timer } from "./Timer";
import { useToast } from "@/components/ui/use-toast";

export type Zone = "productivity" | "entertainment" | string;

interface ZoneSelectorProps {
  onZoneSelect: (zone: Zone) => void;
}

export const ZoneSelector = ({ onZoneSelect }: ZoneSelectorProps) => {
  const [open, setOpen] = useState(true);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [showTimerDialog, setShowTimerDialog] = useState(false);
  const [customZone, setCustomZone] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const { toast } = useToast();

  const handleZoneSelect = (zone: Zone) => {
    if (zone === "custom") {
      setShowCustomInput(true);
    } else {
      setSelectedZone(zone);
      setShowTimerDialog(true);
    }
  };

  const handleCustomZoneSubmit = () => {
    if (customZone.trim()) {
      setSelectedZone(customZone.trim());
      setShowTimerDialog(true);
      setShowCustomInput(false);
    }
  };

  const handleTimerEnd = () => {
    if (selectedZone) {
      const newZone = selectedZone === "productivity" ? "entertainment" : "productivity";
      setSelectedZone(newZone);
      setShowTimerDialog(true);
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
      setShowTimerDialog(false);
    }
  };

  return (
    <>
      <Dialog open={open && !selectedZone} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Choose Your Zone</DialogTitle>
            <DialogDescription className="text-center">
              Select your focus zone and set a timer for your session.
            </DialogDescription>
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
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleZoneSelect("custom")}
            >
              Custom Zone
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCustomInput} onOpenChange={setShowCustomInput}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Custom Zone</DialogTitle>
            <DialogDescription>
              Enter a name for your custom zone
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Enter zone name..."
              value={customZone}
              onChange={(e) => setCustomZone(e.target.value)}
            />
            <Button onClick={handleCustomZoneSubmit}>Create Zone</Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedZone && (
        <Timer 
          onTimerEnd={handleTimerEnd}
          onTimeSet={handleTimeSet}
          showInput={true}
          resetOnZoneSwitch={true}
          openDialog={showTimerDialog}
          onDialogClose={() => setShowTimerDialog(false)}
        />
      )}
    </>
  );
};