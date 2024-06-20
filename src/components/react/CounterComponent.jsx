import React, { useEffect, useState } from 'react';

const CounterComponent = ({ targetNumber, duration }) => {
  const [count, setCount] = useState(0);

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
      }
    };

    requestAnimationFrame(step);

    return () => cancelAnimationFrame(step);
  }, [targetNumber, duration]);

  return (
    <div className="w-full text-center">
      <h1 className="text-3xl md:text-5xl lg:text-8xl font-bold mb-4 md:mb-6 lg:mb-8 font-mono text-dark-blue">
        ${count.toLocaleString()}
      </h1>
    </div>
  );
};

export default CounterComponent;