import React, { useState } from 'react';
import { BsSearch } from 'react-icons/bs';

import useForm from '../../../utils/useForm';
import Card from '../../layout/Card';
import { ColorPicker } from '../component/ColorPicker';
import { CurrencyInput } from '../component/CurrencyInput';
import { CustomInputWithRightText } from '../component/CustomInputWithRightText';
import { CustomSelect } from '../component/CustomSelect';
import { FloatLabel } from '../component/FloatLabel';
import { Checkbox, CheckboxGroup, Dropdown, Input, RadioInput } from '../component/Input';
import { PhoneInput } from '../component/PhoneInput';
import { Select } from '../component/Select';
import { Switch } from '../component/Switch';
import { Toggle } from '../component/Toggle';
import { TreeSelect } from '../component/TreeSelect';

const BasicForm = () => {
  const { register, setValue, errors, formData } = useForm();

  const [radioValue, setRadioValue] = useState('');
  const [dropdownValue, setDropdownValue] = useState('');
  const [switchChecked, setSwitchChecked] = useState<boolean>(false);
  const [checkboxChecked, setCheckboxChecked] = useState<boolean>(false);
  const [checkboxGroupValues, setCheckboxGroupValues] = useState([]);
  const [isToggled, setIsToggled] = useState(false);
  const handleToggleChange = () => {
    setIsToggled(!isToggled);
  };
  const dropdownOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const checkboxGroupOptions = [
    { value: 'checkbox1', label: 'Checkbox 1' },
    { value: 'checkbox2', label: 'Checkbox 2' },
    { value: 'checkbox3', label: 'Checkbox 3' },
  ];

  return (
    <Card title="البيانات الأساسية">
      <Input
        {...register('email', {
          required: 'البريد الإلكتروني مطلوب',
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        })}
        label="البريد الإلكتروني"
        placeholder="أدخل بريدك الإلكتروني"
        error={errors.email}
        type="email"
      />
      <RadioInput
        {...register('radio1')}
        id="radio1"
        label="Option 1"
        name="radioGroup"
        checked={radioValue === 'option1'}
        onChange={() => {
          setRadioValue('option1');
          setValue('radio1', 'option1');
        }}
      />
      <Select
        {...register('country', {
          required: 'الرجاء اختيار الدولة',
        })}
        options={[
          { value: 'sa', label: 'السعودية' },
          { value: 'ae', label: 'الإمارات' },
          { value: 'kw', label: 'الكويت' },
        ]}
        label="الدولة"
        placeholder="اختر الدولة"
        error={errors.country}
      />
      <Dropdown
        {...register('dropdown')}
        label="اختر خيارًا"
        name="dropdown"
        options={dropdownOptions}
        value={dropdownValue}
        onChange={(value) => {
          setDropdownValue(value);
          setValue('dropdown', value);
        }}
      />
      <Switch
        {...register('toggle')}
        label="تبديل"
        checked={switchChecked}
        onChange={(checked: any) => {
          setSwitchChecked(checked);
          setValue('toggle', checked);
        }}
      />
      <Checkbox
        {...register('check')}
        label="تحديد"
        checked={checkboxChecked}
        onChange={(checked) => {
          setCheckboxChecked(checked);
          setValue('check', checked);
        }}
      />
      <CheckboxGroup
        {...register('select')}
        label="اختر الخيارات"
        options={checkboxGroupOptions}
        selectedValues={checkboxGroupValues}
        onChange={(values: any) => {
          setCheckboxGroupValues(values);
          setValue('select', values);
        }}
      />

      <Input
        {...register('email', {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        })}
        label="البريد الإلكتروني"
        placeholder="أدخل بريدك الإلكتروني"
        type="email"
        size={'lg'}
      />
      <Input
        {...register('email', {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        })}
        label="البريد الإلكتروني"
        placeholder="أدخل بريدك الإلكتروني"
        type="email"
        size={'sm'}
      />
      <Input
        {...register('email', {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        })}
        label="البريد الإلكتروني"
        placeholder="أدخل بريدك الإلكتروني"
        type="email"
        endText="text"
      />
      <Input
        {...register('email', {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        })}
        label="البريد الإلكتروني"
        placeholder="أدخل بريدك الإلكتروني"
        type="email"
        icon={<BsSearch />}
      />

      <FloatLabel
        {...register('floatField', {
          required: 'هذا الحقل مطلوب',
        })}
        label="حقل عائم"
        size={'lg'}
      />
      <FloatLabel
        {...register('floatField', {
          required: 'هذا الحقل مطلوب',
        })}
        label="حقل عائم"
        size={'sm'}
      />
      <FloatLabel
        {...register('floatField', {
          required: 'هذا الحقل مطلوب',
        })}
        label="حقل عائم"
        size={'xl'}
      />
      <FloatLabel
        {...register('floatField', {
          required: 'هذا الحقل مطلوب',
        })}
        label="حقل عائم"
        variant={'filled'}
      />
      <FloatLabel
        {...register('floatField', {
          required: 'هذا الحقل مطلوب',
        })}
        label="حقل عائم"
        variant={'ghost'}
      />
      <FloatLabel
        {...register('floatField', {
          required: 'هذا الحقل مطلوب',
        })}
        label="حقل عائم"
        error={'error'}
        variant={'ghost'}
      />

      <ColorPicker
        {...register('pickedColor', {
          required: 'الرجاء اختيار لون',
        })}
        label="اختر لونًا"
        error={errors.pickedColor}
      />
      <Toggle
        pressed={isToggled}
        onPressedChange={handleToggleChange}
        variant="primary"
        size="lg"
        {...register('toggle')}
        errors={errors.toggle}
      >
        {isToggled ? 'مفعل' : 'معطل'}
      </Toggle>

      <TreeSelect
        {...register('department', {
          required: 'الرجاء اختيار القسم',
        })}
        options={[
          {
            value: 'tech',
            label: 'التقنية',
            children: [
              { value: 'frontend', label: 'واجهة المستخدم' },
              { value: 'backend', label: 'خلفية التطبيق' },
            ],
          },
          {
            value: 'hr',
            label: 'الموارد البشرية',
            children: [
              { value: 'recruitment', label: 'التوظيف' },
              { value: 'training', label: 'التدريب' },
            ],
          },
        ]}
        label="القسم"
        error={errors.department}
      />

      <PhoneInput
        {...register('phoneNumber', {
          required: 'رقم الهاتف مطلوب',
        })}
        label="رقم الهاتف"
        defaultCountry="SA"
        error={errors.phoneNumber}
      />
      <CurrencyInput
        {...register('price', {
          required: true,
          validate: {
            maxValue: (value) => value <= 1000000 || 'السعر لا يمكن أن يتجاوز 1,000,000',
            minValue: (value) => value >= 1 || 'السعر يجب أن يكون على الأقل 1',
          },
        })}
        label="السعر"
        error={errors.price}
        currencySymbol="ر.س"
        currencyCode="SAR"
        locale="ar-SA"
      />
      <CustomInputWithRightText
        {...register('username', {
          required: 'اسم المستخدم مطلوب',
          validate: {
            minValue: (value) => value >= 1 || 'السعر يجب أن يكون على الأقل 1',
          },
        })}
        label="اسم المستخدم"
        placeholder="أدخل اسم المستخدم"
        error={errors.username}
        rightText="@"
      />
      <CustomSelect
        {...register('category', {
          required: 'الرجاء اختيار فئة',
        })}
        options={[
          { value: 'technology', label: 'تقنية' },
          { value: 'design', label: 'تصميم' },
          { value: 'marketing', label: 'تسويق' },
        ]}
        label="الفئة"
        error={errors.category}
      />
      <FloatLabel
        {...register('floatField', {
          required: 'هذا الحقل مطلوب',
        })}
        label="حقل عائم"
        error={errors.floatField}
      />
    </Card>
  );
};

export default BasicForm;
