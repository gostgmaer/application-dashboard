'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

interface Step {
  title: string;
  description: string;
}

interface CheckoutStepperProps {
  currentStep: number;
  steps: Step[];
}

export function CheckoutStepper({ currentStep, steps }: CheckoutStepperProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                  index < currentStep
                    ? "bg-green-500 border-green-500 text-white"
                    : index === currentStep
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-gray-200 border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                )}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    index <= currentStep
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {step.title}
                </p>
                <p
                  className={cn(
                    "text-xs transition-colors duration-300",
                    index <= currentStep
                      ? "text-gray-600 dark:text-gray-300"
                      : "text-gray-400 dark:text-gray-500"
                  )}
                >
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors duration-300",
                  index < currentStep
                    ? "bg-green-500"
                    : "bg-gray-200 dark:bg-gray-700"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}