import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import * as XLSX from 'xlsx'; // For Excel export
import { ColumnProps, DataTableProps } from '../../../components/input/types/type';



const KanbanBoard: React.FC<{ data: any[]; columns: ColumnProps[] }> = ({ data, columns }) => {
    // Group data by status (or any other field you want to use for Kanban columns)
    const groupedData = data.reduce((acc, row) => {
        const status = row.status; // Assuming 'status' is the field to group by
        if (!acc[status]) {
            acc[status] = [];
        }
        acc[status].push(row);
        return acc;
    }, {} as { [key: string]: any[] });

    return (
        <div className="flex space-x-4 p-4">
            {Object.entries(groupedData).map(([status, tasks]) => (
                <div key={status} className="flex-1 bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-lg font-bold mb-4">{status}</h2>
                    {tasks.map((task, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow mb-4">
                            {columns.map((column) => (
                                <div key={column.field} className="mb-2">
                                    <strong>{column.header}: </strong>
                                    {column.body ? column.body(task[column.field], task) : task[column.field]}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export const Table: React.FC<DataTableProps> = ({
    value,
    children,
    filterable = false,
    pagination = false,
    rowsPerPage = 10,
    groupField,
    editable = false,
    onEdit,
    exportToExcel = false,
    convertToKanban = false,
    onConvertToKanban,
    treeTable = false,
    treeField,
}) => {
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filter, setFilter] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
    const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
    const [editingCell, setEditingCell] = useState<{ rowIndex: number; field: string } | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [isKanban, setIsKanban] = useState<boolean>(false);

    // Sorting logic
    const sortedData = [...value].sort((a, b) => {
        if (!sortField) return 0;
        if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    // Filtering logic
    const filteredData = filterable
        ? sortedData.filter((row) =>
              Object.values(row).some((val) =>
                  String(val).toLowerCase().includes(filter.toLowerCase())
              )
          )
        : sortedData;

    // Grouping logic
    const groupedData = groupField
        ? filteredData.reduce((acc, row) => {
              const key = row[groupField];
              if (!acc[key]) {
                  acc[key] = [];
              }
              acc[key].push(row);
              return acc;
          }, {} as { [key: string]: any[] })
        : null;

    // Tree table logic
    const buildTree: any = (data: any[], parentId = null) => {
        return data
            .filter((item) => item.parentId === parentId)
            .map((item) => ({
                ...item,
                children: buildTree(data, item.id),
            }));
    };

    const treeData = treeTable && treeField ? buildTree(filteredData) : null;

    // Flatten grouped data for pagination
    const dataToDisplay = groupField
        ? Object.values(groupedData!).flat()
        : treeTable && treeField
        ? treeData!
        : filteredData;

    // Pagination logic
    const totalPages = Math.ceil(dataToDisplay.length / rowsPerPage);
    const paginatedData = pagination
        ? dataToDisplay.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
        : dataToDisplay;

    // Handle sorting
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    // Handle filtering
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
        setCurrentPage(1); // Reset to first page when filtering
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle group toggling
    const toggleGroup = (groupKey: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupKey]: !prev[groupKey],
        }));
    };

    // Handle row toggling for tree table
    const toggleRow = (rowId: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [rowId]: !prev[rowId],
        }));
    };

    // Handle cell editing
    const handleEdit = (row: any, field: string, value: any) => {
        if (onEdit) {
            onEdit(row, field, value);
        }
    };

    // Handle Excel export
    const handleExportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'data.xlsx');
    };

    // Handle Kanban conversion
    const handleConvertToKanban = () => {
        setIsKanban(!isKanban);
        if (onConvertToKanban) {
            onConvertToKanban(filteredData);
        }
    };

    // Handle cell click to start editing
    const handleCellClick = (rowIndex: number, field: string, value: string) => {
        setEditingCell({ rowIndex, field });
        setEditValue(value);
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value);
    };

    // Handle input blur or enter key press to save changes
    const handleInputBlurOrEnter = (row: any, field: string) => {
        if (editingCell) {
            handleEdit(row, field, editValue);
            setEditingCell(null);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            {/* Filter Input */}
            {filterable && (
                <input
                    type="text"
                    placeholder="Filter..."
                    value={filter}
                    onChange={handleFilterChange}
                    className="mb-4 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}

            {/* Export to Excel Button */}
            {exportToExcel && (
                <button
                    onClick={handleExportToExcel}
                    className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                    Export to Excel
                </button>
            )}

            {/* Convert to Kanban Button */}
            {convertToKanban && (
                <button
                    onClick={handleConvertToKanban}
                    className="mb-4 ml-2 px-4 py-2 bg-purple-500 text-white rounded-lg"
                >
                    {isKanban ? 'Convert to Table' : 'Convert to Kanban'}
                </button>
            )}

            {isKanban ? (
                <KanbanBoard data={filteredData} columns={React.Children.toArray(children) as ColumnProps[]} />
            ) : (
                <>
                    {/* Table */}
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {React.Children.map(children, (column) => (
                                    <th
                                        key={column.props.field}
                                        onClick={() =>
                                            column.props.sortable && handleSort(column.props.field)
                                        }
                                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                                            column.props.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                                        }`}
                                    >
                                        {column.props.header}
                                        {sortField === column.props.field && (
                                            <span className="ml-2">
                                                {sortOrder === 'asc' ? '▲' : '▼'}
                                            </span>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {groupField
                                ? Object.entries(groupedData!).map(([groupKey, groupRows]) => (
                                      <React.Fragment key={groupKey}>
                                          <tr
                                              className="bg-blue-50 cursor-pointer"
                                              onClick={() => toggleGroup(groupKey)}
                                          >
                                              <td
                                                  colSpan={React.Children.count(children)}
                                                  className="px-6 py-3 font-bold text-gray-700"
                                              >
                                                  <div className="flex items-center">
                                                      {expandedGroups[groupKey] ? (
                                                          <FaChevronDown className="mr-2" />
                                                      ) : (
                                                          <FaChevronRight className="mr-2" />
                                                      )}
                                                      <span className="text-sky-900">
                                                          {groupKey} ({groupRows.length} items)
                                                      </span>
                                                  </div>
                                              </td>
                                          </tr>
                                          {expandedGroups[groupKey] &&
                                              groupRows.map((row, rowIndex) => (
                                                  <tr key={rowIndex} className="hover:bg-gray-50">
                                                      {React.Children.map(children, (column) => {
                                                          const cellData = row[column.props.field];
                                                          const isEditing =
                                                              editingCell &&
                                                              editingCell.rowIndex === rowIndex &&
                                                              editingCell.field === column.props.field;

                                                          return (
                                                              <td
                                                                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                                  onClick={() =>
                                                                      column.props.editable &&
                                                                      handleCellClick(
                                                                          rowIndex,
                                                                          column.props.field,
                                                                          cellData
                                                                      )
                                                                  }
                                                              >
                                                                  {isEditing ? (
                                                                      <input
                                                                          type="text"
                                                                          value={editValue}
                                                                          onChange={handleInputChange}
                                                                          onBlur={() =>
                                                                              handleInputBlurOrEnter(
                                                                                  row,
                                                                                  column.props.field
                                                                              )
                                                                          }
                                                                          onKeyPress={(e) => {
                                                                              if (e.key === 'Enter') {
                                                                                  handleInputBlurOrEnter(
                                                                                      row,
                                                                                      column.props.field
                                                                                  );
                                                                              }
                                                                          }}
                                                                          className="border border-gray-300 rounded-lg p-1"
                                                                          autoFocus
                                                                      />
                                                                  ) : column.props.body ? (
                                                                      column.props.body(cellData, row)
                                                                  ) : (
                                                                      cellData
                                                                  )}
                                                              </td>
                                                          );
                                                      })}
                                                  </tr>
                                              ))}
                                      </React.Fragment>
                                  ))
                                : paginatedData.map((row, rowIndex) => (
                                      <tr key={rowIndex} className="hover:bg-gray-50">
                                          {React.Children.map(children, (column) => {
                                              const cellData = row[column.props.field];
                                              const isEditing =
                                                  editingCell &&
                                                  editingCell.rowIndex === rowIndex &&
                                                  editingCell.field === column.props.field;

                                              return (
                                                  <td
                                                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                      onClick={() =>
                                                          column.props.editable &&
                                                          handleCellClick(rowIndex, column.props.field, cellData)
                                                      }
                                                  >
                                                      {isEditing ? (
                                                          <input
                                                              type="text"
                                                              value={editValue}
                                                              onChange={handleInputChange}
                                                              onBlur={() =>
                                                                  handleInputBlurOrEnter(row, column.props.field)
                                                              }
                                                              onKeyPress={(e) => {
                                                                  if (e.key === 'Enter') {
                                                                      handleInputBlurOrEnter(
                                                                          row,
                                                                          column.props.field
                                                                      );
                                                                  }
                                                              }}
                                                              className="border border-gray-300 rounded-lg p-1"
                                                              autoFocus
                                                          />
                                                      ) : column.props.body ? (
                                                          column.props.body(cellData, row)
                                                      ) : (
                                                          cellData
                                                      )}
                                                  </td>
                                              );
                                          })}
                                      </tr>
                                  ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {pagination && (
                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// Column component (used for configuration)
export const Column: React.FC<ColumnProps> = ({ field, header, sortable, body, editable }) => {
    return null;
};