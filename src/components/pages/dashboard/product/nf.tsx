
"use client";

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, X, Upload, Image as ImageIcon, Save, Eye } from 'lucide-react';

// Zod schema for ProductVariant
const ProductVariantSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().min(1, "Variant SKU is required"),
  price: z.number().min(0, "Price must be non-negative"),
  comparePrice: z.number().min(0, "Compare price must be non-negative"),
  inventory: z.number().int().min(0, "Inventory must be a non-negative integer"),
  barcode: z.string().optional(),
  trackQuantity: z.boolean(),
  allowBackorder: z.boolean(),
  attributes: z.object({
    size: z.string().optional(),
    color: z.string().optional(),
    material: z.string().optional(),
  }),
});

// Zod schema for ProductData
const ProductDataSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  vendor: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  warranty: z.string().optional(),
  origin: z.string().optional(),
  material: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  ageGroup: z.string().optional(),
  gender: z.string().optional(),
  season: z.string().optional(),
  occasion: z.string().optional(),
  style: z.string().optional(),
  pattern: z.string().optional(),
  careInstructions: z.string().optional(),
  ingredients: z.string().optional(),
  nutritionalInfo: z.string().optional(),
  allergens: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  awards: z.array(z.string()).optional(),
  reviews: z.object({
    averageRating: z.number().min(0).max(5).optional(),
    totalReviews: z.number().int().min(0).optional(),
  }),
  socialMedia: z.object({
    hashtags: z.array(z.string()).optional(),
    instagramHandle: z.string().optional(),
    twitterHandle: z.string().optional(),
  }),
  analytics: z.object({
    views: z.number().int().min(0).optional(),
    clicks: z.number().int().min(0).optional(),
    conversions: z.number().int().min(0).optional(),
  }),
  tags: z.array(z.string()).optional(),
  basePrice: z.number().min(0, "Base price must be non-negative"),
  comparePrice: z.number().min(0, "Compare price must be non-negative"),
  costPrice: z.number().min(0, "Cost price must be non-negative"),
  profitMargin: z.number().min(0).optional(),
  wholesalePrice: z.number().min(0).optional(),
  msrp: z.number().min(0).optional(),
  taxClass: z.string().optional(),
  taxRate: z.number().min(0).optional(),
  discountType: z.enum(['none', 'percentage', 'fixed']),
  discountValue: z.number().min(0).optional(),
  discountStartDate: z.string().optional(),
  discountEndDate: z.string().optional(),
  loyaltyPoints: z.number().int().min(0).optional(),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  inventory: z.number().int().min(0).optional(),
  trackQuantity: z.boolean(),
  allowBackorder: z.boolean(),
  lowStockThreshold: z.number().int().min(0).optional(),
  maxOrderQuantity: z.number().int().min(1).optional(),
  minOrderQuantity: z.number().int().min(1).optional(),
  stockLocation: z.string().optional(),
  supplier: z.string().optional(),
  supplierSku: z.string().optional(),
  leadTime: z.number().int().min(0).optional(),
  restockDate: z.string().optional(),
  weight: z.number().min(0).optional(),
  dimensions: z.object({
    length: z.number().min(0).optional(),
    width: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
  }),
  packageDimensions: z.object({
    length: z.number().min(0).optional(),
    width: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
    weight: z.number().min(0).optional(),
  }),
  shipping: z.object({
    requiresShipping: z.boolean(),
    shippingClass: z.string().optional(),
    handlingTime: z.number().int().min(0).optional(),
    freeShippingThreshold: z.number().min(0).optional(),
    shippingRestrictions: z.array(z.string()).optional(),
    hazardousMaterial: z.boolean(),
    fragile: z.boolean(),
  }),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    slug: z.string().optional(),
    canonicalUrl: z.string().optional(),
    robotsMeta: z.string().optional(),
    structuredData: z.string().optional(),
  }),
  visibility: z.enum(['public', 'private', 'password']),
  password: z.string().optional(),
  publishDate: z.string().optional(),
  expiryDate: z.string().optional(),
  status: z.enum(['draft', 'published']),
  featured: z.boolean(),
  trending: z.boolean(),
  newArrival: z.boolean(),
  bestseller: z.boolean(),
  onSale: z.boolean(),
  limitedEdition: z.boolean(),
  preOrder: z.boolean(),
  backorder: z.boolean(),
  discontinued: z.boolean(),
  crossSells: z.array(z.string()).optional(),
  upSells: z.array(z.string()).optional(),
  relatedProducts: z.array(z.string()).optional(),
  bundles: z.array(z.string()).optional(),
  accessories: z.array(z.string()).optional(),
  replacementParts: z.array(z.string()).optional(),
  customFields: z.record(z.string()).optional(),
  variants: z.array(ProductVariantSchema).optional(),
  downloadableFiles: z.array(z.object({
    name: z.string().optional(),
    url: z.string().optional(),
    fileSize: z.string().optional(),
  })).optional(),
  videoUrls: z.array(z.string()).optional(),
  threeDModelUrl: z.string().optional(),
  virtualTryOnEnabled: z.boolean(),
  augmentedRealityEnabled: z.boolean(),
});

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  comparePrice: number;
  inventory: number;
  barcode: string;
  trackQuantity: boolean;
  allowBackorder: boolean;
  attributes: {
    size?: string;
    color?: string;
    material?: string;
  };
}

