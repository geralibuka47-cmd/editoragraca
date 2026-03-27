import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
    targetDate: string;
    onComplete?: () => void;
    className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onComplete, className = "" }) => {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();
            let timeLeftData = null;

            if (difference > 0) {
                timeLeftData = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            } else if (onComplete) {
                onComplete();
            }

            return timeLeftData;
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate, onComplete]);

    if (!timeLeft) return null;

    const TimeUnit = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center p-3 sm:p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 min-w-[70px] sm:min-w-[90px]">
            <span className="text-2xl sm:text-4xl font-black tabular-nums">{value.toString().padStart(2, '0')}</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 mt-1">{label}</span>
        </div>
    );

    return (
        <div className={`flex items-center gap-2 sm:gap-4 ${className} text-white`}>
            <TimeUnit value={timeLeft.days} label="Dias" />
            <div className="text-2xl sm:text-4xl font-black opacity-30">:</div>
            <TimeUnit value={timeLeft.hours} label="Horas" />
            <div className="text-2xl sm:text-4xl font-black opacity-30">:</div>
            <TimeUnit value={timeLeft.minutes} label="Min" />
            <div className="text-2xl sm:text-4xl font-black opacity-30">:</div>
            <TimeUnit value={timeLeft.seconds} label="Seg" />
        </div>
    );
};

export default CountdownTimer;
