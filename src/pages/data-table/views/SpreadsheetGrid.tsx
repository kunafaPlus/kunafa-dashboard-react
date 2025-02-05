import * as React from "react";
import { SpreadsheetGrid } from "../components/SpreadsheetGrid";
import { Cell } from "../../data-table/types";

const SpreadsheetGridExample: React.FC = () => {
  const initialData: Cell[][] = [
    [
      { value: "Hello", formula: "=A1+B1" },
      { value: "World", formula: "=A1-B1" },
    ],
    [
      { value: "10", formula: "=A1*2" },
      { value: "20", formula: "=B1/2" },
    ],
  ];

  const handleCellChange = (row: number, col: number, cell: Cell) => {
    console.log(`Cell changed at ${row},${col}:`, cell);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Spreadsheet Grid</h1>
      <SpreadsheetGrid
        data={initialData}
        columns={5}
        rows={10}
        className="custom-spreadsheet"
        cellClassName="custom-cell"
        headerClassName="custom-header"
        selectedCellClassName="custom-selected-cell"
        onChange={(newData) => console.log("Data changed:", newData)}
        onCellChange={handleCellChange}
      />
    </div>
  );
};

export default SpreadsheetGridExample;
