import React, { useState, useEffect } from 'react';

interface CountdownProps {
    targetDate: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const timeUnits = [
        { label: 'Dias', value: timeLeft.days },
        { label: 'Horas', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Seg', value: timeLeft.seconds }
    ];

    return (
        <div className="flex gap-4">
            {timeUnits.map((unit, index) => (
                <div key={index} className="flex flex-col items-center bg-white/90 backdrop-blur-sm rounded-lg p-2 md:p-3 shadow-lg border border-brand-primary/20 min-w-[60px] md:min-w-[70px]">
                    <span className="text-2xl md:text-3xl font-black text-brand-dark leading-none">
                        {unit.value.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-brand-primary tracking-wider mt-1">
                        {unit.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Countdown;
