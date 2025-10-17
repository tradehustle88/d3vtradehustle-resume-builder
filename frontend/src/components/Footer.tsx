"use client";

import SocialBar from './SocialBar';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-hustleBlue/10 bg-gradient-to-b from-white to-blue-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Updated Social Media Icons */}
        <SocialBar />
        
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 text-center md:text-left">
          <div>
            <h3 className="font-heading text-lg text-yellow-400 mb-4 uppercase">Trade Hustle</h3>
            <p className="font-body text-gray-400 text-sm">
              Built for the trades. Backed by hustle. Powered by Enhanced Intelligence.
            </p>
          </div>
          
          <div>
            <h3 className="font-heading text-lg text-yellow-400 mb-4 uppercase">Quick Links</h3>
            <ul className="space-y-2 font-body text-sm">
              <li>
                <Link href="/free-pdf" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Free Resume Kit
                </Link>
              </li>
              <li>
                <Link href="/resume-builder" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  AI Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/unlock" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Unlock Resume
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading text-lg text-yellow-400 mb-4 uppercase">Connect</h3>
            <p className="font-body text-gray-400 text-sm mb-2">
              Follow us for trade tips, resume advice, and career opportunities.
            </p>
            <p className="font-body text-gray-400 text-xs">
              © {new Date().getFullYear()} NeXxGeNn Hustle. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
