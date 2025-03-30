import React, { useEffect, useState } from 'react';
import { Icons } from '../../../components/icons';
import { getTimeRemaining } from '../../../lib/utils/dateTime';

interface ExamTimerProps {
  endTime: string;
  onTimeUp: () => void;
}

const ExamTimer: React.FC<ExamTimerProps> = ({ endTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(endTime);
      setTimeLeft(remaining);
      
      if (remaining === '00:00:00') {
        clearInterval(timer);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onTimeUp]);

  return (
    <div className="flex items-center space-x-2 text-gray-700">
      <Icons.Clock className="w-5 h-5" />
      <span className="font-medium">{timeLeft}</span>
    </div>
  );
};

export default ExamTimer;