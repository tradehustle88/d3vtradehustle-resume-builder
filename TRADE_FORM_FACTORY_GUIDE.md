# 🏭 Trade Form Factory - Complete Guide

## Overview

The **TradeFormFactory** system provides a flexible, scalable way to render trade-specific resume builder forms. Each trade gets customized certifications, skills, and default values while sharing the same core form architecture.

---

## 🎯 Supported Trades

| Trade ID | Trade Name | Icon | Default Title |
|----------|-----------|------|---------------|
| `hvac` | HVAC Technician | ❄️ | HVAC Technician |
| `electrician` | Electrician | ⚡ | Journeyman Electrician |
| `plumber` | Plumber | 🔧 | Licensed Plumber |
| `cdl` | CDL Driver | 🚚 | Professional CDL Driver |
| `maintenance` | Maintenance Technician | 🔧 | Maintenance Technician |
| `custom` | Custom Trade | 🛠️ | Skilled Tradesperson |

---

## 📦 Core Components

### 1. **TradeFormFactory** (Main Component)
Dynamically renders the correct form based on trade ID.

```tsx
import { TradeFormFactory } from '@/components/forms';

<TradeFormFactory
  trade="electrician"
  userId={user.uid}
  onSave={handleSave}
  initialData={existingData}
/>
```

### 2. **Individual Trade Forms**
Each trade has its own form component with pre-configured defaults:

- `HVACForm`
- `ElectricianForm`
- `PlumberForm`
- `CDLForm`
- `MaintenanceForm`
- `CustomTradeForm`

### 3. **Trade Configuration (`tradeConfig.ts`)**
Centralized configuration for each trade's:
- Certifications list
- Skills (technical, safety, soft)
- Default trade title
- Suggested achievements

---

## 🚀 Usage Examples

### Example 1: Basic Usage (Page Component)

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TradeFormFactory } from '@/components/forms';
import { useAuth } from '@/lib/hooks/useAuth';
import { saveResumeProgress } from '@/lib/resume-storage';

