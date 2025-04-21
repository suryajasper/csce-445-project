import React from 'react';

type PositionSliderProps = {
  position: number; // Between -10 and 10
};

const interpolateColor = (position: number) => {
  const t = (position + 10) / 20;
  const r = Math.round(255 * (1 - t));
  const g = Math.round(255 * t);
  return `rgb(${r},${g},0)`;
};

const ticks = [-10, -5, 0, 5, 10];

const PositionSlider: React.FC<PositionSliderProps> = ({ position }) => {
  const clampedPos = Math.max(-10, Math.min(10, position));
  const leftPercent = ((clampedPos + 10) / 20) * 100;

  return (
    <div style={{ width: '100%', padding: '12px 0' }}>
      {/* Slider Track */}
      <div
        style={{
          position: 'relative',
          height: '8px',
          background: '#ddd',
          borderRadius: '4px',
          width: '100%',
        }}
      >
        {/* Ticks */}
        {ticks.map((tick) => (
          <div
            key={tick}
            style={{
              position: 'absolute',
              left: `${((tick + 10) / 20) * 100}%`,
              top: '0',
              width: '2px',
              height: '8px',
              backgroundColor: '#666',
              transform: 'translateX(-50%)',
            }}
          />
        ))}

        {/* Slider Dot */}
        <div
          style={{
            position: 'absolute',
            left: `${leftPercent}%`,
            top: '-4px',
            width: '16px',
            height: '16px',
            backgroundColor: interpolateColor(clampedPos),
            borderRadius: '50%',
            transform: 'translateX(-50%)',
            border: '2px solid white',
            boxShadow: '0 0 4px rgba(0,0,0,0.3)',
          }}
        />
      </div>

      {/* Tick Labels */}
      <div
        style={{
          position: 'relative',
          marginTop: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
        }}
      >
        {ticks.map((tick) => (
          <span key={tick} style={{ textAlign: 'center', width: '1px', transform: 'translateX(-50%)', position: 'absolute', left: `${((tick + 10) / 20) * 100}%` }}>
            {/* {tick} */}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PositionSlider;
