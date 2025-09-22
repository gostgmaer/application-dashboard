// components/product/ProductVariants.tsx
'use client';

import * as ToggleGroup from '@radix-ui/react-toggle-group';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { ProductVariant } from '@/types/product';
import { useState } from 'react';

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedVariants: Record<string, string>;
  onVariantChange: (variants: Record<string, string>) => void;
}

export function ProductVariants({ 
  variants, 
  selectedVariants, 
  onVariantChange 
}: ProductVariantsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Group variants by type
  const groupedVariants = variants.reduce((acc, variant) => {
    if (!acc[variant.type]) {
      acc[variant.type] = [];
    }
    acc[variant.type].push(variant);
    return acc;
  }, {} as Record<string, ProductVariant[]>);

  const handleVariantSelection = (variantType: string, variantId: string) => {
    const variant = variants.find(v => v.id === variantId);
    
    if (variant?.stock.status === 'out_of_stock') {
      setErrors(prev => ({
        ...prev,
        [variantType]: 'This variant is currently out of stock'
      }));
      return;
    }

    // Clear error for this variant type
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[variantType];
      return newErrors;
    });

    onVariantChange({
      ...selectedVariants,
      [variantType]: variantId,
    });
  };

  const renderVariantGroup = (variantType: string, variantOptions: ProductVariant[]) => {
    const shouldUseRadioGroup = variantType === 'size' || variantType === 'storage';
    
    if (shouldUseRadioGroup) {
      return (
        <RadioGroup.Root
          value={selectedVariants[variantType] || ''}
          onValueChange={(value) => handleVariantSelection(variantType, value)}
          className="flex flex-wrap gap-2"
        >
          {variantOptions.map((variant) => {
            const isDisabled = variant.stock.status === 'out_of_stock';
            const isSelected = selectedVariants[variantType] === variant.id;
            
            return (
              <RadioGroup.Item
                key={variant.id}
                value={variant.id}
                disabled={isDisabled}
                className={`
                  px-4 py-2 border rounded-lg text-sm font-medium transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${isSelected 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <span>{variant.value}</span>
                {variant.price && (
                  <span className="ml-2 text-xs">
                    +{variant.price.currency} {variant.price.original}
                  </span>
                )}
              </RadioGroup.Item>
            );
          })}
        </RadioGroup.Root>
      );
    }

    // Use ToggleGroup for color and material variants
    return (
      <ToggleGroup.Root
        type="single"
        value={selectedVariants[variantType] || ''}
        onValueChange={(value) => value && handleVariantSelection(variantType, value)}
        className="flex flex-wrap gap-2"
      >
        {variantOptions.map((variant) => {
          const isDisabled = variant.stock.status === 'out_of_stock';
          
          return (
            <ToggleGroup.Item
              key={variant.id}
              value={variant.id}
              disabled={isDisabled}
              className={`
                px-4 py-2 border rounded-lg text-sm font-medium transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600
                data-[state=off]:bg-white data-[state=off]:text-gray-700 data-[state=off]:border-gray-300
                hover:border-gray-400
              `}
            >
              {variantType === 'color' && (
                <div
                  className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                  style={{ backgroundColor: variant.value.toLowerCase() }}
                />
              )}
              <span>{variant.name}</span>
              {variant.price && (
                <span className="ml-2 text-xs">
                  +{variant.price.currency} {variant.price.original}
                </span>
              )}
            </ToggleGroup.Item>
          );
        })}
      </ToggleGroup.Root>
    );
  };

  if (Object.keys(groupedVariants).length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedVariants).map(([variantType, variantOptions]) => (
        <div key={variantType} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-900 capitalize">
              {variantType}
              {selectedVariants[variantType] && (
                <span className="ml-2 text-gray-600 font-normal">
                  ({variantOptions.find(v => v.id === selectedVariants[variantType])?.name})
                </span>
              )}
            </label>
            {errors[variantType] && (
              <span className="text-sm text-red-600">
                {errors[variantType]}
              </span>
            )}
          </div>
          
          {renderVariantGroup(variantType, variantOptions)}
        </div>
      ))}
    </div>
  );
}