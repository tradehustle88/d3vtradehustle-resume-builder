"use client";

export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-between px-8 py-6 text-sm text-gray-200">
      {/* Left copyright */}
      <p>
        © {new Date().getFullYear()} Trade Hustle. Built for the trade. Backed by hustle.
      </p>

      {/* Right icons */}
      <div className="flex items-center gap-4">
        {/* Facebook */}
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
           className="hover:text-blue-500 transition-colors">
          <i className="fab fa-facebook-f text-xl"></i>
        </a>

        {/* Instagram */}
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
           className="hover:text-pink-500 transition-colors">
          <i className="fab fa-instagram text-xl"></i>
        </a>

        {/* Indeed (custom SVG) */}
        <a href="https://indeed.com" target="_blank" rel="noopener noreferrer"
           className="hover:text-blue-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 50 50" fill="currentColor">
            <path d="M25 2C12.3 2 2 12.3 2 25s10.3 23 23 23 23-10.3 23-23S37.7 2 25 2zM35 34h-5V23c0-3-1.5-5-4.5-5S21 20 21 23v11h-5V19h5v2c1-1.5 3-2.5 5.5-2.5C31 18.5 35 22 35 27v7z"/>
          </svg>
        </a>

        {/* Pinterest */}
        <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer"
           className="hover:text-red-600 transition-colors">
          <i className="fab fa-pinterest-p text-xl"></i>
        </a>

        {/* Google */}
        <a href="https://google.com" target="_blank" rel="noopener noreferrer"
           className="hover:text-green-500 transition-colors">
          <i className="fab fa-google text-xl"></i>
        </a>
      </div>
    </footer>
  );
}
