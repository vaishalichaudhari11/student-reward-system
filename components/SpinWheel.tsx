import React, { useState } from 'react';
import { SpinWheelSegment, TransactionType, User } from '../types';
import { SPIN_WHEEL_SEGMENTS } from '../constants';

interface SpinWheelProps {
  user: User;
  onSpinEnd: (amount: number, type: TransactionType, description: string) => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ user, onSpinEnd }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wonAmount, setWonAmount] = useState(0);

  const segments = SPIN_WHEEL_SEGMENTS;
  const segmentCount = segments.length;
  const segmentAngle = 360 / segmentCount;

  const today = new Date().toISOString().split('T')[0];
  const canSpin = user.lastSpinDate !== today;

  const handleSpin = () => {
    if (spinning || !canSpin) return;

    setSpinning(true);
    setShowResult(false);

    const randomSegment = Math.floor(Math.random() * segmentCount);
    const winningValue = segments[randomSegment].value;

    const extraRotations = 5 * 360;
    const stopAngle = randomSegment * segmentAngle;
    const finalRotation = extraRotations + stopAngle;
    
    const rotationAdjustment = -segmentAngle / 2;
    setRotation(rotation + finalRotation + rotationAdjustment);
    
    setTimeout(() => {
      setSpinning(false);
      setWonAmount(winningValue);
      setShowResult(true);
      onSpinEnd(winningValue, TransactionType.EARN_SPIN_WHEEL, `Won ${winningValue} credits from the bonus wheel.`);
    }, 5000); // Corresponds to the transition duration
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 animate-fade-in space-y-8">
       <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Bonus Credits Wheel</h1>
      <div className="relative w-96 h-96 flex items-center justify-center">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full z-10" style={{ transform: 'translateX(-50%) translateY(-60%)' }}>
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-red-500"></div>
        </div>

        {/* Wheel */}
        <div
          className="relative w-full h-full rounded-full border-8 border-slate-700 shadow-lg"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 5s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          {segments.map((segment, index) => (
            <div
              key={index}
              className={`absolute w-1/2 h-1/2 ${segment.color} origin-bottom-right flex items-center justify-center`}
              style={{
                transform: `rotate(${index * segmentAngle}deg)`,
                clipPath: `polygon(100% 0, 0 0, 100% 100%)`,
              }}
            >
              <span
                className="font-bold text-xl text-white"
                style={{ transform: `rotate(${segmentAngle / 2}deg) translate(50px, -20px)` }}
              >
                {segment.value}
              </span>
            </div>
          ))}
           {/* Spin Button in Center */}
            <button
                onClick={handleSpin}
                disabled={spinning || !canSpin}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white text-slate-900 rounded-full font-bold text-2xl z-10 border-4 border-slate-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                style={{ transform: `translate(-50%, -50%) rotate(${-rotation}deg)`, transition: 'transform 5s cubic-bezier(0.25, 1, 0.5, 1)'}}
            >
                SPIN
            </button>
        </div>
      </div>
      {!canSpin && (
        <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-300 p-4 rounded-md text-center max-w-sm">
            <p className="font-bold">🎯 Daily Spin Used</p>
            <p className="text-sm">You have already spun today. Please come back tomorrow!</p>
        </div>
      )}
       {showResult && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-slate-800 p-8 rounded-lg text-center border border-slate-700 shadow-xl">
            <h2 className="text-3xl font-bold mb-4">
                {wonAmount > 0 ? `🎉 Congratulations! 🎉` : `Better Luck Next Time!`}
            </h2>
            <p className="text-xl mb-6">You won <span className="font-bold text-yellow-400">{wonAmount}</span> Time Credits!</p>
            <button
              onClick={() => setShowResult(false)}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;