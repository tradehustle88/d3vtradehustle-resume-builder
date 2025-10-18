"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { ResumeFormData } from './schema';

export const HeaderSection: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ResumeFormData>();

  return (
    <div
className="space-y-6"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-anton text-hustle-gold mb-2">
          YOUR CONTACT INFO
        </h2>
        <p className="text-white/70 font-merriweather">
          Let's start with the basics. Make sure employers can reach you.
        </p>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="name" className="flex items-center gap-2 text-hustle-gold font-merriweather mb-2">
          <User className="w-4 h-4" />
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full px-4 py-3 bg-hustle-navy-dark border-2 border-hustle-gold/30 rounded-lg text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
          placeholder="John Smith"
          aria-label="Full Name"
          aria-required="true"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p
className="text-red-500 text-sm mt-1 font-merriweather"
          >
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="flex items-center gap-2 text-hustle-gold font-merriweather mb-2">
          <Mail className="w-4 h-4" />
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full px-4 py-3 bg-hustle-navy-dark border-2 border-hustle-gold/30 rounded-lg text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
          placeholder="john.smith@email.com"
          aria-label="Email Address"
          aria-required="true"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p
className="text-red-500 text-sm mt-1 font-merriweather"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="flex items-center gap-2 text-hustle-gold font-merriweather mb-2">
          <Phone className="w-4 h-4" />
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className="w-full px-4 py-3 bg-hustle-navy-dark border-2 border-hustle-gold/30 rounded-lg text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
          placeholder="(555) 123-4567"
          aria-label="Phone Number"
          aria-required="true"
          aria-invalid={!!errors.phone}
        />
        {errors.phone && (
          <p
className="text-red-500 text-sm mt-1 font-merriweather"
          >
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="flex items-center gap-2 text-hustle-gold font-merriweather mb-2">
          <MapPin className="w-4 h-4" />
          Location <span className="text-red-500">*</span>
        </label>
        <input
          id="location"
          type="text"
          {...register('location')}
          className="w-full px-4 py-3 bg-hustle-navy-dark border-2 border-hustle-gold/30 rounded-lg text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
          placeholder="Phoenix, AZ"
          aria-label="Location"
          aria-required="true"
          aria-invalid={!!errors.location}
        />
        {errors.location && (
          <p
className="text-red-500 text-sm mt-1 font-merriweather"
          >
            {errors.location.message}
          </p>
        )}
      </div>

      {/* Trade Title */}
      <div>
        <label htmlFor="tradeTitle" className="flex items-center gap-2 text-hustle-gold font-merriweather mb-2">
          <Briefcase className="w-4 h-4" />
          Trade Title
        </label>
        <input
          id="tradeTitle"
          type="text"
          {...register('tradeTitle')}
          className="w-full px-4 py-3 bg-hustle-navy-dark border-2 border-hustle-gold/30 rounded-lg text-white font-merriweather focus:border-hustle-gold focus:ring-2 focus:ring-hustle-gold/20 transition-all"
          placeholder="HVAC Technician"
          aria-label="Trade Title"
        />
        <p className="text-white/50 text-sm mt-1 font-merriweather">
          Your primary job title or trade specialty
        </p>
      </div>
    </div>
  );
};
