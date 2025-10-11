// permissions/config.ts
export const routePermissions: Record<string, string[]> = {
  "/products": ["view:product"],
  "/products/create": ["create:product"],
  "/products/edit": ["update:product"],
  "/products/delete": ["delete:product"],

  "/categories": ["view:category"],
  "/categories/create": ["create:category"],
  "/categories/edit": ["update:category"],
  "/categories/delete": ["delete:category"],

  "/brands": ["view:brand"],
  "/brands/create": ["create:brand"],
  "/brands/edit": ["update:brand"],
  "/brands/delete": ["delete:brand"],

  "/orders": ["view:order"],
  "/orders/update": ["update:order"],

  "/users": ["view:user"],
  "/users/edit": ["update:user"],
  "/users/delete": ["delete:user"],

  "/roles": ["manage:role"],
  "/settings": ["view:settings"],
};