interface ProductData {
  name: string;
  description: string;
  shortDescription: string;
  category: string;
   images: string;
  subcategory: string;
  brand: string;
  vendor: string;
  manufacturer: string;
  model: string;
  warranty: string;
  origin: string;
  material: string;
  color: string;
  size: string;
  ageGroup: string;
  gender: string;
  season: string;
  occasion: string;
  style: string;
  pattern: string;
  careInstructions: string;
  ingredients: string;
  nutritionalInfo: string;
  allergens: string;
  certifications: string[];
  awards: string[];
  reviews: {
    averageRating: number;
    totalReviews: number;
  };
  socialMedia: {
    hashtags: string[];
    instagramHandle: string;
    twitterHandle: string;
  };
  analytics: {
    views: number;
    clicks: number;
    conversions: number;
  };
  tags: string[];
  basePrice: number;
  comparePrice: number;
  costPrice: number;
  profitMargin: number;
  wholesalePrice: number;
  msrp: number;
  taxClass: string;
  taxRate: number;
  discountType: 'none' | 'percentage' | 'fixed';
  discountValue: number;
  discountStartDate: string;
  discountEndDate: string;
  loyaltyPoints: number;
  sku: string;
  barcode: string;
  inventory: number;
  trackQuantity: boolean;
  allowBackorder: boolean;
  lowStockThreshold: number;
  maxOrderQuantity: number;
  minOrderQuantity: number;
  stockLocation: string;
  supplier: string;
  supplierSku: string;
  leadTime: number;
  restockDate: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  packageDimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  shipping: {
    requiresShipping: boolean;
    shippingClass: string;
    handlingTime: number;
    freeShippingThreshold: number;
    shippingRestrictions: string[];
    hazardousMaterial: boolean;
    fragile: boolean;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    slug: string;
    canonicalUrl: string;
    robotsMeta: string;
    structuredData: string;
  };
  visibility: 'public' | 'private' | 'password';
  password: string;
  publishDate: string;
  expiryDate: string;
  status: 'draft' | 'published';
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  bestseller: boolean;
  onSale: boolean;
  limitedEdition: boolean;
  preOrder: boolean;
  backorder: boolean;
  discontinued: boolean;
  crossSells: string[];
  upSells: string[];
  relatedProducts: string[];
  bundles: string[];
  accessories: string[];
  replacementParts: string[];
  customFields: { [key: string]: string };
  variants: ProductVariant[];
  downloadableFiles: {
    name: string;
    url: string;
    fileSize: string;
  }[];
  videoUrls: string[];
  threeDModelUrl: string;
  virtualTryOnEnabled: boolean;
  augmentedRealityEnabled: boolean;
}