export default function ResumeBuilderPage({ 
  params 
}: { 
  params: { trade: string } 
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSave = async (data: Partial<ResumeFormData>) => {
    if (user) {
      await saveResumeProgress(user.uid, data);
      console.log('Resume saved!', data);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return (
    <div className="min-h-screen bg-hustle-navy">
      <TradeFormFactory
        trade={params.trade}
        userId={user.uid}
        onSave={handleSave}
      />
    </div>
  );
}
```

### Example 2: Direct Trade Form Usage

```tsx
import { ElectricianForm } from '@/components/forms';

<ElectricianForm
  userId={user.uid}
  onSave={async (data) => {
    await saveToFirebase(data);
  }}
  initialData={{
    name: 'John Smith',
    email: 'john@example.com',
    tradeTitle: 'Master Electrician',
  }}
/>
```

### Example 3: Using Trade Configuration

```tsx
import { useTradeConfig, getTradeConfig } from '@/components/forms';

// In a component
function CertificationSuggestions({ tradeId }: { tradeId: string }) {
  const config = useTradeConfig(tradeId);

  return (
    <div>
      <h3>Suggested Certifications for {config.name}</h3>
      <ul>
        {config.certifications.map(cert => (
          <li key={cert}>{cert}</li>
        ))}
      </ul>
    </div>
  );
}

// Outside component
const electricianConfig = getTradeConfig('electrician');
console.log(electricianConfig.certifications);
// ['State Electrical License', 'Journeyman License', ...]
```

### Example 4: Dynamic Route with Trade Selection

```tsx
// app/resume-builder/[trade]/page.tsx
'use client';

import { TradeFormFactory, isValidTradeId } from '@/components/forms';

export default function TradePage({ params }: { params: { trade: string } }) {
  // Validate trade ID
  const tradeId = isValidTradeId(params.trade) ? params.trade : 'custom';

  return (
    <TradeFormFactory
      trade={tradeId}
      userId={currentUser?.uid}
      onSave={handleSave}
    />
  );
}
```

---

## 🔧 Trade Configuration Structure

Each trade configuration includes:

```typescript
interface TradeConfig {
  id: string;                      // Trade identifier
  name: string;                    // Display name
  icon: string;                    // Emoji icon
  certifications: string[];        // Suggested certifications
  skills: {
    technical: string[];           // Technical skills
    safety: string[];              // Safety skills
    soft: string[];                // Soft skills
  };
  defaultTitle: string;            // Default job title
  suggestedAchievements: string[]; // Pre-written achievements
}
```

### Example: HVAC Configuration

```typescript
{
  id: 'hvac',
  name: 'HVAC Technician',
  icon: '❄️',
  defaultTitle: 'HVAC Technician',
  certifications: [
    'EPA 608 Universal',
    'NATE Certification',
    'OSHA 10',
    // ...
  ],
  skills: {
    technical: [
      'HVAC Installation',
      'System Diagnostics',
      'Preventive Maintenance',
      // ...
    ],
    safety: [
      'EPA Compliance',
      'Electrical Safety',
      // ...
    ],
    soft: [
      'Customer Service',
      'Problem Solving',
      // ...
    ],
  },
  suggestedAchievements: [
    'Reduced service call times by 30%',
    'Maintained 98% customer satisfaction',
    // ...
  ],
}
```

---

## 📝 API Reference

### TradeFormFactory Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `trade` | `string` | ✅ | Trade identifier (hvac, electrician, etc.) |
| `userId` | `string` | ❌ | Firebase user ID for auto-save |
| `onSave` | `(data: Partial<ResumeFormData>) => Promise<void>` | ❌ | Callback when form is saved |
| `initialData` | `Partial<ResumeFormData>` | ❌ | Pre-fill form with existing data |

### Helper Functions

#### `getTradeConfig(tradeId: string): TradeConfig`
Get configuration for a specific trade.

```typescript
const config = getTradeConfig('electrician');
console.log(config.name); // "Electrician"
```

#### `getAllTrades(): TradeConfig[]`
Get all available trade configurations.

```typescript
const allTrades = getAllTrades();
allTrades.forEach(trade => {
  console.log(trade.name);
});
```

#### `isValidTradeId(tradeId: string): boolean`
Check if a trade ID is valid.

```typescript
if (isValidTradeId('hvac')) {
  // Valid trade
}
```

#### `useTradeConfig(tradeId: string): TradeConfig`
React hook to get trade configuration (memoized).

```typescript
function MyComponent({ trade }: { trade: string }) {
  const config = useTradeConfig(trade);
  return <div>{config.name}</div>;
}
```

---

## 🎨 Customization

### Adding a New Trade

1. **Add configuration** to `tradeConfig.ts`:

```typescript
export const TRADE_CONFIGS: Record<string, TradeConfig> = {
  // ... existing trades
  
  welder: {
    id: 'welder',
    name: 'Welder',
    icon: '🔥',
    defaultTitle: 'Certified Welder',
    certifications: [
      'AWS D1.1 Structural',
      'AWS D1.6 Structural Stainless',
      'ASME Section IX',
      // ...
    ],
    skills: {
      technical: ['MIG Welding', 'TIG Welding', 'Stick Welding'],
      safety: ['Arc Flash Safety', 'Hot Work Permit'],
      soft: ['Attention to Detail', 'Blueprint Reading'],
    },
    suggestedAchievements: [
      'Completed 100+ pipe welds with 99% x-ray pass rate',
    ],
  },
};
```

2. **Create form component** in `TradeFormFactory.tsx`:

```typescript
export const WelderForm: React.FC<Omit<TradeFormProps, 'tradeId'>> = (props) => {
  const config = getTradeConfig('welder');
  const defaultData: Partial<ResumeFormData> = {
    tradeTitle: config.defaultTitle,
    ...props.initialData,
  };

  return <HVACResumeBuilder {...props} initialData={defaultData} />;
};
```

3. **Add to registry**:

```typescript
export const tradeForms = {
  hvac: HVACForm,
  electrician: ElectricianForm,
  plumber: PlumberForm,
  cdl: CDLForm,
  maintenance: MaintenanceForm,
  welder: WelderForm, // ← Add new trade
  custom: CustomTradeForm,
} as const;
```

---

## 🔗 Integration with Existing Features

### With AI Generation

The form automatically uses trade-specific contexts for AI generation:

```typescript
// In CertificationsSection.tsx
const config = useTradeConfig(tradeId);
const suggestions = config.certifications; // Trade-specific certs

// In SummarySection.tsx
const prompt = `Generate summary for ${config.name} with certifications...`;
```

### With Auto-Save

```typescript
<TradeFormFactory
  trade="hvac"
  userId={user.uid}
  onSave={async (data) => {
    await saveResumeProgress(user.uid, data);
    toast.success('Progress saved!');
  }}
/>
```

### With Export

```typescript
const handleExport = async (format: 'pdf' | 'docx') => {
  const response = await fetch('/api/exportResume', {
    method: 'POST',
    body: JSON.stringify({ 
      format, 
      resumeData,
      trade: 'electrician', // Include trade for custom formatting
    }),
  });
};
```

---

## 🎯 Best Practices

### 1. Always Validate Trade IDs

```typescript
// ❌ Bad
<TradeFormFactory trade={userInput} />

// ✅ Good
const tradeId = isValidTradeId(userInput) ? userInput : 'custom';
<TradeFormFactory trade={tradeId} />
```

### 2. Provide Initial Data When Available

```typescript
// Load saved progress
const savedData = await loadResumeProgress(user.uid);

<TradeFormFactory
  trade="hvac"
  userId={user.uid}
  initialData={savedData}
/>
```

### 3. Handle Save Errors

```typescript
const handleSave = async (data: Partial<ResumeFormData>) => {
  try {
    await saveResumeProgress(user.uid, data);
    toast.success('Saved!');
  } catch (error) {
    console.error('Save failed:', error);
    toast.error('Failed to save. Please try again.');
  }
};
```

### 4. Use TypeScript for Type Safety

```typescript
import type { TradeFormKey, TradeConfig } from '@/components/forms';

const activeTrade: TradeFormKey = 'hvac'; // Type-safe
const config: TradeConfig = getTradeConfig(activeTrade);
```

---

## 🧪 Testing

### Unit Test Example

```typescript
import { getTradeConfig, isValidTradeId } from '@/components/forms';

describe('TradeFormFactory', () => {
  test('should return correct config for valid trade', () => {
    const config = getTradeConfig('electrician');
    expect(config.name).toBe('Electrician');
    expect(config.certifications).toContain('State Electrical License');
  });

  test('should validate trade IDs', () => {
    expect(isValidTradeId('hvac')).toBe(true);
    expect(isValidTradeId('invalid')).toBe(false);
  });

  test('should fallback to custom for invalid trades', () => {
    const config = getTradeConfig('invalid-trade');
    expect(config.id).toBe('custom');
  });
});
```

---

## 📊 Performance Considerations

1. **Trade configs are static** - No API calls needed
2. **Memoized hook** - `useTradeConfig` prevents unnecessary re-renders
3. **Code splitting** - Each form component can be lazy-loaded
4. **Shared base** - All trades use the same `HVACResumeBuilder` core

---

## 🎓 Next Steps

1. **Install dependencies**: `npm install` (already includes react-hook-form, zod, framer-motion)
2. **Test the factory**: Navigate to `/resume-builder/hvac` or `/resume-builder/electrician`
3. **Add more trades**: Follow the "Adding a New Trade" guide above
4. **Customize AI prompts**: Update `ai-prompts.ts` for trade-specific generation
5. **Style trade-specific UI**: Add conditional styling based on `config.id`

---

## 🆘 Troubleshooting

### Issue: "Cannot find module '@/components/forms'"
**Solution**: Check `tsconfig.json` has path alias:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: TypeScript error on onSave callback
**Solution**: Use `Partial<ResumeFormData>`, not `ResumeFormData`:
```typescript
onSave={async (data: Partial<ResumeFormData>) => {
  // ...
}}
```

### Issue: Form not saving trade-specific data
**Solution**: Ensure `initialData` is passed with trade defaults:
```typescript
const config = getTradeConfig('hvac');
<TradeFormFactory
  trade="hvac"
  initialData={{ tradeTitle: config.defaultTitle }}
/>
```

---

## 📚 Related Documentation

- [HVAC Form System README](./HVAC_FORM_SYSTEM_README.md)
- [Migration Guide](./MIGRATION_GUIDE_CHAKRA_TO_HUSTLE.md)
- [Final Implementation](./FINAL_IMPLEMENTATION_COMPLETE.md)

---

**Built with ❤️ for Trade Hustle Resume Builder**
