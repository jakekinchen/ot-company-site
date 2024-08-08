import React, { useEffect, useState } from 'react';

const CounterComponent = ({ targetNumber, duration, emphasize }) => {
  const [count, setCount] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    const intervals = 5;
    const intervalDuration = duration / intervals;

    const getTargetAtInterval = (index) => {
      switch (index) {
        case 0:
          return 100; // 1st second
        case 1:
          return 100000; // 2nd second
        case 2:
          return 100000000; // 3rd second
        case 3:
          return 100000000000; // 4th second
        case 4:
          return targetNumber; // Final target
        default:
          return targetNumber;
      }
    };

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // Progress from 0 to 1 over the duration
      const intervalIndex = Math.floor(progress * intervals);
      const intervalProgress = (elapsed % intervalDuration) / intervalDuration;

      const previousTarget = intervalIndex > 0 ? getTargetAtInterval(intervalIndex - 1) : 0;
      const nextTarget = getTargetAtInterval(intervalIndex);

      const easedProgress = Math.pow(intervalProgress, 3); // Ease progress for smooth transition
      const newCount = Math.floor(previousTarget + (nextTarget - previousTarget) * easedProgress);

      setCount((prevCount) => (newCount !== prevCount ? newCount : prevCount));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(targetNumber); // Ensure the final number is set
        if (emphasize) {
          setAnimate(true); // Trigger the animation
          setTimeout(() => setAnimate(false), 500); // Remove the animation class after 500ms
        }
      }
    };

    requestAnimationFrame(step);

    return () => cancelAnimationFrame(step);
  }, [targetNumber, duration, emphasize]);

  return (
  <div className="w-full text-center">
    <h1
      className={`text-[calc(12px+3vw)] font-bold font-mono text-white transition-transform duration-500 ease-out ${animate ? 'scale-125' : ''}`}
    >
      ${count.toLocaleString()}
    </h1>
  </div>
  );
};

export default CounterComponent;