const categories = {
  'Electronics': ['Smartphones', 'Laptops', 'Tablets', 'Accessories', 'Gaming'],
  'Clothing': ['Men', 'Women', 'Kids', 'Shoes', 'Accessories'],
  'Books': ['Fiction', 'Non-Fiction', 'Educational', 'Comics', 'Magazines'],
  'Home & Garden': ['Furniture', 'Decor', 'Kitchen', 'Garden', 'Tools'],
  'Sports': ['Fitness', 'Outdoor', 'Team Sports', 'Water Sports', 'Winter Sports'],
  'Beauty': ['Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Tools'],
  'Toys': ['Educational', 'Action Figures', 'Dolls', 'Games', 'Outdoor']
};
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'];
const materials = ['Cotton', 'Polyester', 'Leather', 'Wool', 'Silk', 'Denim'];
const shippingClasses = ['Standard', 'Express', 'Overnight', 'Free Shipping', 'Heavy Items'];
const ageGroups = ['Baby', 'Toddler', 'Kids', 'Teen', 'Adult', 'Senior'];
const genders = ['Unisex', 'Male', 'Female', 'Boys', 'Girls'];
const seasons = ['Spring', 'Summer', 'Fall', 'Winter', 'All Season'];
const occasions = ['Casual', 'Formal', 'Business', 'Party', 'Wedding', 'Sports', 'Travel'];
const styles = ['Classic', 'Modern', 'Vintage', 'Bohemian', 'Minimalist', 'Trendy'];
const patterns = ['Solid', 'Striped', 'Polka Dot', 'Floral', 'Geometric', 'Abstract'];
const taxClasses = ['Standard', 'Reduced', 'Zero Rate', 'Exempt'];
const discountTypes = ['none', 'percentage', 'fixed'] as const;
const robotsOptions = ['index,follow', 'noindex,nofollow', 'index,nofollow', 'noindex,follow'];

