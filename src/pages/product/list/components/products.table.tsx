//* Packages Imports */
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { FC, useEffect, useState } from "react";

//* Components Imports */
import Product from "../../../../components/content/product.content";

//* Types Imports */
import { ProductTable, TableRecord } from "../../../../interface/common";

const ProductsTable: FC<ProductTable> = ({ list, loading }) => {
  const [dataSource, setDataSource] = useState<TableRecord[]>([]);

  const columns: ColumnsType<TableRecord> = [
    {
      title: "Product",
      dataIndex: "product",
      render: (cellData) => (
        <Product
          content={{
            sku: cellData.sku,
            name: cellData.name,
            variantName: cellData.variantName,
          }}
          image={{
            src: cellData.image,
          }}
        />
      ),
    },
    {
      title: "In Stock",
      dataIndex: "inStock",
    },
    {
      title: "Notes",
      dataIndex: "notes",
    },
  ];

  const createDataSource = (list: any[]) => {
    return list.map(
      (item) =>
        ({
          key: item.id,
          product: {
            sku: item.sku,
            name: item.name,
            variantName: item.variant_name,
            image: item.image_url,
          },
          inStock: item.in_stock,
          note: item.note,
        } as TableRecord)
    );
  };

  useEffect(() => {
    const dataSource = createDataSource(list);
    setDataSource(dataSource);
  }, [list]);
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      loading={loading}
    />
  );
};

export default ProductsTable;
