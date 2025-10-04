// import { TopListItem } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { TopListItem } from '@/types/product';

interface TopListsProps {
  topLists: {
    recentlyAdded: TopListItem[];
    topDiscounted: TopListItem[];
    lowStock: TopListItem[];
    bestSelling: TopListItem[];
    mostViewed: TopListItem[];
    topRegions: TopListItem[];
    highestReturnRate: TopListItem[];
    recentlyUpdated: TopListItem[];
    topRated: TopListItem[];
  };
}

export function TopLists({ topLists }: TopListsProps) {
  const handleExport = (listName: string) => {
    // Placeholder for CSV/Excel export functionality
    console.log(`Exporting ${listName} data...`);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning':
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error':
      case 'out-of-stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const ListCard = ({ title, items, showImages = false }: { title: string; items: TopListItem[]; showImages?: boolean }) => (
    <Card className="h-fit card-premium hover-lift group">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
        <div>
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">{title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{items.length} items</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => handleExport(title)} className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 p-6">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-all duration-200 hover:shadow-sm cursor-pointer group/item"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="text-xs font-bold text-muted-foreground w-6">
                #{index + 1}
              </div>
              {showImages && item.image && (
                <Avatar className="h-10 w-10 ring-2 ring-border group-hover/item:ring-primary/20 transition-all">
                  <AvatarImage src={item.image} alt={item.name} />
                  <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate group-hover/item:text-primary transition-colors">{item.name}</p>
                {item.subValue && (
                  <p className="text-xs text-muted-foreground mt-1">{item.subValue}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold">{item.value}</span>
              {item.status && (
                <Badge className={`text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8 animate-fade-in">
      <ListCard title="Recently Added Products" items={topLists.recentlyAdded} showImages />
      <ListCard title="Top Discounted Products" items={topLists.topDiscounted} showImages />
      <ListCard title="Low Stock Products" items={topLists.lowStock} />
      <ListCard title="Best Selling Products" items={topLists.bestSelling} showImages />
      <ListCard title="Most Viewed Products" items={topLists.mostViewed} showImages />
      {/* <ListCard title="Top Customers" items={topLists.topCustomers} /> */}

      <ListCard title="Recently Updated" items={topLists.recentlyUpdated} />
      <ListCard title="Top Rated Products" items={topLists.topRated} showImages />
    </div>
  );
}