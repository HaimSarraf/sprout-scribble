import { db } from "@/server";
import { auth } from "@/server/auth";
import { orders } from "@/server/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { formatDistance, subMinutes } from "date-fns";
import { Dialog, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";

export default async function Orders() {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userID, user.user.id),
    with: {
      orderProduct: {
        with: {
          product: true,
          order: true,
          productVariants: {
            with: {
              variantImages: true,
            },
          },
        },
      },
    },
  });

  if (userOrders) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>Check The Status Of Your Orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            {/* <TableCaption>A list of your recent orders</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        order.status === "succeeded"
                          ? "bg-green-700"
                          : "bg-secondary-foreground"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {formatDistance(subMinutes(order.created!, 0), new Date(), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"ghost"}>
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <DialogTrigger>
                              <Button className="w-full" variant={"ghost"}>
                                View Details
                              </Button>
                            </DialogTrigger>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogHeader>
                        <DialogTitle>Order Details #{order.id}</DialogTitle>
                      </DialogHeader>
                      <Card className="overflow-auto p-2 flex flex-col gap-4">
                        {order.orderProduct.map(
                          ({ product, productVariants }) => (
                            <div key={product.id} className="flex items-center">
                              <Image
                                src={productVariants.variantImages[0].url}
                                alt={product.title}
                                width={48}
                                height={48}
                              />
                              <div>
                                <p>{product.title}</p>
                                <p>{productVariants.productType}</p>
                              </div>
                              <div>
                                <p>Price : ${product.price}</p>
                              </div>
                            </div>
                          )
                        )}
                      </Card>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <div className="place-self-center justify-self-center">
        No Orders Found
      </div>
    );
  }
}
