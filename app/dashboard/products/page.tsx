import { db } from "@/server";
import placeHolder from "@/public/placeholder_small.jpg";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Products() {
  const products = await db.query.products.findMany({
    orderBy: (products, { desc }) => [desc(products.id)],
  });

  if (!products) throw new Error("No Products Found");

  const dataTable = products.map((p) => {
    return {
      id: p.id,
      title: p.title,
      price: p.price,
      variants: [],
      image: placeHolder.src,
    };
  });

  if (!dataTable) throw new Error("No Data-Table");

  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
}
