import React, { useState } from "react";
import Card from "../../layout/Card";
import useForm from "../../../utils/useForm";
import { Checkbox, CheckboxGroup, Dropdown, Input, RadioInput } from "../component/Input";
import { Switch } from "../component/Switch";


const BasicForm = () => {
    const { register, setValue, errors, formData }=useForm()

  const [radioValue, setRadioValue] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");
  const [switchChecked, setSwitchChecked] = useState<boolean>(false);
  const [checkboxChecked, setCheckboxChecked] = useState<boolean>(false);
  const [checkboxGroupValues, setCheckboxGroupValues] = useState([]);

  const dropdownOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const checkboxGroupOptions = [
    { value: "checkbox1", label: "Checkbox 1" },
    { value: "checkbox2", label: "Checkbox 2" },
    { value: "checkbox3", label: "Checkbox 3" },
  ];

  return (
    <Card title="البيانات الأساسية">
      <Input
        {...register("email", {
          required: "البريد الإلكتروني مطلوب",
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        })}
        label="البريد الإلكتروني"
        placeholder="أدخل بريدك الإلكتروني"
        error={errors.email}
        type="email"
      />
      <RadioInput
        {...register("radio1")}
        id="radio1"
        label="Option 1"
        name="radioGroup"
        checked={radioValue === "option1"}
        onChange={() => {
          setRadioValue("option1");
          setValue("radio1", "option1");
        }}
      />
      <Dropdown
        {...register("dropdown")}
        label="اختر خيارًا"
        name="dropdown"
        options={dropdownOptions}
        value={dropdownValue}
        onChange={(value) => {
          setDropdownValue(value);
          setValue("dropdown", value);
        }}
      />
      <Switch
        {...register("toggle")}
        label="تبديل"
        checked={switchChecked}
        onChange={(checked: any) => {
          setSwitchChecked(checked);
          setValue("toggle", checked);
        }}
      />
      <Checkbox
        {...register("check")}
        label="تحديد"
        checked={checkboxChecked}
        onChange={(checked) => {
          setCheckboxChecked(checked);
          setValue("check", checked);
        }}
      />
      <CheckboxGroup
        {...register("select")}
        label="اختر الخيارات"
        options={checkboxGroupOptions}
        selectedValues={checkboxGroupValues}
        onChange={(values:any) => {
          setCheckboxGroupValues(values);
          setValue("select", values);
        }}
      />
    </Card>
  );
};

export default BasicForm;