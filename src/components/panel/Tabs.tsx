import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from '../../utils/cn';
import { TabProps, TabsProps } from "./types";
import { tabContentVariants, tabsRootVariants, tabTriggerVariants } from "./variants";

// تعريف الأنماط الأساسية للمكونات


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