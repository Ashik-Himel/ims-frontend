"use client";

import { Package, TrendingUp, Users } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for sellers and their products
const sellerData = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    totalProducts: 248,
    activeProducts: 230,
    lowStockProducts: 15,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    totalProducts: 356,
    activeProducts: 340,
    lowStockProducts: 22,
  },
  {
    id: "3",
    name: "Michael Wilson",
    email: "michael@example.com",
    totalProducts: 412,
    activeProducts: 395,
    lowStockProducts: 18,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    totalProducts: 268,
    activeProducts: 250,
    lowStockProducts: 10,
  },
];

// Calculate total products across all sellers
const totalProducts = sellerData.reduce(
  (sum, seller) => sum + seller.totalProducts,
  0
);

export default function AdminDashboardPage() {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the admin dashboard. Manage users and system settings.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Sellers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sellerData.length}</div>
              <p className="text-xs text-muted-foreground">
                +1 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                +346 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Health
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">
                +2% from last week
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Seller Product Summary</CardTitle>
            <CardDescription>
              Overview of products managed by each seller
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Seller Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Total Products</TableHead>
                  <TableHead className="text-right">Active Products</TableHead>
                  <TableHead className="text-right">Low Stock Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellerData.map((seller) => (
                  <TableRow key={seller.id}>
                    <TableCell className="font-medium">{seller.name}</TableCell>
                    <TableCell>{seller.email}</TableCell>
                    <TableCell className="text-right">
                      {seller.totalProducts}
                    </TableCell>
                    <TableCell className="text-right">
                      {seller.activeProducts}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium text-yellow-600">
                        {seller.lowStockProducts}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
