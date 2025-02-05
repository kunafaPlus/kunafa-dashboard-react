import * as React from "react";
import { EditableDataGrid } from "../components/EditableDataGrid";

interface Item {
  id: number;
  name: string;
  age: number;
  isActive: boolean;
  department: string;
}

const EditableDataGridExample: React.FC = () => {
  const departments = [
    { label: "Engineering", value: "Engineering" },
    { label: "Marketing", value: "Marketing" },
    { label: "Sales", value: "Sales" },
    { label: "HR", value: "HR" },
  ];

  const initialData: Item[] = [
    {
      id: 1,
      name: "John Doe",
      age: 28,
      isActive: true,
      department: "Engineering",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 34,
      isActive: false,
      department: "Marketing",
    },
    {
      id: 3,
      name: "Samuel Green",
      age: 45,
      isActive: true,
      department: "Sales",
    },
  ];

  const [data, setData] = React.useState<Item[]>(initialData);

  const columns = [
    {
      field: "name",
      header: "Name",
      editable: true,
      type: "text",
      exportable: true,
      validation: (value: string) => (!value ? "Name is required" : undefined),
    },
    {
      field: "age",
      header: "Age",
      editable: true,
      type: "number",
      exportable: true,
      validation: (value: number) => (value < 0 ? "Age must be positive" : undefined),
    },
    {
      field: "isActive",
      header: "Active",
      editable: true,
      type: "boolean",
      exportable: true,
    },
    {
      field: "department",
      header: "Department",
      editable: true,
      type: "select",
      options: departments,
      exportable: true,
    },
  ];

  const handleDataChange = (newData: Item[]) => {
    setData(newData);
  };

  const handleCellChange = (item: Item, field: keyof Item, value: any) => {
    console.log(`Cell changed: ${item.id}, Field: ${field}, Value: ${value}`);
  };

  const handleValidationError = (error: string) => {
    console.error("Validation Error:", error);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Editable Data Grid</h1>
      <EditableDataGrid
        data={data}
        columns={columns}
        onDataChange={handleDataChange}
        onCellChange={handleCellChange}
        onValidationError={handleValidationError}
      />
    </div>
  );
};

export default EditableDataGridExample;
