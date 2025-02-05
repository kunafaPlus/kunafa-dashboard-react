import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from '../../../utils/cn';

// تعريف الأنماط الأساسية للمكونات
const tabsRootVariants = cva("w-full", {
  variants: {
    orientation: {
      horizontal: "space-y-2",
      vertical: "flex space-x-2",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});



const tabTriggerVariants = cva(
  "inline-flex items-center border-b-2 border-primary  justify-center whitespace-nowrap rounded-sm px-3 py-1.5 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-b-2 rounded-none data-[state=active]:border-primary",
        pill: "rounded-full",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      fullWidth: false,
    },
  }
);

const tabContentVariants = cva("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", {
  variants: {
    variant: {
      default: "",
      bordered: "border rounded-md p-4",
      shadow: "shadow-lg rounded-md p-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// تعريف الخصائص للمكونات
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface TabProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean; // إضافة خاصية لتعطيل التبويب
}

// إنشاء سياق التبويبات
const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: "",
  onValueChange: () => {},
});

// مكون التبويبات
const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value: controlledValue, onValueChange, children, ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || "");
    const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;
    const onChange = onValueChange || setUncontrolledValue;

    return (
      <TabsContext.Provider value={{ value, onValueChange: onChange }}>
        <div ref={ref} className={cn(tabsRootVariants(), className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

// مكون التبويب
const Tab = React.forwardRef<HTMLDivElement, TabProps>(
  ({ value, children, disabled, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = React.useContext(TabsContext);

    const handleClick = () => {
      if (!disabled) {
        onValueChange(value);
      }
    };

    return (
      <div {...props} ref={ref}>
        <button
          role="tab"
          className={cn(tabTriggerVariants(), { 'active': selectedValue === value })}
          aria-selected={selectedValue === value}
          data-state={selectedValue === value ? "active" : "inactive"}
          onClick={handleClick}
          disabled={disabled} // تعطيل الزر إذا كان disabled
          aria-controls={`tabpanel-${value}`} // إضافة aria-controls
          id={`tab-${value}`} // إضافة id
        >
          {children}
        </button>
        {selectedValue === value && (
          <div role="tabpanel" id={`tabpanel-${value}`} className={cn(tabContentVariants())}>
            {children}
          </div>
        )}
      </div>
    );
  }
);

// تعيين أسماء المكونات
Tabs.displayName = "Tabs";
Tab.displayName = "Tab";

// تصدير المكونات
export { Tabs, Tab };

// مثال على كيفية استخدام المكونات
const Example = () => {
  const [selectedTab, setSelectedTab] = React.useState("tab1");

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
      <Tab value="tab1">محتوى التبويب 1</Tab>
      <Tab value="tab2" disabled>محتوى التبويب 2 (معطل)</Tab>
      <Tab value="tab3">محتوى التبويب 3</Tab>
    </Tabs>
  );
};