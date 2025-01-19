import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TimerProps {
  onTimerEnd: () => void;
  onTimeSet: (minutes: number) => void;
  isVisible?: boolean;
}

export const Timer = ({ onTimerEnd, onTimeSet, isVisible = true }: TimerProps) => {
  const [minutes, setMinutes] = useState<number>(25);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft === 0) {
      toast({
        title: "Time's up!",
        description: "Switching to the other zone.",
      });
      onTimerEnd();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimerEnd, toast]);

  const handleStartTimer = () => {
    if (minutes <= 0) {
      toast({
        title: "Invalid time",
        description: "Please enter a positive number of minutes.",
        variant: "destructive",
      });
      return;
    }
    setTimeLeft(minutes * 60);
    onTimeSet(minutes);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) {
    return timeLeft !== null ? (
      <div className="font-mono text-lg">
        {formatTime(timeLeft)}
      </div>
    ) : null;
  }

  return (
    <div className="flex flex-col gap-4">
      {timeLeft === null ? (
        <div className="flex gap-2">
          <Input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            placeholder="Minutes"
            min="1"
            className="w-24"
          />
          <Button onClick={handleStartTimer} className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Start Timer
          </Button>
        </div>
      ) : (
        <div className="text-center font-mono text-2xl">
          {formatTime(timeLeft)}
        </div>
      )}
    </div>
  );
};