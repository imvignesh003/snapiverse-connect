import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TimerProps {
  onTimerEnd: () => void;
  onTimeSet: (minutes: number) => void;
  isVisible?: boolean;
  resetOnZoneSwitch?: boolean;
  showInput?: boolean;
  initialMinutes?: number;
  openDialog?: boolean;
  onDialogClose?: () => void;
}

export const Timer = ({ 
  onTimerEnd, 
  onTimeSet, 
  isVisible = true, 
  resetOnZoneSwitch = false,
  showInput = false,
  initialMinutes = 25,
  openDialog = false,
  onDialogClose
}: TimerProps) => {
  const [minutes, setMinutes] = useState<number>(initialMinutes);
  const [seconds, setSeconds] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(initialMinutes * 60);
  const { toast } = useToast();

  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast({
            title: "Time's up!",
            description: "Switching to the other zone.",
          });
          onTimerEnd();
          if (resetOnZoneSwitch) {
            setMinutes(initialMinutes);
            setSeconds(0);
            return initialMinutes * 60;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, onTimerEnd, toast, resetOnZoneSwitch, isVisible, initialMinutes]);

  useEffect(() => {
    // Start timer automatically when component mounts
    if (isVisible && !timeLeft) {
      setTimeLeft(initialMinutes * 60);
    }
  }, [isVisible, initialMinutes]);

  const handleStartTimer = () => {
    if (minutes < 0 || seconds < 0 || seconds >= 60) {
      toast({
        title: "Invalid time",
        description: "Please enter valid minutes and seconds (0-59).",
        variant: "destructive",
      });
      return;
    }

    if (minutes === 0 && seconds === 0) {
      toast({
        title: "Invalid time",
        description: "Please enter a positive duration.",
        variant: "destructive",
      });
      return;
    }

    const totalSeconds = minutes * 60 + seconds;
    setTimeLeft(totalSeconds);
    onTimeSet(minutes);
    onDialogClose?.();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <Dialog open={openDialog} onOpenChange={onDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Timer Duration</DialogTitle>
            <DialogDescription>
              Enter the duration for your current zone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 p-4">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                placeholder="Min"
                min="0"
                className="w-20"
              />
              <span>:</span>
              <Input
                type="number"
                value={seconds}
                onChange={(e) => setSeconds(Number(e.target.value))}
                placeholder="Sec"
                min="0"
                max="59"
                className="w-20"
              />
            </div>
            <Button onClick={handleStartTimer} className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Start
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="font-mono text-lg font-bold text-center">
        {formatTime(timeLeft)}
      </div>
    </>
  );
};