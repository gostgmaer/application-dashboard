"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, Upload, Image as ImageIcon, Save, Eye } from 'lucide-react';

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

export default function ProductCreate() {
  const [product, setProduct] = useState<ProductData>({
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
      fragile: false
    },
    seo: { 
      title: '', 
      description: '', 
      keywords: '', 
      slug: '',
      canonicalUrl: '',
      robotsMeta: 'index,follow',
      structuredData: ''
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
    augmentedRealityEnabled: false
  });

  const [newTag, setNewTag] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showJsonOutput, setShowJsonOutput] = useState(false);
  const [jsonOutput, setJsonOutput] = useState('');

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      name: `${product.name} - Variant ${product.variants.length + 1}`,
      sku: `${product.sku}-${product.variants.length + 1}`,
      price: product.basePrice,
      comparePrice: product.comparePrice,
      inventory: 0,
      barcode: '',
      trackQuantity: true,
      allowBackorder: false,
      attributes: {}
    };
    setProduct(prev => ({ ...prev, variants: [...prev.variants, newVariant] }));
  };

  const removeVariant = (id: string) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== id)
    }));
  };

  const updateVariant = (id: string, updates: Partial<ProductVariant>) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.map(v => v.id === id ? { ...v, ...updates } : v)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !product.tags.includes(newTag.trim())) {
      setProduct(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setProduct(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const calculateProfitMargin = () => {
    if (product.costPrice > 0 && product.basePrice > 0) {
      const margin = ((product.basePrice - product.costPrice) / product.basePrice) * 100;
      setProduct(prev => ({ ...prev, profitMargin: Math.round(margin * 100) / 100 }));
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };
  const handleSubmit = (status: 'draft' | 'published') => {
    const updatedProduct = { 
      ...product, 
      status,
      seo: {
        ...product.seo,
        slug: product.seo.slug || generateSlug(product.name)
      },
      images,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(updatedProduct, null, 2);
    setJsonOutput(jsonString);
    setShowJsonOutput(true);
    
    console.log('Product JSON:', jsonString);
    // Here you would typically send the data to your API
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
          <p className="text-gray-600 mt-2">Add a new product to your catalog with variants and detailed information.</p>
        </div>

        {/* JSON Output Modal */}
        {showJsonOutput && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Product JSON Output</h3>
                  <Button
                    onClick={() => setShowJsonOutput(false)}
                    variant="outline"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-6 overflow-auto max-h-[60vh]">
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                  <code>{jsonOutput}</code>
                </pre>
              </div>
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <Button
                  onClick={() => navigator.clipboard.writeText(jsonOutput)}
                  variant="outline"
                  className="flex-1"
                >
                  Copy to Clipboard
                </Button>
                <Button
                  onClick={() => setShowJsonOutput(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
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
                    value={product.name}
                    onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                    placeholder="Enter product name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand" className="text-sm font-medium text-gray-700">
                      Brand
                    </Label>
                    <Input
                      id="brand"
                      value={product.brand}
                      onChange={(e) => setProduct(prev => ({ ...prev, brand: e.target.value }))}
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
                      value={product.vendor}
                      onChange={(e) => setProduct(prev => ({ ...prev, vendor: e.target.value }))}
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
                      value={product.manufacturer}
                      onChange={(e) => setProduct(prev => ({ ...prev, manufacturer: e.target.value }))}
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
                      value={product.model}
                      onChange={(e) => setProduct(prev => ({ ...prev, model: e.target.value }))}
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
                      value={product.warranty}
                      onChange={(e) => setProduct(prev => ({ ...prev, warranty: e.target.value }))}
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
                      value={product.origin}
                      onChange={(e) => setProduct(prev => ({ ...prev, origin: e.target.value }))}
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
                    value={product.shortDescription}
                    onChange={(e) => setProduct(prev => ({ ...prev, shortDescription: e.target.value }))}
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
                    value={product.description}
                    onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 min-h-[120px]"
                    placeholder="Detailed product description..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Category *</Label>
                    <Select value={product.category} onValueChange={(value) => setProduct(prev => ({ ...prev, category: value, subcategory: '' }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(categories).map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Subcategory</Label>
                    <Select 
                      value={product.subcategory} 
                      onValueChange={(value) => setProduct(prev => ({ ...prev, subcategory: value }))}
                      disabled={!product.category}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.category && categories[product.category as keyof typeof categories]?.map(subcat => (
                          <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku" className="text-sm font-medium text-gray-700">
                      SKU *
                    </Label>
                    <Input
                      id="sku"
                      value={product.sku}
                      onChange={(e) => setProduct(prev => ({ ...prev, sku: e.target.value }))}
                      className="mt-1"
                      placeholder="Product SKU"
                    />
                  </div>

                  <div>
                    <Label htmlFor="barcode" className="text-sm font-medium text-gray-700">
                      Barcode/UPC
                    </Label>
                    <Input
                      id="barcode"
                      value={product.barcode}
                      onChange={(e) => setProduct(prev => ({ ...prev, barcode: e.target.value }))}
                      className="mt-1"
                      placeholder="Product barcode"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
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
                    <Select value={product.ageGroup} onValueChange={(value) => setProduct(prev => ({ ...prev, ageGroup: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageGroups.map(age => (
                          <SelectItem key={age} value={age}>{age}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Gender</Label>
                    <Select value={product.gender} onValueChange={(value) => setProduct(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genders.map(gender => (
                          <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Season</Label>
                    <Select value={product.season} onValueChange={(value) => setProduct(prev => ({ ...prev, season: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        {seasons.map(season => (
                          <SelectItem key={season} value={season}>{season}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Occasion</Label>
                    <Select value={product.occasion} onValueChange={(value) => setProduct(prev => ({ ...prev, occasion: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select occasion" />
                      </SelectTrigger>
                      <SelectContent>
                        {occasions.map(occasion => (
                          <SelectItem key={occasion} value={occasion}>{occasion}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Style</Label>
                    <Select value={product.style} onValueChange={(value) => setProduct(prev => ({ ...prev, style: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.map(style => (
                          <SelectItem key={style} value={style}>{style}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Pattern</Label>
                    <Select value={product.pattern} onValueChange={(value) => setProduct(prev => ({ ...prev, pattern: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        {patterns.map(pattern => (
                          <SelectItem key={pattern} value={pattern}>{pattern}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="careInstructions" className="text-sm font-medium text-gray-700">
                      Care Instructions
                    </Label>
                    <Textarea
                      id="careInstructions"
                      value={product.careInstructions}
                      onChange={(e) => setProduct(prev => ({ ...prev, careInstructions: e.target.value }))}
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
                      value={product.ingredients}
                      onChange={(e) => setProduct(prev => ({ ...prev, ingredients: e.target.value }))}
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
                      value={product.nutritionalInfo}
                      onChange={(e) => setProduct(prev => ({ ...prev, nutritionalInfo: e.target.value }))}
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
                      value={product.allergens}
                      onChange={(e) => setProduct(prev => ({ ...prev, allergens: e.target.value }))}
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
                      value={product.wholesalePrice}
                      onChange={(e) => setProduct(prev => ({ ...prev, wholesalePrice: parseFloat(e.target.value) }))}
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
                      value={product.msrp}
                      onChange={(e) => setProduct(prev => ({ ...prev, msrp: parseFloat(e.target.value) }))}
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
                      value={product.loyaltyPoints}
                      onChange={(e) => setProduct(prev => ({ ...prev, loyaltyPoints: parseInt(e.target.value) }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Tax Class</Label>
                    <Select value={product.taxClass} onValueChange={(value) => setProduct(prev => ({ ...prev, taxClass: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select tax class" />
                      </SelectTrigger>
                      <SelectContent>
                        {taxClasses.map(taxClass => (
                          <SelectItem key={taxClass} value={taxClass}>{taxClass}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="taxRate" className="text-sm font-medium text-gray-700">
                      Tax Rate (%)
                    </Label>
                    <Input
                      id="taxRate"
                      type="number"
                      value={product.taxRate}
                      onChange={(e) => setProduct(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }))}
                      className="mt-1"
                      step="0.01"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Discount Type</Label>
                    <Select value={product.discountType} onValueChange={(value: typeof product.discountType) => setProduct(prev => ({ ...prev, discountType: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Discount</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="discountValue" className="text-sm font-medium text-gray-700">
                      Discount Value
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      value={product.discountValue}
                      onChange={(e) => setProduct(prev => ({ ...prev, discountValue: parseFloat(e.target.value) }))}
                      className="mt-1"
                      step="0.01"
                      disabled={product.discountType === 'none'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Start Date</Label>
                      <Input
                        type="date"
                        value={product.discountStartDate}
                        onChange={(e) => setProduct(prev => ({ ...prev, discountStartDate: e.target.value }))}
                        className="mt-1"
                        disabled={product.discountType === 'none'}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700">End Date</Label>
                      <Input
                        type="date"
                        value={product.discountEndDate}
                        onChange={(e) => setProduct(prev => ({ ...prev, discountEndDate: e.target.value }))}
                        className="mt-1"
                        disabled={product.discountType === 'none'}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
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
                  <Switch
                    checked={product.shipping.requiresShipping}
                    onCheckedChange={(checked) => setProduct(prev => ({ 
                      ...prev, 
                      shipping: { ...prev.shipping, requiresShipping: checked }
                    }))}
                  />
                </div>

                {product.shipping.requiresShipping && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Shipping Class</Label>
                        <Select 
                          value={product.shipping.shippingClass} 
                          onValueChange={(value) => setProduct(prev => ({ 
                            ...prev, 
                            shipping: { ...prev.shipping, shippingClass: value }
                          }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select shipping class" />
                          </SelectTrigger>
                          <SelectContent>
                            {shippingClasses.map(cls => (
                              <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="handlingTime" className="text-sm font-medium text-gray-700">
                          Handling Time (days)
                        </Label>
                        <Input
                          id="handlingTime"
                          type="number"
                          value={product.shipping.handlingTime}
                          onChange={(e) => setProduct(prev => ({ 
                            ...prev, 
                            shipping: { ...prev.shipping, handlingTime: parseInt(e.target.value) }
                          }))}
                          className="mt-1"
                          min="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor="freeShippingThreshold" className="text-sm font-medium text-gray-700">
                          Free Shipping Threshold
                        </Label>
                        <Input
                          id="freeShippingThreshold"
                          type="number"
                          value={product.shipping.freeShippingThreshold}
                          onChange={(e) => setProduct(prev => ({ 
                            ...prev, 
                            shipping: { ...prev.shipping, freeShippingThreshold: parseFloat(e.target.value) }
                          }))}
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
                          value={product.packageDimensions.length}
                          onChange={(e) => setProduct(prev => ({ 
                            ...prev, 
                            packageDimensions: { ...prev.packageDimensions, length: parseFloat(e.target.value) }
                          }))}
                          className="mt-1"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Package Width (cm)</Label>
                        <Input
                          type="number"
                          value={product.packageDimensions.width}
                          onChange={(e) => setProduct(prev => ({ 
                            ...prev, 
                            packageDimensions: { ...prev.packageDimensions, width: parseFloat(e.target.value) }
                          }))}
                          className="mt-1"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Package Height (cm)</Label>
                        <Input
                          type="number"
                          value={product.packageDimensions.height}
                          onChange={(e) => setProduct(prev => ({ 
                            ...prev, 
                            packageDimensions: { ...prev.packageDimensions, height: parseFloat(e.target.value) }
                          }))}
                          className="mt-1"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Package Weight (kg)</Label>
                        <Input
                          type="number"
                          value={product.packageDimensions.weight}
                          onChange={(e) => setProduct(prev => ({ 
                            ...prev, 
                            packageDimensions: { ...prev.packageDimensions, weight: parseFloat(e.target.value) }
                          }))}
                          className="mt-1"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={product.shipping.hazardousMaterial}
                          onCheckedChange={(checked) => setProduct(prev => ({ 
                            ...prev, 
                            shipping: { ...prev.shipping, hazardousMaterial: checked }
                          }))}
                        />
                        <Label className="text-sm text-gray-700">Hazardous Material</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={product.shipping.fragile}
                          onCheckedChange={(checked) => setProduct(prev => ({ 
                            ...prev, 
                            shipping: { ...prev.shipping, fragile: checked }
                          }))}
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
                {product.variants.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No variants added yet. Click "Add Variant" to create product variations.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {product.variants.map((variant, index) => (
                      <div key={variant.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Variant {index + 1}</h4>
                          <Button
                            onClick={() => removeVariant(variant.id)}
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
                              value={variant.name}
                              onChange={(e) => updateVariant(variant.id, { name: e.target.value })}
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700">SKU</Label>
                            <Input
                              value={variant.sku}
                              onChange={(e) => updateVariant(variant.id, { sku: e.target.value })}
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700">Barcode</Label>
                            <Input
                              value={variant.barcode}
                              onChange={(e) => updateVariant(variant.id, { barcode: e.target.value })}
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700">Price</Label>
                            <Input
                              type="number"
                              value={variant.price}
                              onChange={(e) => updateVariant(variant.id, { price: parseFloat(e.target.value) })}
                              className="mt-1"
                              step="0.01"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700">Compare Price</Label>
                            <Input
                              type="number"
                              value={variant.comparePrice}
                              onChange={(e) => updateVariant(variant.id, { comparePrice: parseFloat(e.target.value) })}
                              className="mt-1"
                              step="0.01"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700">Inventory</Label>
                            <Input
                              type="number"
                              value={variant.inventory}
                              onChange={(e) => updateVariant(variant.id, { inventory: parseInt(e.target.value) })}
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Size</Label>
                            <Select
                              value={variant.attributes.size || ''}
                              onValueChange={(value) => updateVariant(variant.id, { 
                                attributes: { ...variant.attributes, size: value } 
                              })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                {sizes.map(size => (
                                  <SelectItem key={size} value={size}>{size}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700">Color</Label>
                            <Select
                              value={variant.attributes.color || ''}
                              onValueChange={(value) => updateVariant(variant.id, { 
                                attributes: { ...variant.attributes, color: value } 
                              })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select color" />
                              </SelectTrigger>
                              <SelectContent>
                                {colors.map(color => (
                                  <SelectItem key={color} value={color}>{color}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700">Material</Label>
                            <Select
                              value={variant.attributes.material || ''}
                              onValueChange={(value) => updateVariant(variant.id, { 
                                attributes: { ...variant.attributes, material: value } 
                              })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select material" />
                              </SelectTrigger>
                              <SelectContent>
                                {materials.map(material => (
                                  <SelectItem key={material} value={material}>{material}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={variant.trackQuantity}
                              onCheckedChange={(checked) => updateVariant(variant.id, { trackQuantity: checked })}
                            />
                            <Label className="text-sm text-gray-700">Track Quantity</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={variant.allowBackorder}
                              onCheckedChange={(checked) => updateVariant(variant.id, { allowBackorder: checked })}
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
                    value={product.basePrice}
                    onChange={(e) => {
                      setProduct(prev => ({ ...prev, basePrice: parseFloat(e.target.value) }));
                      setTimeout(calculateProfitMargin, 100);
                    }}
                    className="mt-1"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="comparePrice" className="text-sm font-medium text-gray-700">
                    Compare Price
                  </Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    value={product.comparePrice}
                    onChange={(e) => setProduct(prev => ({ ...prev, comparePrice: parseFloat(e.target.value) }))}
                    className="mt-1"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="costPrice" className="text-sm font-medium text-gray-700">
                    Cost Price
                  </Label>
                  <Input
                    id="costPrice"
                    type="number"
                    value={product.costPrice}
                    onChange={(e) => {
                      setProduct(prev => ({ ...prev, costPrice: parseFloat(e.target.value) }));
                      setTimeout(calculateProfitMargin, 100);
                    }}
                    className="mt-1"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Profit Margin
                  </Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <span className="text-lg font-semibold text-green-600">
                      {product.profitMargin.toFixed(2)}%
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
                    value={product.inventory}
                    onChange={(e) => setProduct(prev => ({ ...prev, inventory: parseInt(e.target.value) }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="lowStockThreshold" className="text-sm font-medium text-gray-700">
                    Low Stock Threshold
                  </Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={product.lowStockThreshold}
                    onChange={(e) => setProduct(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) }))}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Track Quantity</Label>
                  <Switch
                    checked={product.trackQuantity}
                    onCheckedChange={(checked) => setProduct(prev => ({ ...prev, trackQuantity: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Allow Backorder</Label>
                  <Switch
                    checked={product.allowBackorder}
                    onCheckedChange={(checked) => setProduct(prev => ({ ...prev, allowBackorder: checked }))}
                  />
                </div>

                <div>
                  <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={product.weight}
                    onChange={(e) => setProduct(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                    className="mt-1"
                    step="0.01"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Length</Label>
                    <Input
                      type="number"
                      value={product.dimensions.length}
                      onChange={(e) => setProduct(prev => ({ 
                        ...prev, 
                        dimensions: { ...prev.dimensions, length: parseFloat(e.target.value) }
                      }))}
                      className="mt-1"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Width</Label>
                    <Input
                      type="number"
                      value={product.dimensions.width}
                      onChange={(e) => setProduct(prev => ({ 
                        ...prev, 
                        dimensions: { ...prev.dimensions, width: parseFloat(e.target.value) }
                      }))}
                      className="mt-1"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Height</Label>
                    <Input
                      type="number"
                      value={product.dimensions.height}
                      onChange={(e) => setProduct(prev => ({ 
                        ...prev, 
                        dimensions: { ...prev.dimensions, height: parseFloat(e.target.value) }
                      }))}
                      className="mt-1"
                      step="0.01"
                    />
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
                    value={product.seo.title}
                    onChange={(e) => setProduct(prev => ({ 
                      ...prev, 
                      seo: { ...prev.seo, title: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Meta Description
                  </Label>
                  <Textarea
                    value={product.seo.description}
                    onChange={(e) => setProduct(prev => ({ 
                      ...prev, 
                      seo: { ...prev.seo, description: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    URL Slug
                  </Label>
                  <Input
                    value={product.seo.slug}
                    onChange={(e) => setProduct(prev => ({ 
                      ...prev, 
                      seo: { ...prev.seo, slug: e.target.value }
                    }))}
                    className="mt-1"
                    placeholder="auto-generated-from-name"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Keywords
                  </Label>
                  <Input
                    value={product.seo.keywords}
                    onChange={(e) => setProduct(prev => ({ 
                      ...prev, 
                      seo: { ...prev.seo, keywords: e.target.value }
                    }))}
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
                  <Select value={product.visibility} onValueChange={(value: 'public' | 'private' | 'password') => setProduct(prev => ({ ...prev, visibility: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="password">Password Protected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {product.visibility === 'password' && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Password</Label>
                    <Input
                      type="password"
                      value={product.password}
                      onChange={(e) => setProduct(prev => ({ ...prev, password: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-gray-700">Publish Date</Label>
                  <Input
                    type="date"
                    value={product.publishDate}
                    onChange={(e) => setProduct(prev => ({ ...prev, publishDate: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Expiry Date (Optional)</Label>
                  <Input
                    type="date"
                    value={product.expiryDate}
                    onChange={(e) => setProduct(prev => ({ ...prev, expiryDate: e.target.value }))}
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
                  <Switch
                    checked={product.featured}
                    onCheckedChange={(checked) => setProduct(prev => ({ ...prev, featured: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleSubmit('draft')}
                    variant="outline"
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button 
                    onClick={() => handleSubmit('published')}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Publish
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