import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';
import { TreeNode, TreeSelectProps } from '../utils/type';

const treeSelectVariants = cva('w-full', {
  variants: {
    variant: {
      default: '[&_input]:border [&_input]:rounded-md',
      filled: '[&_input]:bg-muted [&_input]:border-b',
      ghost: '[&_input]:bg-transparent [&_input]:border-b',
    },
    size: {
      sm: '[&_input]:text-sm [&_input]:p-2',
      md: '[&_input]:text-base [&_input]:p-3',
      lg: '[&_input]:text-lg [&_input]:p-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const TreeSelect = React.forwardRef<HTMLDivElement, TreeSelectProps>(
  (
    { className, options, value, onChange, label, error, placeholder = 'اختر...', ...props },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValues, setSelectedValues] = React.useState<string[]>(
      Array.isArray(value) ? value : []
    );
    const treeSelectRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (Array.isArray(value)) {
        setSelectedValues(value);
      }
    }, [value]);

    const handleSelect = (nodeValue: string) => {
      const newValues = selectedValues.includes(nodeValue)
        ? selectedValues.filter((v) => v !== nodeValue)
        : [...selectedValues, nodeValue];

      setSelectedValues(newValues);

      if (onChange) {
        onChange({
          target: {
            value: newValues,
          },
        });
      }
    };

    const renderNode = (node: TreeNode, level = 0) => (
      <div key={node.value} style={{ paddingLeft: `${level * 20}px` }}>
        <div
          className={cn(
            'flex items-center p-2 hover:bg-gray-100 cursor-pointer',
            selectedValues.includes(node.value) && 'bg-primary/10'
          )}
          onClick={() => { handleSelect(node.value); }}
        >
          <span>{node.label}</span>
        </div>
        {node.children?.map((child) => renderNode(child, level + 1))}
      </div>
    );

    const getSelectedLabels = () => {
      const findLabel = (nodes: TreeNode[], value: string): string | undefined => {
        for (const node of nodes) {
          if (node.value === value) return node.label;
          if (node.children) {
            const found = findLabel(node.children, value);
            if (found) return found;
          }
        }
        return undefined;
      };

      return selectedValues
        .map((value) => findLabel(options, value))
        .filter((label): label is string => label !== undefined)
        .join(', ');
    };

    // Close the dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (treeSelectRef.current && !treeSelectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    return (
      <div ref={treeSelectRef} className="space-y-2">
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        <div className="relative">
          <div
            className={cn(
              'flex items-center justify-between p-2 border rounded-md cursor-pointer',
              error && 'border-red-500',
              className
            )}
            onClick={() => { setIsOpen(!isOpen); }}
          >
            <span className="truncate">
              {selectedValues.length > 0 ? getSelectedLabels() : placeholder}
            </span>
            <span className="ml-2">▼</span>
          </div>
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {options.map((option) => renderNode(option))}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

TreeSelect.displayName = 'TreeSelect';

export { TreeSelect, type TreeNode };
