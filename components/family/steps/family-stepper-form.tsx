"use client";

import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperTitle,
  StepperTrigger,
} from "@/components/reui/stepper";
import { Card, CardContent } from "@/components/ui/card";
import { familyFormSchema } from "@/lib/validator/family";
import { useState } from "react";
import { StepConfirmation } from "./step-confirmation";
import { StepHouseholdHead } from "./step-household-head";
import { StepMembersForm } from "./step-members-form";
import { StepResidenceForm } from "./step-residence-form";

const STEPS = [
  { label: "Ubicación", subtitle: "Localización y Vivienda" },
  { label: "Jefatura", subtitle: "Datos del Jefe de Hogar" },
  { label: "Composición", subtitle: "El Núcleo Familiar" },
  { label: "Validación", subtitle: "Confirmación y Envío" },
];

export function FamilyStepperForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<familyFormSchema>({
    residence: {
      number: 0,
      sectorId: "",
      housingStatus: "owned",
    },
    headOfFamily: {
      resident: {
        firstName: "",
        lastName: "",
        cedula: "",
        dateOfBirth: new Date(),
        gender: "male",
        educationLevel: "none",
        civilStatus: "single",
        isWorking: false,
        occupation: "",
        serialCarnet: "",
        codeCarnet: "",
        email: "",
        phone: "",
        hasDisability: false,
        isPregnant: false,
        isStudying: false,
      },
      relationship: "headOfFamily",
      isHeadOfFamily: true,
    },
    members: [],
  });

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="w-full flex flex-col gap-8 md:gap-16 relative">
      <Stepper
        value={currentStep}
        onValueChange={setCurrentStep}
        className="w-full"
      >
        <StepperNav className="gap-5">
          {STEPS.map((step, index) => (
            <StepperItem
              key={index}
              step={index + 1}
              className="relative flex-1 items-start"
            >
              <StepperTrigger
                className="flex grow flex-col items-start justify-center gap-3.5"
                asChild
              >
                <StepperIndicator className="bg-border data-[state=active]:bg-primary data-[state=completed]:bg-primary h-1 w-full rounded-full">
                  <span className="sr-only">{index + 1}</span>
                </StepperIndicator>
                <div className="text-muted-foreground text-[10px] font-semibold uppercase">
                  Paso {index + 1}
                </div>

                <div>
                  <StepperTitle className="group-data-[state=inactive]/step:text-muted-foreground text-start font-semibold">
                    {step.label}
                  </StepperTitle>
                  <StepperDescription>{step.subtitle}</StepperDescription>
                </div>
              </StepperTrigger>
            </StepperItem>
          ))}
        </StepperNav>
      </Stepper>

      <Card>
        <CardContent>
          <div>
            {currentStep === 1 && (
              <StepResidenceForm
                initialData={formData.residence}
                onNext={(values) => {
                  setFormData({ ...formData, residence: values });
                  handleNext();
                }}
              />
            )}
            {currentStep === 2 && (
              <StepHouseholdHead
                initialData={formData.headOfFamily}
                onNext={(values) => {
                  setFormData({ ...formData, headOfFamily: values });
                  handleNext();
                }}
                onPrevious={handlePrev}
              />
            )}
            {currentStep === 3 && (
              <StepMembersForm
                initialData={formData.members}
                onNext={(values) => {
                  setFormData({ ...formData, members: values });
                  handleNext();
                }}
                onSubmit={(values) => {
                  setFormData({ ...formData, members: values });
                }}
                onPrevious={handlePrev}
              />
            )}
            {currentStep === 4 && (
              <StepConfirmation
                onNext={() => setCurrentStep(1)}
                onPrevious={handlePrev}
                formValues={formData}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
