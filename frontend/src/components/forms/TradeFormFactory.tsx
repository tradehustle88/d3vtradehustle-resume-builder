"use client";

import React from 'react';
import { getTradeConfig, isValidTradeId, TRADE_CONFIGS } from './tradeConfig';
import HVACResumeBuilder from './HVACResumeBuilder';
import { BaseResumeFormData } from './schemas';

/**
 * Trade-specific form component props
 */
export interface TradeFormProps {
  userId?: string;
  onSave?: (data: Partial<BaseResumeFormData>) => Promise<void>;
  initialData?: Partial<BaseResumeFormData>;
  tradeId: string;
}

/**
 * Individual Trade Form Components
 * Each wraps HVACResumeBuilder with trade-specific defaults
 */

export const HVACForm: React.FC<Omit<TradeFormProps, 'tradeId'>> = (props) => {
  const config = getTradeConfig('hvac');
  const defaultData: Partial<BaseResumeFormData> = {
    tradeTitle: config.defaultTitle,
    certifications: [],
    skills: [],
    ...props.initialData,
  };

  return <HVACResumeBuilder {...props} initialData={defaultData} />;
};

export const ElectricianForm: React.FC<Omit<TradeFormProps, 'tradeId'>> = (props) => {
  const config = getTradeConfig('electrician');
  const defaultData: Partial<BaseResumeFormData> = {
    tradeTitle: config.defaultTitle,
    certifications: [],
    skills: [],
    ...props.initialData,
  };

  return <HVACResumeBuilder {...props} initialData={defaultData} />;
};

export const PlumberForm: React.FC<Omit<TradeFormProps, 'tradeId'>> = (props) => {
  const config = getTradeConfig('plumber');
  const defaultData: Partial<BaseResumeFormData> = {
    tradeTitle: config.defaultTitle,
    certifications: [],
    skills: [],
    ...props.initialData,
  };

  return <HVACResumeBuilder {...props} initialData={defaultData} />;
};

export const CDLForm: React.FC<Omit<TradeFormProps, 'tradeId'>> = (props) => {
  const config = getTradeConfig('cdl');
  const defaultData: Partial<BaseResumeFormData> = {
    tradeTitle: config.defaultTitle,
    certifications: [],
    skills: [],
    ...props.initialData,
  };

  return <HVACResumeBuilder {...props} initialData={defaultData} />;
};

export const MaintenanceForm: React.FC<Omit<TradeFormProps, 'tradeId'>> = (props) => {
  const config = getTradeConfig('maintenance');
  const defaultData: Partial<BaseResumeFormData> = {
    tradeTitle: config.defaultTitle,
    certifications: [],
    skills: [],
    ...props.initialData,
  };

  return <HVACResumeBuilder {...props} initialData={defaultData} />;
};

export const CustomTradeForm: React.FC<Omit<TradeFormProps, 'tradeId'>> = (props) => {
  const config = getTradeConfig('custom');
  const defaultData: Partial<BaseResumeFormData> = {
    tradeTitle: config.defaultTitle,
    certifications: [],
    skills: [],
    ...props.initialData,
  };

  return <HVACResumeBuilder {...props} initialData={defaultData} />;
};

/**
 * Trade Forms Registry
 * Maps trade IDs to their form components
 */
export const tradeForms = {
  hvac: HVACForm,
  electrician: ElectricianForm,
  plumber: PlumberForm,
  cdl: CDLForm,
  maintenance: MaintenanceForm,
  custom: CustomTradeForm,
} as const;

export type TradeFormKey = keyof typeof tradeForms;

/**
 * TradeFormFactory Component
 * Dynamically renders the appropriate trade-specific form
 * 
 * @example
 * ```tsx
 * <TradeFormFactory 
 *   trade="hvac" 
 *   userId={user.uid}
 *   onSave={handleSave}
 * />
 * ```
 */
interface TradeFormFactoryProps {
  trade: string;
  userId?: string;
  onSave?: (data: Partial<BaseResumeFormData>) => Promise<void>;
  initialData?: Partial<BaseResumeFormData>;
}

export const TradeFormFactory: React.FC<TradeFormFactoryProps> = ({
  trade,
  userId,
  onSave,
  initialData,
}) => {
  // Validate and get the form component
  const tradeKey = isValidTradeId(trade) ? trade : 'custom';
  const FormComponent = tradeForms[tradeKey as TradeFormKey] || CustomTradeForm;

  // Get trade configuration for metadata
  const config = getTradeConfig(tradeKey);

  return (
    <div className="trade-form-wrapper" data-trade={config.id}>
      {/* Optional: Trade-specific header */}
      <div className="hidden" data-trade-name={config.name} data-trade-icon={config.icon} />
      
      {/* Render the appropriate form */}
      <FormComponent
        userId={userId}
        onSave={onSave}
        initialData={initialData}
      />
    </div>
  );
};

/**
 * Trade Configuration Hook
 * Access trade-specific configurations in child components
 */
export function useTradeConfig(tradeId: string) {
  return React.useMemo(() => getTradeConfig(tradeId), [tradeId]);
}

/**
 * Export all components and utilities
 */
export { TRADE_CONFIGS, getTradeConfig, getAllTrades, isValidTradeId } from './tradeConfig';
export type { TradeConfig } from './tradeConfig';
