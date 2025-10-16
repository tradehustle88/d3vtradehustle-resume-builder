import { TradeFormFactory } from '@/components/forms';
import { BaseResumeFormData } from '@/components/forms/schemas';
import TradeResumeBuilderClient from './TradeResumeBuilderClient';

/**
 * Generate static params for all supported trades
 * Required for static export (output: 'export')
 */
export function generateStaticParams() {
  return [
    { trade: 'hvac' },
    { trade: 'electrician' },
    { trade: 'plumber' },
    { trade: 'cdl' },
    { trade: 'maintenance' },
    { trade: 'custom' },
  ];
}

/**
 * Dynamic Resume Builder Page with Trade-Specific Forms (Server Component)
 */
export default function TradeResumeBuilderPage({
  params,
}: {
  params: { trade: string };
}) {
  return <TradeResumeBuilderClient trade={params.trade} />;
}
