import { Routes } from '@angular/router';
import { Home, resolveFeaturedProduct, resolveNewProduct } from './components/manage/home/home';
import { Categories, resolveCategories } from './components/manage/categories/categories';
import { CategoryForm } from './components/manage/category-form/category-form';
import { resolveBrands } from './components/manage/brands/brands';
import { BrandForm } from './components/manage/brand-form/brand-form';
import { Brands } from './components/manage/brands/brands';
import { Products, resolveProducts } from './components/manage/products/products';
import { ProductForm, resolveEditProduct } from './components/manage/product-form/product-form';
import { ProductList, resolveProductQuery } from './components/product-list/product-list';
import { ProductDetail } from './components/product-detail/product-detail';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { LandingPage } from './components/landing-page/landing-page';
import { adminGuard, authGuard } from './guards/auth-guard';
import { AdminDashboard } from './manage/admin-dashboard/admin-dashboard';
import { CustomerProfile } from './manage/customer-profile/customer-profile';
import { reolveProduct } from './components/product-detail/product-detail';
import { Wishlist } from './components/wishlist/wishlist';
import { Cart } from './components/cart/cart';
import { Checkout } from './components/checkout/checkout';
import { UserOrders } from './components/user-orders/user-orders';
import { AdminOrders, resolveAdminOrders } from './components/admin-orders/admin-orders';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    canActivate: [authGuard],
    resolve: {
      newProduct: resolveNewProduct,
      featuredProduct: resolveFeaturedProduct,
    },
    children: [
      {
        path: '',
        component: LandingPage,
      },
      {
        path: 'profile',
        component: CustomerProfile,
      },
      {
        path: 'products',
        component: ProductList,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        resolve: {
          products: resolveProductQuery,
          brands: resolveBrands,
        },
      },
      {
        path: 'product/:id',
        component: ProductDetail,
        resolve: {
          product: reolveProduct,
        },
      },
      {
        path: 'wishlist',
        component: Wishlist,
      },
      {
        path: 'cart',
        component: Cart,
      },
      {
        path: 'checkout',
        component: Checkout,
      },
      {
        path: 'orders',
        component: UserOrders,
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    component: AdminDashboard,
    children: [
      {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full',
      },
      {
        path: 'categories',
        component: Categories,
        resolve: {
          categories: resolveCategories,
        },
      },
      {
        path: 'categories/add',
        component: CategoryForm,
      },
      {
        path: 'categories/:id',
        component: CategoryForm,
      },
      {
        path: 'brands',
        component: Brands,
        resolve: {
          brands: resolveBrands,
        },
      },
      {
        path: 'brands/add',
        component: BrandForm,
      },
      {
        path: 'brands/:id',
        component: BrandForm,
      },
      {
        path: 'products',
        component: Products,
        resolve: {
          products: resolveProducts,
        },
      },
      {
        path: 'products/add',
        component: ProductForm,
      },
      {
        path: 'products/:id',
        component: ProductForm,
        resolve: {
          product: resolveEditProduct,
        },
      },
      {
        path: 'orders',
        component: AdminOrders,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        resolve: {
          adminOrders: resolveAdminOrders,
        },
      },
    ],
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'login',
    component: Login,
  },
];
