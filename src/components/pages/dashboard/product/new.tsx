
"use client";

import { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, X, Upload, Image as ImageIcon, Save, Eye, Trash2, Info } from 'lucide-react';

// Define Zod schemas for validation
const variantSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Variant name is required'),
  sku: z.string().min(1, 'Variant SKU is required').regex(/^[a-zA-Z0-9-]+$/, 'SKU must be alphanumeric with hyphens'),
  price: z.number().min(0, 'Price must be non-negative'),
  retailPrice: z.number().min(0, 'Retail price must be non-negative').optional(),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  lowStockLevel: z.number().int().min(0, 'Low stock level must be non-negative'),
  productUPCEAN: z.string().regex(/^\d{12,13}$/, 'UPC/EAN must be 12 or 13 digits').optional(),
  description: z.string().optional(),
  images: z.array(z.string().url('Must be a valid URL')).optional(),
  attributes: z.object({
    size: z.string().optional(),
    color: z.string().optional(),
    material: z.string().optional(),
  }),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.string()).optional(),
  weight: z.number().min(0, 'Weight must be non-negative').optional(),
  dimensions: z.string().optional(),
});

const productSchema = z.object({
  title: z.string().min(1, 'Product title is required'),
  sku: z.string().min(1, 'SKU is required').regex(/^[a-zA-Z0-9-]+$/, 'SKU must be alphanumeric with hyphens'),
  productType: z.enum(['physical', 'digital', 'service']).optional(),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  category: z.string().min(1, 'Primary category is required'),
  descriptions: z.object({
    en: z.string().min(10, 'English description must be at least 10 characters'),
    es: z.string().optional(),
  }),
  status: z.enum(['active', 'inactive', 'draft', 'pending', 'archived', 'published']),
  price: z.number().min(0, 'Price must be non-negative'),
  discount: z.number().min(0, 'Discount must be non-negative').optional(),
  costPrice: z.number().min(0, 'Cost price must be non-negative').optional(),
  retailPrice: z.number().min(0, 'Retail price must be non-negative').optional(),
  salePrice: z.number().min(0, 'Sale price must be non-negative').optional(),
  trackInventory: z.enum(['yes', 'no', '']),
  currentStockLevel: z.number().int().min(0, 'Current stock must be non-negative'),
  lowStockLevel: z.number().int().min(0, 'Low stock level must be non-negative'),
  stock: z.number().int().min(0, 'Total stock must be non-negative'),
  manufacturerPartNumber: z.string().optional(),
  brand: z.string().optional(),
  overview: z.string().optional(),
  total_view: z.number().int().min(0).optional(),
  slug: z.string().optional(),
  productUPCEAN: z.string().regex(/^\d{12,13}$/, 'UPC/EAN must be 12 or 13 digits').optional(),
  seo_info: z.record(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  reviews: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  returnPolicy: z.string().optional(),
  warranty: z.string().optional(),
  shippingDetails: z.string().optional(),
  additionalImages: z.array(z.string().url('Must be a valid URL')).optional(),
  customAttributes: z.record(z.string()).optional(),
  videoLinks: z.array(z.string().url('Must be a valid URL')).optional(),
  availability: z.string().optional(),
  ecoFriendly: z.boolean().optional(),
  ageRestriction: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.number().min(0, 'Weight must be non-negative').optional(),
  shippingWeight: z.number().min(0, 'Shipping weight must be non-negative').optional(),
  discountStartDate: z.string().optional(),
  discountEndDate: z.string().optional(),
  relatedProducts: z.array(z.string()).optional(),
  isGiftCard: z.boolean().optional(),
  giftCardValue: z.number().min(0, 'Gift card value must be non-negative').optional(),
  productBundle: z.boolean().optional(),
  bundleContents: z.array(z.object({
    product: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  })).optional(),
  purchaseLimit: z.number().int().min(0, 'Purchase limit must be non-negative').optional(),
  bulkDiscounts: z.array(z.object({
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    discountAmount: z.number().min(0, 'Discount amount must be non-negative'),
  })).optional(),
  giftWrappingAvailable: z.boolean().optional(),
  preOrder: z.boolean().optional(),
  preOrderDate: z.string().optional(),
  isSubscription: z.boolean().optional(),
  subscriptionDetails: z.string().optional(),
  productOrigin: z.string().optional(),
  allergens: z.array(z.string()).optional(),
  returnPeriod: z.number().int().min(0, 'Return period must be non-negative').optional(),
  customShippingOptions: z.record(z.string()).optional(),
  virtualProduct: z.boolean().optional(),
  digitalDownloadLink: z.string().url('Must be a valid URL').optional(),
  variants: z.array(variantSchema).optional(),
});

// Reused constants
const categories = {
  'Electronics': ['Smartphones', 'Laptops', 'Tablets', 'Accessories', 'Gaming'],
  'Clothing': ['Men', 'Women', 'Kids', 'Shoes', 'Accessories'],
  'Books': ['Fiction', 'Non-Fiction', 'Educational', 'Comics', 'Magazines'],
  'Home & Garden': ['Furniture', 'Decor', 'Kitchen', 'Garden', 'Tools'],
  'Sports': ['Fitness', 'Outdoor', 'Team Sports', 'Water Sports', 'Winter Sports'],
  'Beauty': ['Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Tools'],
  'Toys': ['Educational', 'Action Figures', 'Dolls', 'Games', 'Outdoor']
};

const allCategories = Object.keys(categories).flatMap(key => categories[key as keyof typeof categories]);
const brands = ['Nike', 'Adidas', 'Apple', 'Samsung', 'Sony', 'Levi\'s', 'Gucci', 'Zara', 'H&M', 'Uniqlo', 'Canon', 'Nikon', 'Dell', 'HP', 'Microsoft'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'];
const materials = ['Cotton', 'Polyester', 'Leather', 'Wool', 'Silk', 'Denim'];

export default function ProductCreate() {
  const { register, control, handleSubmit: handleFormSubmit, formState: { errors }, setValue, getValues } = useForm<ProductData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      sku: '',
      categories: [],
      category: '',
      descriptions: { en: '', es: '' },
      status: 'draft',
      price: 0,
      currentStockLevel: 0,
      lowStockLevel: 0,
      stock: 0,
      trackInventory: 'yes',
      specifications: {},
      seo_info: {},
      customAttributes: {},
      customShippingOptions: {},
      isAvailable: true,
      availability: 'In Stock',
      isFeatured: false,
      ecoFriendly: false,
      isGiftCard: false,
      productBundle: false,
      giftWrappingAvailable: false,
      preOrder: false,
      isSubscription: false,
      virtualProduct: false,
      tags: [],
      shortDescription: '',
      brand: '',
      warranty: '',
      productOrigin: '',
      discountStartDate: '',
      discountEndDate: '',
      videoLinks: [],
      allergens: [],
      weight: 0,
      features: [],
      relatedProducts: [],
      variants: [],
      bundleContents: [],
      bulkDiscounts: [],
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

  const { fields: features, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: 'features',
  });

  const { fields: allergens, append: appendAllergen, remove: removeAllergen } = useFieldArray({
    control,
    name: 'allergens',
  });

  const { fields: relatedProducts, append: appendRelatedProduct, remove: removeRelatedProduct } = useFieldArray({
    control,
    name: 'relatedProducts',
  });

  const { fields: categoriesField, append: appendCategory, remove: removeCategory } = useFieldArray({
    control,
    name: 'categories',
  });

  const { fields: bundleContents, append: appendBundleContent, remove: removeBundleContent } = useFieldArray({
    control,
    name: 'bundleContents',
  });

  const { fields: bulkDiscounts, append: appendBulkDiscount, remove: removeBulkDiscount } = useFieldArray({
    control,
    name: 'bulkDiscounts',
  });

  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newAllergen, setNewAllergen] = useState('');
  const [newRelatedProduct, setNewRelatedProduct] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [newCustomAttrKey, setNewCustomAttrKey] = useState('');
  const [newCustomAttrValue, setNewCustomAttrValue] = useState('');
  const [showJsonOutput, setShowJsonOutput] = useState(false);
  const [jsonOutput, setJsonOutput] = useState('');

  const addTag = () => {
    if (newTag.trim() && !getValues('tags')?.includes(newTag.trim())) {
      appendTag(newTag.trim());
      setNewTag('');
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !getValues('features')?.includes(newFeature.trim())) {
      appendFeature(newFeature.trim());
      setNewFeature('');
    }
  };

  const addAllergen = () => {
    if (newAllergen.trim() && !getValues('allergens')?.includes(newAllergen.trim())) {
      appendAllergen(newAllergen.trim());
      setNewAllergen('');
    }
  };

  const addRelatedProduct = () => {
    if (newRelatedProduct.trim() && !getValues('relatedProducts')?.includes(newRelatedProduct.trim())) {
      appendRelatedProduct(newRelatedProduct.trim());
      setNewRelatedProduct('');
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !getValues('categories')?.includes(newCategory.trim())) {
      appendCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setValue('specifications', { ...getValues('specifications'), [newSpecKey.trim()]: newSpecValue.trim() });
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...getValues('specifications') };
    delete newSpecs[key];
    setValue('specifications', newSpecs);
  };

  const addCustomAttribute = () => {
    if (newCustomAttrKey.trim() && newCustomAttrValue.trim()) {
      setValue('customAttributes', { ...getValues('customAttributes'), [newCustomAttrKey.trim()]: newCustomAttrValue.trim() });
      setNewCustomAttrKey('');
      setNewCustomAttrValue('');
    }
  };

  const removeCustomAttribute = (key: string) => {
    const newAttrs = { ...getValues('customAttributes') };
    delete newAttrs[key];
    setValue('customAttributes', newAttrs);
  };

  const addBundleContent = () => {
    if (getValues('productBundle')) {
      appendBundleContent({ product: '', quantity: 1 });
    }
  };

  const addBulkDiscount = () => {
    appendBulkDiscount({ quantity: 1, discountAmount: 0 });
  };

  const addVariant = () => {
    const formValues = getValues();
    appendVariant({
      id: Date.now().toString(),
      name: `${formValues.title} Variant`,
      sku: `${formValues.sku}-v${(formValues.variants?.length || 0) + 1}`,
      price: formValues.price,
      stock: formValues.stock,
      lowStockLevel: formValues.lowStockLevel,
      attributes: {},
      features: [],
      specifications: {},
    });
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const onSubmit = (data: ProductData, status: 'draft' | 'published') => {
    const updatedProduct = {
      ...data,
      status,
      slug: data.slug || generateSlug(data.title),
      images: data.additionalImages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(updatedProduct, null, 2);
    setJsonOutput(jsonString);
    setShowJsonOutput(true);

    console.log('Product JSON:', jsonString);
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Create New Product</h1>
          <p className="text-gray-300 mt-2">Comprehensive product form with variants and advanced features.</p>
        </div>

        {showJsonOutput && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Product JSON Output</h3>
                  <Button
                    onClick={() => setShowJsonOutput(false)}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-6 overflow-auto max-h-[60vh]">
                <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-auto text-gray-200 font-mono">
                  <code>{jsonOutput}</code>
                </pre>
              </div>
              <div className="p-6 border-t border-gray-700 flex gap-3">
                <Button
                  onClick={() => navigator.clipboard.writeText(jsonOutput)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Copy to Clipboard
                </Button>
                <Button
                  onClick={() => setShowJsonOutput(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-gray-900 border-gray-700 shadow-lg">
              <CardHeader className="bg-gray-800 border-b-gray-700">
                <CardTitle className="flex items-center gap-2 text-white">
                  <div className="w-2 h-6 bg-blue-400 rounded-full"></div>
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6 text-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium text-gray-300">Title *</Label>
                    <Input
                      id="title"
                      {...register('title')}
                      className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter product title"
                    />
                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="sku" className="text-sm font-medium text-gray-300">SKU *</Label>
                    <Input
                      id="sku"
                      {...register('sku')}
                      className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Unique SKU"
                    />
                    {errors.sku && <p className="text-red-400 text-xs mt-1">{errors.sku.message}</p>}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-300">Brand</Label>
                  <Controller
                    name="brand"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value || ''} onValueChange={field.onChange}>
                        <SelectTrigger className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600 text-white">
                          {brands.map(brand => (
                            <SelectItem key={brand} value={brand} className="hover:bg-gray-700">{brand}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.brand && <p className="text-red-400 text-xs mt-1">{errors.brand.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Product Type</Label>
                    <Controller
                      name="productType"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value || ''} onValueChange={field.onChange}>
                          <SelectTrigger className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600 text-white">
                            <SelectItem value="physical" className="hover:bg-gray-700">Physical</SelectItem>
                            <SelectItem value="digital" className="hover:bg-gray-700">Digital</SelectItem>
                            <SelectItem value="service" className="hover:bg-gray-700">Service</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.productType && <p className="text-red-400 text-xs mt-1">{errors.productType.message}</p>}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Primary Category *</Label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                            <SelectValue placeholder="Select primary category" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600 text-white">
                            {Object.keys(categories).map(cat => (
                              <SelectItem key={cat} value={cat} className="hover:bg-gray-700">{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">Additional Categories</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {categoriesField.map((cat, index) => (
                      <Badge key={cat.id} variant="secondary" className="bg-gray-700 text-gray-300 flex items-center gap-1 border-gray-600">
                        {cat}
                        <Button variant="ghost" size="sm" onClick={() => removeCategory(index)} className="h-4 w-4 p-0">
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Select onValueChange={setNewCategory}>
                      <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <SelectValue placeholder="Select category to add" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600 text-white">
                        {allCategories.map(cat => (
                          <SelectItem key={cat} value={cat} className="hover:bg-gray-700">{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={addCategory} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700" disabled={!newCategory}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {errors.categories && <p className="text-red-400 text-xs mt-1">{errors.categories.message}</p>}
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-300">Descriptions *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="descriptions_en" className="text-xs font-medium text-gray-400">English</Label>
                      <Textarea
                        id="descriptions_en"
                        {...register('descriptions.en')}
                        className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                        placeholder="English description..."
                      />
                      {errors.descriptions?.en && <p className="text-red-400 text-xs mt-1">{errors.descriptions.en.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="descriptions_es" className="text-xs font-medium text-gray-400">Spanish</Label>
                      <Textarea
                        id="descriptions_es"
                        {...register('descriptions.es')}
                        className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                        placeholder="Spanish description..."
                      />
                      {errors.descriptions?.es && <p className="text-red-400 text-xs mt-1">{errors.descriptions.es.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-300 mb-2 block">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tags.map((tag, index) => (
                        <Badge key={tag.id} variant="secondary" className="bg-gray-700 text-gray-300 flex items-center gap-1 border-gray-600">
                          {tag}
                          <Button variant="ghost" size="sm" onClick={() => removeTag(index)} className="h-4 w-4 p-0">
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 flex-1"
                      />
                      <Button type="button" onClick={addTag} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {errors.tags && <p className="text-red-400 text-xs mt-1">{errors.tags.message}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-300 mb-2 block">Features</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {features.map((feature, index) => (
                        <Badge key={feature.id} variant="secondary" className="bg-gray-700 text-gray-300 flex items-center gap-1 border-gray-600">
                          {feature}
                          <Button variant="ghost" size="sm" onClick={() => removeFeature(index)} className="h-4 w-4 p-0">
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add feature"
                        onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 flex-1"
                      />
                      <Button type="button" onClick={addFeature} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {errors.features && <p className="text-red-400 text-xs mt-1">{errors.features.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gray-900 border-gray-700 shadow-lg">
                <CardHeader className="bg-gray-800 border-b-gray-700">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="w-2 h-6 bg-yellow-400 rounded-full"></div>
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6 text-gray-200">
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium text-gray-300">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      {...register('price', { valueAsNumber: true })}
                      className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      step="0.01"
                    />
                    {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="costPrice" className="text-sm font-medium text-gray-300">Cost Price</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      {...register('costPrice', { valueAsNumber: true })}
                      className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      step="0.01"
                    />
                    {errors.costPrice && <p className="text-red-400 text-xs mt-1">{errors.costPrice.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="retailPrice" className="text-sm font-medium text-gray-300">Retail Price</Label>
                    <Input
                      id="retailPrice"
                      type="number"
                      {...register('retailPrice', { valueAsNumber: true })}
                      className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      step="0.01"
                    />
                    {errors.retailPrice && <p className="text-red-400 text-xs mt-1">{errors.retailPrice.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="salePrice" className="text-sm font-medium text-gray-300">Sale Price</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      {...register('salePrice', { valueAsNumber: true })}
                      className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      step="0.01"
                    />
                    {errors.salePrice && <p className="text-red-400 text-xs mt-1">{errors.salePrice.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="date"
                        {...register('discountStartDate')}
                        className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Start Date"
                      />
                      {errors.discountStartDate && <p className="text-red-400 text-xs mt-1">{errors.discountStartDate.message}</p>}
                    </div>
                    <div>
                      <Input
                        type="date"
                        {...register('discountEndDate')}
                        className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="End Date"
                      />
                      {errors.discountEndDate && <p className="text-red-400 text-xs mt-1">{errors.discountEndDate.message}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700 shadow-lg">
                <CardHeader className="bg-gray-800 border-b-gray-700">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="w-2 h-6 bg-green-400 rounded-full"></div>
                    Inventory
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6 text-gray-200">
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Track Inventory</Label>
                    <Controller
                      name="trackInventory"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600 text-white">
                            <SelectItem value="yes" className="hover:bg-gray-700">Yes</SelectItem>
                            <SelectItem value="no" className="hover:bg-gray-700">No</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.trackInventory && <p className="text-red-400 text-xs mt-1">{errors.trackInventory.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currentStockLevel" className="text-sm font-medium text-gray-300">Current Stock *</Label>
                      <Input
                        id="currentStockLevel"
                        type="number"
                        {...register('currentStockLevel', { valueAsNumber: true })}
                        className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      {errors.currentStockLevel && <p className="text-red-400 text-xs mt-1">{errors.currentStockLevel.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lowStockLevel" className="text-sm font-medium text-gray-300">Low Stock Level *</Label>
                      <Input
                        id="lowStockLevel"
                        type="number"
                        {...register('lowStockLevel', { valueAsNumber: true })}
                        className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      {errors.lowStockLevel && <p className="text-red-400 text-xs mt-1">{errors.lowStockLevel.message}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="stock" className="text-sm font-medium text-gray-300">Total Stock *</Label>
                    <Input
                      id="stock"
                      type="number"
                      {...register('stock', { valueAsNumber: true })}
                      className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.stock && <p className="text-red-400 text-xs mt-1">{errors.stock.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="purchaseLimit" className="text-sm font-medium text-gray-300">Purchase Limit</Label>
                    <Input
                      id="purchaseLimit"
                      type="number"
                      {...register('purchaseLimit', { valueAsNumber: true })}
                      className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.purchaseLimit && <p className="text-red-400 text-xs mt-1">{errors.purchaseLimit.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="weight" className="text-sm font-medium text-gray-300">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      {...register('weight', { valueAsNumber: true })}
                      className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      step="0.01"
                    />
                    {errors.weight && <p className="text-red-400 text-xs mt-1">{errors.weight.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="dimensions" className="text-sm font-medium text-gray-300">Dimensions</Label>
                    <Input
                      id="dimensions"
                      {...register('dimensions')}
                      className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="L x W x H (cm)"
                    />
                    {errors.dimensions && <p className="text-red-400 text-xs mt-1">{errors.dimensions.message}</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-700 shadow-lg">
              <CardHeader className="bg-gray-800 border-b-gray-700">
                <CardTitle className="flex items-center gap-2 text-white">
                  <div className="w-2 h-6 bg-purple-400 rounded-full"></div>
                  Specifications & Custom Attributes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6 text-gray-200">
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-300">Specifications</Label>
                  <div className="space-y-3">
                    {Object.entries(getValues('specifications') || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between gap-2 bg-gray-800 p-3 rounded-md">
                        <div className="flex-1">
                          <span className="text-gray-400 text-sm">{key}:</span>
                          <span className="ml-2 text-white">{value}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeSpecification(key)} className="text-red-400 hover:bg-red-900/20">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newSpecKey}
                        onChange={(e) => setNewSpecKey(e.target.value)}
                        placeholder="Spec Key (e.g., Material)"
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 flex-1"
                      />
                      <Input
                        value={newSpecValue}
                        onChange={(e) => setNewSpecValue(e.target.value)}
                        placeholder="Spec Value"
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 flex-1"
                      />
                      <Button type="button" onClick={addSpecification} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-300">Custom Attributes</Label>
                  <div className="space-y-3">
                    {Object.entries(getValues('customAttributes') || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between gap-2 bg-gray-800 p-3 rounded-md">
                        <div className="flex-1">
                          <span className="text-gray-400 text-sm">{key}:</span>
                          <span className="ml-2 text-white">{value}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeCustomAttribute(key)} className="text-red-400 hover:bg-red-900/20">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newCustomAttrKey}
                        onChange={(e) => setNewCustomAttrKey(e.target.value)}
                        placeholder="Attribute Key"
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 flex-1"
                      />
                      <Input
                        value={newCustomAttrValue}
                        onChange={(e) => setNewCustomAttrValue(e.target.value)}
                        placeholder="Attribute Value"
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 flex-1"
                      />
                      <Button type="button" onClick={addCustomAttribute} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 shadow-lg">
              <CardHeader className="bg-gray-800 border-b-gray-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="w-2 h-6 bg-indigo-400 rounded-full"></div>
                    Product Variants
                    <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 ml-2">
                      {variants.length} variants
                    </Badge>
                  </CardTitle>
                  <Button onClick={addVariant} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variant
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-gray-200">
                {variants.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <p className="text-lg font-medium text-gray-300">No variants added</p>
                    <p className="mt-2">Add variants for different sizes, colors, or configurations to provide more options for customers.</p>
                    <div className="mt-4 p-4 bg-gray-800 rounded-lg text-sm text-gray-400">
                      <Info className="w-4 h-4 inline mr-2" />
                      <span>Variants allow you to manage inventory and pricing for different product options independently.</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {variants.map((variant, index) => (
                      <div key={variant.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 relative overflow-hidden">
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="border-gray-600 text-gray-400">
                            Stock: {getValues(`variants.${index}.stock`)}
                          </Badge>
                        </div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-white text-lg">{getValues(`variants.${index}.name`)}</h4>
                            <p className="text-gray-400 text-sm mt-1">{getValues(`variants.${index}.sku`)}</p>
                          </div>
                          <Button
                            onClick={() => removeVariant(index)}
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-red-400 hover:bg-red-900/20"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <Label className="text-xs font-medium text-gray-400">Price</Label>
                            <Input
                              type="number"
                              {...register(`variants.${index}.price`, { valueAsNumber: true })}
                              className="mt-1 bg-gray-900 border-gray-600 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              step="0.01"
                            />
                            {errors.variants?.[index]?.price && <p className="text-red-400 text-xs mt-1">{errors.variants[index].price.message}</p>}
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-400">Retail Price</Label>
                            <Input
                              type="number"
                              {...register(`variants.${index}.retailPrice`, { valueAsNumber: true })}
                              className="mt-1 bg-gray-900 border-gray-600 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              step="0.01"
                            />
                            {errors.variants?.[index]?.retailPrice && <p className="text-red-400 text-xs mt-1">{errors.variants[index].retailPrice.message}</p>}
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-400">Stock</Label>
                            <Input
                              type="number"
                              {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                              className="mt-1 bg-gray-900 border-gray-600 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.variants?.[index]?.stock && <p className="text-red-400 text-xs mt-1">{errors.variants[index].stock.message}</p>}
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-400">Low Stock</Label>
                            <Input
                              type="number"
                              {...register(`variants.${index}.lowStockLevel`, { valueAsNumber: true })}
                              className="mt-1 bg-gray-900 border-gray-600 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.variants?.[index]?.lowStockLevel && <p className="text-red-400 text-xs mt-1">{errors.variants[index].lowStockLevel.message}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label className="text-xs font-medium text-gray-400">Description</Label>
                            <Textarea
                              {...register(`variants.${index}.description`)}
                              className="mt-1 bg-gray-900 border-gray-600 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[60px]"
                              placeholder="Variant-specific description"
                            />
                            {errors.variants?.[index]?.description && <p className="text-red-400 text-xs mt-1">{errors.variants[index].description.message}</p>}
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-400">UPC/EAN</Label>
                            <Input
                              {...register(`variants.${index}.productUPCEAN`)}
                              className="mt-1 bg-gray-900 border-gray-600 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.variants?.[index]?.productUPCEAN && <p className="text-red-400 text-xs mt-1">{errors.variants[index].productUPCEAN.message}</p>}
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-400">Weight (kg)</Label>
                            <Input
                              type="number"
                              {...register(`variants.${index}.weight`, { valueAsNumber: true })}
                              className="mt-1 bg-gray-900 border-gray-600 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              step="0.01"
                            />
                            {errors.variants?.[index]?.weight && <p className="text-red-400 text-xs mt-1">{errors.variants[index].weight.message}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label className="text-xs font-medium text-gray-400">Size</Label>
                            <Controller
                              name={`variants.${index}.attributes.size`}
                              control={control}
                              render={({ field }) => (
                                <Select value={field.value || ''} onValueChange={field.onChange}>
                                  <SelectTrigger className="mt-1 bg-gray-900 border-gray-600 text-white text-sm">
                                    <SelectValue placeholder="Size" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-800 text-white">
                                    {sizes.map(size => <SelectItem key={size} value={size} className="hover:bg-gray-700">{size}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.variants?.[index]?.attributes?.size && <p className="text-red-400 text-xs mt-1">{errors.variants[index].attributes.size.message}</p>}
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-400">Color</Label>
                            <Controller
                              name={`variants.${index}.attributes.color`}
                              control={control}
                              render={({ field }) => (
                                <Select value={field.value || ''} onValueChange={field.onChange}>
                                  <SelectTrigger className="mt-1 bg-gray-900 border-gray-600 text-white text-sm">
                                    <SelectValue placeholder="Color" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-800 text-white">
                                    {colors.map(color => <SelectItem key={color} value={color} className="hover:bg-gray-700">{color}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.variants?.[index]?.attributes?.color && <p className="text-red-400 text-xs mt-1">{errors.variants[index].attributes.color.message}</p>}
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-400">Material</Label>
                            <Controller
                              name={`variants.${index}.attributes.material`}
                              control={control}
                              render={({ field }) => (
                                <Select value={field.value || ''} onValueChange={field.onChange}>
                                  <SelectTrigger className="mt-1 bg-gray-900 border-gray-600 text-white text-sm">
                                    <SelectValue placeholder="Material" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-800 text-white">
                                    {materials.map(material => <SelectItem key={material} value={material} className="hover:bg-gray-700">{material}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.variants?.[index]?.attributes?.material && <p className="text-red-400 text-xs mt-1">{errors.variants[index].attributes.material.message}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs font-medium text-gray-400">Dimensions</Label>
                            <Input
                              {...register(`variants.${index}.dimensions`)}
                              className="mt-1 bg-gray-900 border-gray-600 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              placeholder="L x W x H (cm)"
                            />
                            {errors.variants?.[index]?.dimensions && <p className="text-red-400 text-xs mt-1">{errors.variants[index].dimensions.message}</p>}
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-400">Images (URLs)</Label>
                            <Input
                              {...register(`variants.${index}.images`)}
                              onChange={(e) => setValue(`variants.${index}.images`, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                              className="mt-1 bg-gray-900 border-gray-600 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              placeholder="Comma-separated image URLs"
                            />
                            {errors.variants?.[index]?.images && <p className="text-red-400 text-xs mt-1">{errors.variants[index].images.message}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gray-900 border-gray-700 shadow-lg">
                <CardHeader className="bg-gray-800 border-b-gray-700">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="w-2 h-6 bg-pink-400 rounded-full"></div>
                    Bundle & Discounts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6 text-gray-200">
                  <div className="flex items-center space-x-3">
                    <Controller
                      name="productBundle"
                      control={control}
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                    <Label className="text-sm font-medium text-gray-300">Product Bundle</Label>
                    {errors.productBundle && <p className="text-red-400 text-xs mt-1">{errors.productBundle.message}</p>}
                  </div>

                  {getValues('productBundle') && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-300">Bundle Contents</Label>
                      {bundleContents.map((item, index) => (
                        <div key={item.id} className="flex gap-2 bg-gray-800 p-3 rounded-md">
                          <Input
                            {...register(`bundleContents.${index}.product`)}
                            placeholder="Related Product ID"
                            className="flex-1 bg-gray-900 border-gray-600 text-white"
                          />
                          {errors.bundleContents?.[index]?.product && <p className="text-red-400 text-xs mt-1">{errors.bundleContents[index].product.message}</p>}
                          <Input
                            type="number"
                            {...register(`bundleContents.${index}.quantity`, { valueAsNumber: true })}
                            className="w-20 bg-gray-900 border-gray-600 text-white"
                            min="1"
                          />
                          {errors.bundleContents?.[index]?.quantity && <p className="text-red-400 text-xs mt-1">{errors.bundleContents[index].quantity.message}</p>}
                          <Button
                            onClick={() => removeBundleContent(index)}
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button onClick={addBundleContent} variant="outline" size="sm" className="border-gray-600 text-gray-300">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  )}

                  <Separator className="bg-gray-700" />

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-300">Bulk Discounts</Label>
                    {bulkDiscounts.map((discount, index) => (
                      <div key={discount.id} className="flex gap-2 bg-gray-800 p-3 rounded-md">
                        <Input
                          type="number"
                          {...register(`bulkDiscounts.${index}.quantity`, { valueAsNumber: true })}
                          placeholder="Min Quantity"
                          className="flex-1 bg-gray-900 border-gray-600 text-white"
                          min="1"
                        />
                        {errors.bulkDiscounts?.[index]?.quantity && <p className="text-red-400 text-xs mt-1">{errors.bulkDiscounts[index].quantity.message}</p>}
                        <Input
                          type="number"
                          {...register(`bulkDiscounts.${index}.discountAmount`, { valueAsNumber: true })}
                          placeholder="Discount Amount"
                          className="flex-1 bg-gray-900 border-gray-600 text-white"
                          step="0.01"
                        />
                        {errors.bulkDiscounts?.[index]?.discountAmount && <p className="text-red-400 text-xs mt-1">{errors.bulkDiscounts[index].discountAmount.message}</p>}
                        <Button
                          onClick={() => removeBulkDiscount(index)}
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button onClick={addBulkDiscount} variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Discount
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700 shadow-lg">
                <CardHeader className="bg-gray-800 border-b-gray-700">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="w-2 h-6 bg-teal-400 rounded-full"></div>
                    Related & Allergens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6 text-gray-200">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-300">Related Products</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {relatedProducts.map((related, index) => (
                        <Badge key={related.id} variant="secondary" className="bg-gray-700 text-gray-300 flex items-center gap-1 border-gray-600">
                          {related}
                          <Button variant="ghost" size="sm" onClick={() => removeRelatedProduct(index)} className="h-4 w-4 p-0">
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newRelatedProduct}
                        onChange={(e) => setNewRelatedProduct(e.target.value)}
                        placeholder="Product ID or SKU"
                        onKeyPress={(e) => e.key === 'Enter' && addRelatedProduct()}
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 flex-1"
                      />
                      <Button type="button" onClick={addRelatedProduct} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {errors.relatedProducts && <p className="text-red-400 text-xs mt-1">{errors.relatedProducts.message}</p>}
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-300">Allergens</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {allergens.map((allergen, index) => (
                        <Badge key={allergen.id} variant="secondary" className="bg-gray-700 text-gray-300 flex items-center gap-1 border-gray-600">
                          {allergen}
                          <Button variant="ghost" size="sm" onClick={() => removeAllergen(index)} className="h-4 w-4 p-0">
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newAllergen}
                        onChange={(e) => setNewAllergen(e.target.value)}
                        placeholder="Add allergen"
                        onKeyPress={(e) => e.key === 'Enter' && addAllergen()}
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 flex-1"
                      />
                      <Button type="button" onClick={addAllergen} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {errors.allergens && <p className="text-red-400 text-xs mt-1">{errors.allergens.message}</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-700 shadow-lg">
              <CardHeader className="bg-gray-800 border-b-gray-700">
                <CardTitle className="flex items-center gap-2 text-white">
                  <div className="w-2 h-6 bg-orange-400 rounded-full"></div>
                  Images & Media
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-gray-200">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors bg-gray-800">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Upload product images</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 10MB each. Multiple files supported.</p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Upload className="w-4 h-4" />
                      Choose Files
                    </Button>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Additional Images (URLs)</Label>
                    <Input
                      {...register('additionalImages')}
                      onChange={(e) => setValue('additionalImages', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      placeholder="Comma-separated image URLs"
                      className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.additionalImages && <p className="text-red-400 text-xs mt-1">{errors.additionalImages.message}</p>}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Video Links</Label>
                    <Input
                      {...register('videoLinks')}
                      onChange={(e) => setValue('videoLinks', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      placeholder="Comma-separated video URLs"
                      className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.videoLinks && <p className="text-red-400 text-xs mt-1">{errors.videoLinks.message}</p>}
                  </div>
                  {getValues('virtualProduct') && (
                    <div>
                      <Label htmlFor="digitalDownloadLink" className="text-sm font-medium text-gray-300">Digital Download Link</Label>
                      <Input
                        id="digitalDownloadLink"
                        {...register('digitalDownloadLink')}
                        className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Secure download link"
                      />
                      {errors.digitalDownloadLink && <p className="text-red-400 text-xs mt-1">{errors.digitalDownloadLink.message}</p>}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-gray-900 border-gray-700 shadow-lg">
              <CardHeader className="bg-gray-800 border-b-gray-700">
                <CardTitle className="text-lg text-white">Status & Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6 text-gray-200">
                <div>
                  <Label className="text-sm font-medium text-gray-300">Status *</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600 text-white">
                          <SelectItem value="draft" className="hover:bg-gray-700">Draft</SelectItem>
                          <SelectItem value="active" className="hover:bg-gray-700">Active</SelectItem>
                          <SelectItem value="inactive" className="hover:bg-gray-700">Inactive</SelectItem>
                          <SelectItem value="pending" className="hover:bg-gray-700">Pending</SelectItem>
                          <SelectItem value="archived" className="hover:bg-gray-700">Archived</SelectItem>
                          <SelectItem value="published" className="hover:bg-gray-700">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && <p className="text-red-400 text-xs mt-1">{errors.status.message}</p>}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-300">Available</Label>
                    <Controller
                      name="isAvailable"
                      control={control}
                      render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                    />
                    {errors.isAvailable && <p className="text-red-400 text-xs mt-1">{errors.isAvailable.message}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-300">Featured</Label>
                    <Controller
                      name="isFeatured"
                      control={control}
                      render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                    />
                    {errors.isFeatured && <p className="text-red-400 text-xs mt-1">{errors.isFeatured.message}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-300">Eco-Friendly</Label>
                    <Controller
                      name="ecoFriendly"
                      control={control}
                      render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                    />
                    {errors.ecoFriendly && <p className="text-red-400 text-xs mt-1">{errors.ecoFriendly.message}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-300">Gift Card</Label>
                    <Controller
                      name="isGiftCard"
                      control={control}
                      render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                    />
                    {errors.isGiftCard && <p className="text-red-400 text-xs mt-1">{errors.isGiftCard.message}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-300">Gift Wrapping</Label>
                    <Controller
                      name="giftWrappingAvailable"
                      control={control}
                      render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                    />
                    {errors.giftWrappingAvailable && <p className="text-red-400 text-xs mt-1">{errors.giftWrappingAvailable.message}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-300">Pre-Order</Label>
                    <Controller
                      name="preOrder"
                      control={control}
                      render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                    />
                    {errors.preOrder && <p className="text-red-400 text-xs mt-1">{errors.preOrder.message}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-300">Subscription</Label>
                    <Controller
                      name="isSubscription"
                      control={control}
                      render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                    />
                    {errors.isSubscription && <p className="text-red-400 text-xs mt-1">{errors.isSubscription.message}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-300">Virtual Product</Label>
                    <Controller
                      name="virtualProduct"
                      control={control}
                      render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                    />
                    {errors.virtualProduct && <p className="text-red-400 text-xs mt-1">{errors.virtualProduct.message}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="availability" className="text-sm font-medium text-gray-300">Availability</Label>
                  <Input
                    id="availability"
                    {...register('availability')}
                    className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.availability && <p className="text-red-400 text-xs mt-1">{errors.availability.message}</p>}
                </div>
                <div>
                  <Label htmlFor="ageRestriction" className="text-sm font-medium text-gray-300">Age Restriction</Label>
                  <Input
                    id="ageRestriction"
                    {...register('ageRestriction')}
                    className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.ageRestriction && <p className="text-red-400 text-xs mt-1">{errors.ageRestriction.message}</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 shadow-lg">
              <CardHeader className="bg-gray-800 border-b-gray-700">
                <CardTitle className="text-lg text-white">SEO & Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6 text-gray-200">
                <div>
                  <Label htmlFor="metaTitle" className="text-sm font-medium text-gray-300">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    {...register('metaTitle')}
                    className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.metaTitle && <p className="text-red-400 text-xs mt-1">{errors.metaTitle.message}</p>}
                </div>
                
                            <div>
                  <Label htmlFor="metaDescription" className="text-sm font-medium text-gray-300">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    {...register('metaDescription')}
                    className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter meta description for SEO"
                  />
                  {errors.metaDescription && <p className="text-red-400 text-xs mt-1">{errors.metaDescription.message}</p>}
                </div>
                <div>
                  <Label htmlFor="slug" className="text-sm font-medium text-gray-300">Slug</Label>
                  <Input
                    id="slug"
                    {...register('slug')}
                    className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter URL slug (auto-generated if empty)"
                  />
                  {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
                </div>
                <div>
                  <Label htmlFor="returnPolicy" className="text-sm font-medium text-gray-300">Return Policy</Label>
                  <Textarea
                    id="returnPolicy"
                    {...register('returnPolicy')}
                    className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter return policy details"
                  />
                  {errors.returnPolicy && <p className="text-red-400 text-xs mt-1">{errors.returnPolicy.message}</p>}
                </div>
                <div>
                  <Label htmlFor="warranty" className="text-sm font-medium text-gray-300">Warranty</Label>
                  <Input
                    id="warranty"
                    {...register('warranty')}
                    className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter warranty information"
                  />
                  {errors.warranty && <p className="text-red-400 text-xs mt-1">{errors.warranty.message}</p>}
                </div>
                <div>
                  <Label htmlFor="returnPeriod" className="text-sm font-medium text-gray-300">Return Period (days)</Label>
                  <Input
                    id="returnPeriod"
                    type="number"
                    {...register('returnPeriod', { valueAsNumber: true })}
                    className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter return period in days"
                  />
                  {errors.returnPeriod && <p className="text-red-400 text-xs mt-1">{errors.returnPeriod.message}</p>}
                </div>
                <div>
                  <Label htmlFor="shippingDetails" className="text-sm font-medium text-gray-300">Shipping Details</Label>
                  <Textarea
                    id="shippingDetails"
                    {...register('shippingDetails')}
                    className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter shipping details"
                  />
                  {errors.shippingDetails && <p className="text-red-400 text-xs mt-1">{errors.shippingDetails.message}</p>}
                </div>
                <div>
                  <Label htmlFor="productOrigin" className="text-sm font-medium text-gray-300">Product Origin</Label>
                  <Input
                    id="productOrigin"
                    {...register('productOrigin')}
                    className="mt-1 bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter country of origin"
                  />
                  {errors.productOrigin && <p className="text-red-400 text-xs mt-1">{errors.productOrigin.message}</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 shadow-lg">
              <CardHeader className="bg-gray-800 border-b-gray-700">
                <CardTitle className="text-lg text-white">Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    onClick={handleFormSubmit((data) => onSubmit(data, 'draft'))}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button
                    type="button"
                    onClick={handleFormSubmit((data) => onSubmit(data, 'published'))}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Publish Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Define the ProductData interface (for TypeScript type safety)
interface ProductData {
  title: string;
  sku: string;
  productType?: 'physical' | 'digital' | 'service';
  categories: string[];
  category: string;
  descriptions: {
    en: string;
    es?: string;
  };
  status: 'active' | 'inactive' | 'draft' | 'pending' | 'archived' | 'published';
  price: number;
  discount?: number;
  costPrice?: number;
  retailPrice?: number;
  salePrice?: number;
  trackInventory: 'yes' | 'no' | '';
  currentStockLevel: number;
  lowStockLevel: number;
  stock: number;
  manufacturerPartNumber?: string;
  brand?: string;
  overview?: string;
  total_view?: number;
  slug?: string;
  productUPCEAN?: string;
  seo_info?: Record<string, string>;
  tags?: string[];
  reviews?: string[];
  features?: string[];
  specifications?: Record<string, string>;
  isFeatured?: boolean;
  isAvailable?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdBy?: string;
  updatedBy?: string;
  returnPolicy?: string;
  warranty?: string;
  shippingDetails?: string;
  additionalImages?: string[];
  customAttributes?: Record<string, string>;
  videoLinks?: string[];
  availability?: string;
  ecoFriendly?: boolean;
  ageRestriction?: string;
  dimensions?: string;
  weight?: number;
  shippingWeight?: number;
  discountStartDate?: string;
  discountEndDate?: string;
  relatedProducts?: string[];
  isGiftCard?: boolean;
  giftCardValue?: number;
  productBundle?: boolean;
  bundleContents?: { product: string; quantity: number }[];
  purchaseLimit?: number;
  bulkDiscounts?: { quantity: number; discountAmount: number }[];
  giftWrappingAvailable?: boolean;
  preOrder?: boolean;
  preOrderDate?: string;
  isSubscription?: boolean;
  subscriptionDetails?: string;
  productOrigin?: string;
  allergens?: string[];
  returnPeriod?: number;
  customShippingOptions?: Record<string, string>;
  virtualProduct?: boolean;
  digitalDownloadLink?: string;
  variants?: {
    id: string;
    name: string;
    sku: string;
    price: number;
    retailPrice?: number;
    stock: number;
    lowStockLevel: number;
    productUPCEAN?: string;
    description?: string;
    images?: string[];
    attributes: {
      size?: string;
      color?: string;
      material?: string;
    };
    features?: string[];
    specifications?: Record<string, string>;
    weight?: number;
    dimensions?: string;
  }[];
}