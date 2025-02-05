import * as React from "react";
import { Column, Table } from "../components/Table";

const BasicDataGrid: React.FC = () => {

  const products = [
    { code: '001', name: 'Product 1', category: 'Electronics', quantity: 10 },
    { code: '002', name: 'Product 2', category: 'Clothing', quantity: 20 },
    { code: '003', name: 'Product 3', category: 'Electronics', quantity: 15 },
    { code: '004', name: 'Product 4', category: 'Home', quantity: 5 },
    { code: '005', name: 'Product 5', category: 'Clothing', quantity: 30 },
  ];

  const data = [
    { id: 1, name: 'John Doe', age: 28, address: '123 Main St', parentId: null },
    { id: 2, name: 'Jane Smith', age: 34, address: '456 Elm St', parentId: 1 },
    { id: 3, name: 'Alice Johnson', age: 22, address: '789 Oak St', parentId: 1 },
    { id: 4, name: 'Bob Brown', age: 45, address: '101 Pine St', parentId: null },
    { id: 5, name: 'Charlie Davis', age: 30, address: '202 Maple St', parentId: 4 },
];

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Basic Data Grid</h1>
      <Table
        value={data}
        filterable
        pagination
        rowsPerPage={5}
        editable
        onEdit={(row, field, value) => console.log('Edited:', row, field, value)}
        exportToExcel
        convertToKanban
        onConvertToKanban={(data) => console.log('Converted to Kanban:', data)}
        treeTable
      >
        <Column field="name" header="Name" sortable editable />
        <Column field="age" header="Age" sortable />
        <Column field="address" header="Address" />
      </Table>
      <Table value={products} >
        <Column field="code" header="Code" sortable />
        <Column field="name" header="Name" sortable />
        <Column field="category" header="Category" />
        <Column field="quantity" header="Quantity" />
      </Table>

      <Table value={products} groupField="category" >
        <Column field="code" header="Code" sortable />
        <Column field="name" header="Name" sortable />
        <Column field="category" header="Category" />
        <Column field="quantity" header="Quantity" />
      </Table>
      <Table value={products} pagination >
        <Column field="code" header="Code" sortable />
        <Column field="name" header="Name" sortable />
        <Column field="category" header="Category" />
        <Column field="quantity" header="Quantity" />
      </Table>
      <Table value={products} rowsPerPage={3}>
        <Column field="code" header="Code" sortable />
        <Column field="name" header="Name" sortable />
        <Column field="category" header="Category" />
        <Column field="quantity" header="Quantity" />
      </Table>
      <Table value={products} groupField="category" filterable pagination rowsPerPage={3}>
        <Column field="code" header="Code" />
        <Column field="name" header="Name" />
        <Column field="category" header="Category" />
        <Column field="quantity" header="Quantity" />
      </Table>

    </div>
  );
};

export default BasicDataGrid;
