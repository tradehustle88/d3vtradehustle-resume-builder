/**
 * Magnetic Button Effect
 * Adds smooth magnetic hover effect to buttons
 * Usage: Add 'magnetic-button' class to any button
 */

export function initMagneticButtons() {
  if (typeof window === 'undefined') return;

  const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .magnetic-button');

  magneticButtons.forEach((button) => {
    // Mouse move handler
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Calculate distance from center
      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = 50; // Maximum magnetic distance

      if (distance < maxDistance) {
        // Apply magnetic effect - move towards cursor
        const strength = 0.3; // Magnetic strength (0-1)
        button.style.transform = `translate(${x * strength}px, ${y * strength}px) translateY(-4px) scale(1.02)`;
      }
    });

    // Mouse leave handler - reset position
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0)';
    });

    // Click ripple effect
    button.addEventListener('click', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      button.appendChild(ripple);

      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Auto-initialize on DOM load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMagneticButtons);
  } else {
    initMagneticButtons();
  }
}
