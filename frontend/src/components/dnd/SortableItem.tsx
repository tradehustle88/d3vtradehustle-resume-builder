"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable sortable item component
 * Wraps any content with drag-and-drop functionality
 */
export default function SortableItem({ id, children, className = "" }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-item ${className} ${isDragging ? "dragging" : ""}`}
      {...attributes}
    >
      {/* Drag Handle */}
      <div
        className="drag-handle"
        {...listeners}
        title="Drag to reorder"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 2C7 0.895431 6.10457 0 5 0C3.89543 0 3 0.895431 3 2C3 3.10457 3.89543 4 5 4C6.10457 4 7 3.10457 7 2Z"
            fill="currentColor"
          />
          <path
            d="M7 10C7 8.89543 6.10457 8 5 8C3.89543 8 3 8.89543 3 10C3 11.1046 3.89543 12 5 12C6.10457 12 7 11.1046 7 10Z"
            fill="currentColor"
          />
          <path
            d="M5 16C6.10457 16 7 16.8954 7 18C7 19.1046 6.10457 20 5 20C3.89543 20 3 19.1046 3 18C3 16.8954 3.89543 16 5 16Z"
            fill="currentColor"
          />
          <path
            d="M17 2C17 0.895431 16.1046 0 15 0C13.8954 0 13 0.895431 13 2C13 3.10457 13.8954 4 15 4C16.1046 4 17 3.10457 17 2Z"
            fill="currentColor"
          />
          <path
            d="M15 8C16.1046 8 17 8.89543 17 10C17 11.1046 16.1046 12 15 12C13.8954 12 13 11.1046 13 10C13 8.89543 13.8954 8 15 8Z"
            fill="currentColor"
          />
          <path
            d="M17 18C17 16.8954 16.1046 16 15 16C13.8954 16 13 16.8954 13 18C13 19.1046 13.8954 20 15 20C16.1046 20 17 19.1046 17 18Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="sortable-item-content">
        {children}
      </div>
    </div>
  );
}
