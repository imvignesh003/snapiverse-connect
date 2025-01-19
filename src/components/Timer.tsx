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
  const [seconds, setSeconds] = useState<number>(0);
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