import React, { useRef, useState } from 'react';

const Magnetic = ({ children }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        // Move the element 50% of the distance to the cursor for the magnetic effect
        setPosition({ x: middleX * 0.5, y: middleY * 0.5 });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <div
            style={{ position: 'relative' }}
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
        >
            <div
                style={{
                    transform: `translate(${x}px, ${y}px)`,
                    transition: 'transform 0.1s ease-out', // Fast response for "stickiness"
                    willChange: 'transform',
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default Magnetic;
