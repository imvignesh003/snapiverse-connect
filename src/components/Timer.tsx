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
} from "@/components/ui/dialog";

interface TimerProps {
  onTimerEnd: () => void;
  onTimeSet: (minutes: number) => void;
  isVisible?: boolean;
  resetOnZoneSwitch?: boolean;
  showInput?: boolean;
  initialMinutes?: number;
}

export const Timer = ({ 
  onTimerEnd, 
  onTimeSet, 
  isVisible = true, 
  resetOnZoneSwitch = false,
  showInput = false,
  initialMinutes
}: TimerProps) => {
  const [minutes, setMinutes] = useState<number>(initialMinutes || 25);
  const [seconds, setSeconds] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  // Start timer automatically if initialMinutes is provided
  useEffect(() => {
    if (initialMinutes && timeLeft === null) {
      const totalSeconds = initialMinutes * 60;
      setTimeLeft(totalSeconds);
      onTimeSet(initialMinutes);
    }
  }, [initialMinutes, timeLeft, onTimeSet]);

  useEffect(() => {
    if (resetOnZoneSwitch && timeLeft === 0) {
      setTimeLeft(null);
      setMinutes(25);
      setSeconds(0);
      setShowDialog(true);
    }
  }, [resetOnZoneSwitch, timeLeft]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timeLeft !== null) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null) return null;
          if (prev <= 0) {
            clearInterval(timer);
            toast({
              title: "Time's up!",
              description: "Switching to the other zone.",
            });
            onTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, onTimerEnd, toast]);

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
    setShowDialog(false);
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
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Timer Duration</DialogTitle>
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
      
      {timeLeft === null ? (
        <Button onClick={() => setShowDialog(true)} size="sm">
          Set Timer
        </Button>
      ) : (
        <div className="font-mono text-lg font-bold text-center">
          {formatTime(timeLeft)}
        </div>
      )}
    </>
  );
};