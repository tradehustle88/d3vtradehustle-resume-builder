# 🎯 Trade Form Factory - Quick Reference

## 📦 Import Statement

```typescript
import {
  TradeFormFactory,       // Main factory component
  HVACForm,               // Direct HVAC form
  ElectricianForm,        // Direct Electrician form
  PlumberForm,            // Direct Plumber form
  CDLForm,                // Direct CDL form
  MaintenanceForm,        // Direct Maintenance form
  CustomTradeForm,        // Fallback custom form
  getTradeConfig,         // Get trade configuration
  useTradeConfig,         // React hook for trade config
  isValidTradeId,         // Validate trade ID
  TRADE_CONFIGS,          // All configurations object
} from '@/components/forms';
```

## 🚀 One-Liner Usage

```tsx
<TradeFormFactory trade="hvac" userId={user.uid} onSave={handleSave} />
```

## 🎨 Supported Trades

```typescript
'hvac'        // ❄️ HVAC Technician
'electrician' // ⚡ Electrician
'plumber'     // 🔧 Plumber
'cdl'         // 🚚 CDL Driver
'maintenance' // 🔧 Maintenance Technician
'custom'      // 🛠️ Custom Trade (fallback)
```

## 📋 Props

```typescript
interface TradeFormFactoryProps {
  trade: string;                                          // Required
  userId?: string;                                        // Optional
  onSave?: (data: Partial<ResumeFormData>) => Promise<void>;  // Optional
  initialData?: Partial<ResumeFormData>;                  // Optional
}
```

## 🛠️ Helper Functions

```typescript
// Get configuration
const config = getTradeConfig('electrician');
console.log(config.certifications);  // ['State License', ...]

// Validate trade ID
if (isValidTradeId('hvac')) {
  // Valid trade
}

// Get all trades
const allTrades = getAllTrades();  // Array of TradeConfig
```

## 🪝 React Hook

```typescript
function MyComponent({ trade }: { trade: string }) {
  const config = useTradeConfig(trade);
  
  return (
    <div>
      <h2>{config.name}</h2>
      <p>{config.defaultTitle}</p>
      <ul>
        {config.certifications.map(cert => <li key={cert}>{cert}</li>)}
      </ul>
    </div>
  );
}
```

## 🌐 Dynamic Routing

```tsx
// app/resume-builder/[trade]/page.tsx
export default function TradePage({ params }: { params: { trade: string } }) {
  const tradeId = isValidTradeId(params.trade) ? params.trade : 'custom';
  
  return <TradeFormFactory trade={tradeId} userId={user.uid} />;
}
```

**URLs:**
- `/resume-builder/hvac`
- `/resume-builder/electrician`
- `/resume-builder/plumber`

## 📊 Configuration Structure

```typescript
interface TradeConfig {
  id: string;                          // 'hvac', 'electrician', etc.
  name: string;                        // 'HVAC Technician'
  icon: string;                        // '❄️'
  defaultTitle: string;                // 'HVAC Technician'
  certifications: string[];            // ['EPA 608 Universal', ...]
  skills: {
    technical: string[];               // ['HVAC Installation', ...]
    safety: string[];                  // ['EPA Compliance', ...]
    soft: string[];                    // ['Customer Service', ...]
  };
  suggestedAchievements: string[];     // ['Reduced times by 30%', ...]
}
```

## 🎯 Real-World Example

```tsx
'use client';

import { TradeFormFactory } from '@/components/forms';
import { useAuth } from '@/lib/hooks/useAuth';
import { saveResumeProgress } from '@/lib/resume-storage';

export default function ResumeBuilderPage({ params }: { params: { trade: string } }) {
  const { user } = useAuth();

  const handleSave = async (data) => {
    await saveResumeProgress(user.uid, data);
    console.log('Saved!');
  };

  return (
    <div className="min-h-screen bg-hustle-navy">
      <TradeFormFactory
        trade={params.trade}
        userId={user?.uid}
        onSave={handleSave}
      />
    </div>
  );
}
```

## ✅ Validation Pattern

```typescript
// Validate before rendering
const trade = isValidTradeId(userInput) ? userInput : 'custom';
<TradeFormFactory trade={trade} />

// Get config with fallback
const config = getTradeConfig(trade);  // Always returns valid config
```

## 🔄 Adding a New Trade (3 Steps)

### 1. Add to `tradeConfig.ts`

```typescript
welder: {
  id: 'welder',
  name: 'Welder',
  icon: '🔥',
  defaultTitle: 'Certified Welder',
  certifications: ['AWS D1.1', 'ASME Section IX'],
  skills: { technical: [...], safety: [...], soft: [...] },
  suggestedAchievements: [...],
},
```

### 2. Create Form in `TradeFormFactory.tsx`

```typescript
export const WelderForm: React.FC<Omit<TradeFormProps, 'tradeId'>> = (props) => {
  const config = getTradeConfig('welder');
  return <HVACResumeBuilder {...props} initialData={{ tradeTitle: config.defaultTitle }} />;
};
```

### 3. Add to Registry

```typescript
export const tradeForms = {
  // ... existing
  welder: WelderForm,  // ← Add here
} as const;
```

## 📚 Documentation

- **Full Guide:** `TRADE_FORM_FACTORY_GUIDE.md` (531 lines)
- **Implementation Summary:** `TRADE_FORM_FACTORY_SUMMARY.md` (445 lines)
- **This Quick Reference:** `TRADE_FORM_FACTORY_QUICKREF.md`

## 🎉 Common Use Cases

### Use Case 1: Simple Integration
```tsx
<TradeFormFactory trade="hvac" />
```

### Use Case 2: With Auth & Save
```tsx
<TradeFormFactory 
  trade="electrician" 
  userId={user.uid} 
  onSave={saveToDb} 
/>
```

### Use Case 3: With Initial Data
```tsx
<TradeFormFactory 
  trade="plumber" 
  userId={user.uid}
  initialData={existingResume}
  onSave={saveToDb} 
/>
```

### Use Case 4: Direct Trade Form
```tsx
<ElectricianForm userId={user.uid} onSave={saveToDb} />
```

## 🔍 Type Safety

```typescript
import type { TradeFormKey, TradeConfig } from '@/components/forms';

const trade: TradeFormKey = 'hvac';        // Type-safe
const config: TradeConfig = getTradeConfig(trade);
```

## 🎨 File Structure

```
frontend/src/components/forms/
├── TradeFormFactory.tsx    # Main factory + individual forms
├── tradeConfig.ts          # Trade configurations
├── index.ts                # Exports
├── HVACResumeBuilder.tsx   # Shared base form
└── [other sections].tsx    # HeaderSection, etc.

frontend/src/app/
└── resume-builder-trade/
    └── [trade]/
        └── page.tsx        # Dynamic route example
```

---

**🚀 Ready to use! Copy-paste examples above to get started.**
