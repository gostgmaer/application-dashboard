import { cn } from '@/lib/utils/utils';
import { CheckCircle2 } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { RegistrationStep } from '@/types';

interface StepConfig {
  id: RegistrationStep;
  label: string;
}

const steps: StepConfig[] = [
  { id: 'basicInfo', label: 'Basic Info' },
  { id: 'addressInfo', label: 'Address' },
  { id: 'securityInfo', label: 'Security' },
  { id: 'contactPreferences', label: 'Contact' },
  { id: 'demographicInfo', label: 'Demographics' },
  { id: 'professionalInfo', label: 'Professional' },
  { id: 'accountSettings', label: 'Settings' },
  { id: 'legalInfo', label: 'Legal' },
  { id: 'customInfo', label: 'Custom' },
  { id: 'review', label: 'Review' },
];

export function FormProgress() {
  const currentStep = useAppSelector((state) => state.registration.currentStep);
  
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="w-full overflow-auto py-4">
      <div className="flex items-center justify-between min-w-max px-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium",
                  index < currentStepIndex
                    ? "border-primary bg-primary text-primary-foreground"
                    : index === currentStepIndex
                    ? "border-primary bg-background text-primary"
                    : "border-muted bg-muted text-muted-foreground"
                )}
              >
                {index < currentStepIndex ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium",
                  index <= currentStepIndex ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 w-12 flex-1 min-w-10",
                  index < currentStepIndex ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}