export default function ProductCreate({ data }: { data?: ProductData }) {
  console.log('Received data:', data);

  const isUpdateMode = !!data;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<ProductData>({
    resolver: zodResolver(ProductDataSchema),
    defaultValues: data || {
      name: '',
      description: '',
      shortDescription: '',
      category: '',
      subcategory: '',
      brand: '',
      vendor: '',
      manufacturer: '',
      model: '',
      warranty: '',
      origin: '',
      material: '',
      color: '',
      size: '',
      ageGroup: '',
      gender: '',
      season: '',
      occasion: '',
      style: '',
      pattern: '',
      careInstructions: '',
      ingredients: '',
      nutritionalInfo: '',
      allergens: '',
      certifications: [],
      awards: [],
      reviews: { averageRating: 0, totalReviews: 0 },
      socialMedia: { hashtags: [], instagramHandle: '', twitterHandle: '' },
      analytics: { views: 0, clicks: 0, conversions: 0 },
      tags: [],
      basePrice: 0,
      comparePrice: 0,
      costPrice: 0,
      profitMargin: 0,
      wholesalePrice: 0,
      msrp: 0,
      taxClass: 'Standard',
      taxRate: 0,
      discountType: 'none',
      discountValue: 0,
      discountStartDate: '',
      discountEndDate: '',
      loyaltyPoints: 0,
      sku: '',
      barcode: '',
      inventory: 0,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 5,
      maxOrderQuantity: 999,
      minOrderQuantity: 1,
      stockLocation: '',
      supplier: '',
      supplierSku: '',
      leadTime: 0,
      restockDate: '',
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      packageDimensions: { length: 0, width: 0, height: 0, weight: 0 },
      shipping: {
        requiresShipping: true,
        shippingClass: 'Standard',
        handlingTime: 1,
        freeShippingThreshold: 0,
        shippingRestrictions: [],
        hazardousMaterial: false,
        fragile: false,
      },
      seo: {
        title: '',
        description: '',
        keywords: '',
        slug: '',
        canonicalUrl: '',
        robotsMeta: 'index,follow',
        structuredData: '',
      },
      visibility: 'public',
      password: '',
      publishDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      status: 'draft',
      featured: false,
      trending: false,
      newArrival: false,
      bestseller: false,
      onSale: false,
      limitedEdition: false,
      preOrder: false,
      backorder: false,
      discontinued: false,
      crossSells: [],
      upSells: [],
      relatedProducts: [],
      bundles: [],
      accessories: [],
      replacementParts: [],
      customFields: {},
      variants: [],
      downloadableFiles: [],
      videoUrls: [],
      threeDModelUrl: '',
      virtualTryOnEnabled: false,
      augmentedRealityEnabled: false,
    },
  });

  const { fields: variants, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants',
  });

  const { fields: tags, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: 'tags',
  });

  const [newTag, setNewTag] = useState('');
  const [images, setImages] = useState<string[]>(data?.images || []);

  // Initialize form with existing data for update mode
  useEffect(() => {
    if (isUpdateMode && data) {
      reset(data); // Populate form with existing data
      setImages(data.images || []);
    }
  }, [data, reset, isUpdateMode]);

  // Watch basePrice and costPrice for profit margin calculation
  const basePrice = watch('basePrice');
  const costPrice = watch('costPrice');

  useEffect(() => {
    if (costPrice > 0 && basePrice > 0) {
      const margin = ((basePrice - costPrice) / basePrice) * 100;
      setValue('profitMargin', Math.round(margin * 100) / 100);
    }
  }, [basePrice, costPrice, setValue]);

  const addVariant = () => {
    const productName = getValues('name');
    const productSku = getValues('sku');
    appendVariant({
      id: Date.now().toString(),
      name: `${productName || 'Product'} - Variant ${variants.length + 1}`,
      sku: `${productSku || 'SKU'}-${variants.length + 1}`,
      price: getValues('basePrice') || 0,
      comparePrice: getValues('comparePrice') || 0,
      inventory: 0,
      barcode: '',
      trackQuantity: true,
      allowBackorder: false,
      attributes: {},
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.some(tag => tag === newTag.trim())) {
      appendTag(newTag.trim());
      setNewTag('');
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const onSubmit = (status: 'draft' | 'published') => (formData: ProductData) => {
    const updatedProduct = {
      ...formData,
      status,
      seo: {
        ...formData.seo,
        slug: formData.seo.slug || generateSlug(formData.name),
      },
      images,
      createdAt: isUpdateMode ? data?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(updatedProduct, null, 2);

    if (isUpdateMode) {
      console.log(`Updating product with ID: ${data?.id || 'unknown'}`, jsonString);
      // Example: Send to API for update
      // fetch(`/api/products/${data.id}`, {
      //   method: 'PUT',
      //   body: jsonString,
      //   headers: { 'Content-Type': 'application/json' },
      // });
    } else {
      console.log('Creating new product:', jsonString);
      // Example: Send to API for create
      // fetch('/api/products', {
      //   method: 'POST',
      //   body: jsonString,
      //   headers: { 'Content-Type': 'application/json' },
      // });
    }

    // For demonstration, show JSON output
    setJsonOutput(jsonString);
    setShowJsonOutput(true);
  };

  const [showJsonOutput, setShowJsonOutput] = useState(false);
  const [jsonOutput, setJsonOutput] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-semibold">Validation Errors:</h3>
          <ul className="list-disc pl-5">
            {Object.entries(errors).map(([key, error], index) => (
              <li key={index}>{`${key}: ${error?.message || JSON.stringify(error)}`}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Product Name *
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  className="mt-1"
                  placeholder="Enter product name"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand" className="text-sm font-medium text-gray-700">
                    Brand
                  </Label>
                  <Input
                    id="brand"
                    {...register('brand')}
                    className="mt-1"
                    placeholder="Product brand"
                  />
                </div>

                <div>
                  <Label htmlFor="vendor" className="text-sm font-medium text-gray-700">
                    Vendor/Supplier
                  </Label>
                  <Input
                    id="vendor"
                    {...register('vendor')}
                    className="mt-1"
                    placeholder="Vendor name"
                  />
                </div>

                <div>
                  <Label htmlFor="manufacturer" className="text-sm font-medium text-gray-700">
                    Manufacturer
                  </Label>
                  <Input
                    id="manufacturer"
                    {...register('manufacturer')}
                    className="mt-1"
                    placeholder="Manufacturer name"
                  />
                </div>

                <div>
                  <Label htmlFor="model" className="text-sm font-medium text-gray-700">
                    Model Number
                  </Label>
                  <Input
                    id="model"
                    {...register('model')}
                    className="mt-1"
                    placeholder="Model number"
                  />
                </div>

                <div>
                  <Label htmlFor="warranty" className="text-sm font-medium text-gray-700">
                    Warranty Period
                  </Label>
                  <Input
                    id="warranty"
                    {...register('warranty')}
                    className="mt-1"
                    placeholder="e.g., 1 year, 6 months"
                  />
                </div>

                <div>
                  <Label htmlFor="origin" className="text-sm font-medium text-gray-700">
                    Country of Origin
                  </Label>
                  <Input
                    id="origin"
                    {...register('origin')}
                    className="mt-1"
                    placeholder="Made in..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="shortDesc" className="text-sm font-medium text-gray-700">
                  Short Description
                </Label>
                <Input
                  id="shortDesc"
                  {...register('shortDescription')}
                  className="mt-1"
                  placeholder="Brief product description"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Detailed Description
                </Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  className="mt-1 min-h-[120px]"
                  placeholder="Detailed product description..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Category *</Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setValue('subcategory', '');
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(categories).map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Subcategory</Label>
                  <Controller
                    name="subcategory"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!getValues('category')}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {getValues('category') && categories[getValues('category') as keyof typeof categories]?.map(subcat => (
                            <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku" className="text-sm font-medium text-gray-700">
                    SKU *
                  </Label>
                  <Input
                    id="sku"
                    {...register('sku')}
                    className="mt-1"
                    placeholder="Product SKU"
                  />
                  {errors.sku && <p className="text-red-600 text-sm mt-1">{errors.sku.message}</p>}
                </div>

                <div>
                  <Label htmlFor="barcode" className="text-sm font-medium text-gray-700">
                    Barcode/UPC
                  </Label>
                  <Input
                    id="barcode"
                    {...register('barcode')}
                    className="mt-1"
                    placeholder="Product barcode"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Tags</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Attributes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
                Product Attributes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Age Group</Label>
                  <Controller
                    name="ageGroup"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select age group" />
                        </SelectTrigger>
                        <SelectContent>
                          {ageGroups.map(age => (
                            <SelectItem key={age} value={age}>{age}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Gender</Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {genders.map(gender => (
                            <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Season</Label>
                  <Controller
                    name="season"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                        <SelectContent>
                          {seasons.map(season => (
                            <SelectItem key={season} value={season}>{season}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Occasion</Label>
                  <Controller
                    name="occasion"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select occasion" />
                        </SelectTrigger>
                        <SelectContent>
                          {occasions.map(occasion => (
                            <SelectItem key={occasion} value={occasion}>{occasion}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Style</Label>
                  <Controller
                    name="style"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          {styles.map(style => (
                            <SelectItem key={style} value={style}>{style}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Pattern</Label>
                  <Controller
                    name="pattern"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select pattern" />
                        </SelectTrigger>
                        <SelectContent>
                          {patterns.map(pattern => (
                            <SelectItem key={pattern} value={pattern}>{pattern}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="careInstructions" className="text-sm font-medium text-gray-700">
                    Care Instructions
                  </Label>
                  <Textarea
                    id="careInstructions"
                    {...register('careInstructions')}
                    className="mt-1"
                    placeholder="Washing, drying, storage instructions..."
                  />
                </div>

                <div>
                  <Label htmlFor="ingredients" className="text-sm font-medium text-gray-700">
                    Ingredients/Materials
                  </Label>
                  <Textarea
                    id="ingredients"
                    {...register('ingredients')}
                    className="mt-1"
                    placeholder="List of ingredients or materials..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nutritionalInfo" className="text-sm font-medium text-gray-700">
                    Nutritional Information
                  </Label>
                  <Textarea
                    id="nutritionalInfo"
                    {...register('nutritionalInfo')}
                    className="mt-1"
                    placeholder="Calories, nutrients, serving size..."
                  />
                </div>

                <div>
                  <Label htmlFor="allergens" className="text-sm font-medium text-gray-700">
                    Allergen Information
                  </Label>
                  <Textarea
                    id="allergens"
                    {...register('allergens')}
                    className="mt-1"
                    placeholder="Contains nuts, dairy, gluten..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-yellow-500 rounded-full"></div>
                Advanced Pricing & Discounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="wholesalePrice" className="text-sm font-medium text-gray-700">
                    Wholesale Price
                  </Label>
                  <Input
                    id="wholesalePrice"
                    type="number"
                    {...register('wholesalePrice', { valueAsNumber: true })}
                    className="mt-1"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="msrp" className="text-sm font-medium text-gray-700">
                    MSRP
                  </Label>
                  <Input
                    id="msrp"
                    type="number"
                    {...register('msrp', { valueAsNumber: true })}
                    className="mt-1"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="loyaltyPoints" className="text-sm font-medium text-gray-700">
                    Loyalty Points
                  </Label>
                  <Input
                    id="loyaltyPoints"
                    type="number"
                    {...register('loyaltyPoints', { valueAsNumber: true })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Tax Class</Label>
                  <Controller
                    name="taxClass"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select tax class" />
                        </SelectTrigger>
                        <SelectContent>
                          {taxClasses.map(taxClass => (
                            <SelectItem key={taxClass} value={taxClass}>{taxClass}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="taxRate" className="text-sm font-medium text-gray-700">
                    Tax Rate (%)
                  </Label>
                  <Input
                    id="taxRate"
                    type="number"
                    {...register('taxRate', { valueAsNumber: true })}
                    className="mt-1"
                    step="0.01"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Discount Type</Label>
                  <Controller
                    name="discountType"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select discount type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Discount</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="discountValue" className="text-sm font-medium text-gray-700">
                    Discount Value
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    {...register('discountValue', { valueAsNumber: true })}
                    className="mt-1"
                    step="0.01"
                    disabled={watch('discountType') === 'none'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Start Date</Label>
                    <Input
                      type="date"
                      {...register('discountStartDate')}
                      className="mt-1"
                      disabled={watch('discountType') === 'none'}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">End Date</Label>
                    <Input
                      type="date"
                      {...register('discountEndDate')}
                      className="mt-1"
                      disabled={watch('discountType') === 'none'}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Requires Shipping</Label>
                <Controller
                  name="shipping.requiresShipping"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              {watch('shipping.requiresShipping') && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Shipping Class</Label>
                      <Controller
                        name="shipping.shippingClass"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select shipping class" />
                            </SelectTrigger>
                            <SelectContent>
                              {shippingClasses.map(cls => (
                                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div>
                      <Label htmlFor="shipping.handlingTime" className="text-sm font-medium text-gray-700">
                        Handling Time (days)
                      </Label>
                      <Input
                        id="shipping.handlingTime"
                        type="number"
                        {...register('shipping.handlingTime', { valueAsNumber: true })}
                        className="mt-1"
                        min="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="shipping.freeShippingThreshold" className="text-sm font-medium text-gray-700">
                        Free Shipping Threshold
                      </Label>
                      <Input
                        id="shipping.freeShippingThreshold"
                        type="number"
                        {...register('shipping.freeShippingThreshold', { valueAsNumber: true })}
                        className="mt-1"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Package Length (cm)</Label>
                      <Input
                        type="number"
                        {...register('packageDimensions.length', { valueAsNumber: true })}
                        className="mt-1"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Package Width (cm)</Label>
                      <Input
                        type="number"
                        {...register('packageDimensions.width', { valueAsNumber: true })}
                        className="mt-1"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Package Height (cm)</Label>
                      <Input
                        type="number"
                        {...register('packageDimensions.height', { valueAsNumber: true })}
                        className="mt-1"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Package Weight (kg)</Label>
                      <Input
                        type="number"
                        {...register('packageDimensions.weight', { valueAsNumber: true })}
                        className="mt-1"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="shipping.hazardousMaterial"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label className="text-sm text-gray-700">Hazardous Material</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="shipping.fragile"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label className="text-sm text-gray-700">Fragile Item</Label>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Variants */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                  Product Variants
                </CardTitle>
                <Button onClick={addVariant} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variant
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {variants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No variants added yet. Click "Add Variant" to create product variations.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {variants.map((variant, index) => (
                    <div key={variant.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Variant {index + 1}</h4>
                        <Button
                          onClick={() => removeVariant(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Variant Name</Label>
                          <Input
                            {...register(`variants.${index}.name`)}
                            className="mt-1"
                          />
                          {errors.variants?.[index]?.name && (
                            <p className="text-red-600 text-sm mt-1">{errors.variants[index].name.message}</p>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">SKU</Label>
                          <Input
                            {...register(`variants.${index}.sku`)}
                            className="mt-1"
                          />
                          {errors.variants?.[index]?.sku && (
                            <p className="text-red-600 text-sm mt-1">{errors.variants[index].sku.message}</p>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">Barcode</Label>
                          <Input
                            {...register(`variants.${index}.barcode`)}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">Price</Label>
                          <Input
                            type="number"
                            {...register(`variants.${index}.price`, { valueAsNumber: true })}
                            className="mt-1"
                            step="0.01"
                          />
                          {errors.variants?.[index]?.price && (
                            <p className="text-red-600 text-sm mt-1">{errors.variants[index].price.message}</p>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">Compare Price</Label>
                          <Input
                            type="number"
                            {...register(`variants.${index}.comparePrice`, { valueAsNumber: true })}
                            className="mt-1"
                            step="0.01"
                          />
                          {errors.variants?.[index]?.comparePrice && (
                            <p className="text-red-600 text-sm mt-1">{errors.variants[index].comparePrice.message}</p>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">Inventory</Label>
                          <Input
                            type="number"
                            {...register(`variants.${index}.inventory`, { valueAsNumber: true })}
                            className="mt-1"
                          />
                          {errors.variants?.[index]?.inventory && (
                            <p className="text-red-600 text-sm mt-1">{errors.variants[index].inventory.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Size</Label>
                          <Controller
                            name={`variants.${index}.attributes.size`}
                            control={control}
                            render={({ field }) => (
                              <Select value={field.value || ''} onValueChange={field.onChange}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                  {sizes.map(size => (
                                    <SelectItem key={size} value={size}>{size}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">Color</Label>
                          <Controller
                            name={`variants.${index}.attributes.color`}
                            control={control}
                            render={({ field }) => (
                              <Select value={field.value || ''} onValueChange={field.onChange}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select color" />
                                </SelectTrigger>
                                <SelectContent>
                                  {colors.map(color => (
                                    <SelectItem key={color} value={color}>{color}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">Material</Label>
                          <Controller
                            name={`variants.${index}.attributes.material`}
                            control={control}
                            render={({ field }) => (
                              <Select value={field.value || ''} onValueChange={field.onChange}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select material" />
                                </SelectTrigger>
                                <SelectContent>
                                  {materials.map(material => (
                                    <SelectItem key={material} value={material}>{material}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center space-x-2">
                          <Controller
                            name={`variants.${index}.trackQuantity`}
                            control={control}
                            render={({ field }) => (
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            )}
                          />
                          <Label className="text-sm text-gray-700">Track Quantity</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Controller
                            name={`variants.${index}.allowBackorder`}
                            control={control}
                            render={({ field }) => (
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            )}
                          />
                          <Label className="text-sm text-gray-700">Allow Backorder</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                Product Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Upload product images</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Choose Files
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="basePrice" className="text-sm font-medium text-gray-700">
                  Base Price *
                </Label>
                <Input
                  id="basePrice"
                  type="number"
                  {...register('basePrice', { valueAsNumber: true })}
                  className="mt-1"
                  step="0.01"
                />
                {errors.basePrice && <p className="text-red-600 text-sm mt-1">{errors.basePrice.message}</p>}
              </div>

              <div>
                <Label htmlFor="comparePrice" className="text-sm font-medium text-gray-700">
                  Compare Price
                </Label>
                <Input
                  id="comparePrice"
                  type="number"
                  {...register('comparePrice', { valueAsNumber: true })}
                  className="mt-1"
                  step="0.01"
                />
                {errors.comparePrice && <p className="text-red-600 text-sm mt-1">{errors.comparePrice.message}</p>}
              </div>

              <div>
                <Label htmlFor="costPrice" className="text-sm font-medium text-gray-700">
                  Cost Price
                </Label>
                <Input
                  id="costPrice"
                  type="number"
                  {...register('costPrice', { valueAsNumber: true })}
                  className="mt-1"
                  step="0.01"
                />
                {errors.costPrice && <p className="text-red-600 text-sm mt-1">{errors.costPrice.message}</p>}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Profit Margin
                </Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <span className="text-lg font-semibold text-green-600">
                    {watch('profitMargin').toFixed(2)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="inventory" className="text-sm font-medium text-gray-700">
                  Stock Quantity
                </Label>
                <Input
                  id="inventory"
                  type="number"
                  {...register('inventory', { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.inventory && <p className="text-red-600 text-sm mt-1">{errors.inventory.message}</p>}
              </div>

              <div>
                <Label htmlFor="lowStockThreshold" className="text-sm font-medium text-gray-700">
                  Low Stock Threshold
                </Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  {...register('lowStockThreshold', { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.lowStockThreshold && <p className="text-red-600 text-sm mt-1">{errors.lowStockThreshold.message}</p>}
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Track Quantity</Label>
                <Controller
                  name="trackQuantity"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Allow Backorder</Label>
                <Controller
                  name="allowBackorder"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div>
                <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  {...register('weight', { valueAsNumber: true })}
                  className="mt-1"
                  step="0.01"
                />
                {errors.weight && <p className="text-red-600 text-sm mt-1">{errors.weight.message}</p>}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs font-medium text-gray-700">Length</Label>
                  <Input
                    type="number"
                    {...register('dimensions.length', { valueAsNumber: true })}
                    className="mt-1"
                    step="0.01"
                  />
                  {errors.dimensions?.length && <p className="text-red-600 text-sm mt-1">{errors.dimensions.length.message}</p>}
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-700">Width</Label>
                  <Input
                    type="number"
                    {...register('dimensions.width', { valueAsNumber: true })}
                    className="mt-1"
                    step="0.01"
                  />
                  {errors.dimensions?.width && <p className="text-red-600 text-sm mt-1">{errors.dimensions.width.message}</p>}
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-700">Height</Label>
                  <Input
                    type="number"
                    {...register('dimensions.height', { valueAsNumber: true })}
                    className="mt-1"
                    step="0.01"
                  />
                  {errors.dimensions?.height && <p className="text-red-600 text-sm mt-1">{errors.dimensions.height.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Meta Title
                </Label>
                <Input
                  {...register('seo.title')}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Meta Description
                </Label>
                <Textarea
                  {...register('seo.description')}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  URL Slug
                </Label>
                <Input
                  {...register('seo.slug')}
                  className="mt-1"
                  placeholder="auto-generated-from-name"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Keywords
                </Label>
                <Input
                  {...register('seo.keywords')}
                  className="mt-1"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </CardContent>
          </Card>

          {/* Visibility & Publishing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visibility & Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Visibility</Label>
                <Controller
                  name="visibility"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="password">Password Protected</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {watch('visibility') === 'password' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Password</Label>
                  <Input
                    type="password"
                    {...register('password')}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-gray-700">Publish Date</Label>
                <Input
                  type="date"
                  {...register('publishDate')}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Expiry Date (Optional)</Label>
                <Input
                  type="date"
                  {...register('expiryDate')}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Featured Product</Label>
                <Controller
                  name="featured"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit(onSubmit('draft'))}
                  variant="outline"
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save {isUpdateMode ? 'Changes' : 'Draft'}
                </Button>
                <Button
                  onClick={handleSubmit(onSubmit('published'))}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isUpdateMode ? 'Update & Publish' : 'Publish'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* JSON Output for Debugging */}
      {showJsonOutput && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>JSON Output</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                {jsonOutput}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
