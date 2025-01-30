import useForm from "../../../utils/useForm";
import Card from "../../layout/Card";
import { ColorPicker } from "../component/ColorPicker";
import { CurrencyInput } from "../component/CurrencyInput";
import { CustomInputWithRightText } from "../component/CustomInputWithRightText";
import { CustomSelect } from "../component/CustomSelect";
import { FloatLabel } from "../component/FloatLabel";

const AdvancedForm = () => {
    const { register, setValue, errors, formData }=useForm()

  return (
    <Card title="بيانات متقدمة">
      <ColorPicker
        {...register("pickedColor", {
          required: "الرجاء اختيار لون",
        })}
        label="اختر لونًا"
        error={errors.pickedColor}
      />
      <CurrencyInput
        {...register("price", {
          required: true,
          validate: {
            maxValue: (value) => value <= 1000000 || "السعر لا يمكن أن يتجاوز 1,000,000",
            minValue: (value) => value >= 1 || "السعر يجب أن يكون على الأقل 1",
          },
        })}
        label="السعر"
        error={errors.price}
        currencySymbol="ر.س"
        currencyCode="SAR"
        locale="ar-SA"
      />
      <CustomInputWithRightText
        {...register("username", {
          required: "اسم المستخدم مطلوب",
          validate: {
            minValue: (value) => value >= 1 || "السعر يجب أن يكون على الأقل 1",
          },
        })}
        label="اسم المستخدم"
        placeholder="أدخل اسم المستخدم"
        error={errors.username}
        rightText="@"
      />
      <CustomSelect
        {...register("category", {
          required: "الرجاء اختيار فئة",
        })}
        options={[
          { value: "technology", label: "تقنية" },
          { value: "design", label: "تصميم" },
          { value: "marketing", label: "تسويق" },
        ]}
        label="الفئة"
        error={errors.category}
      />
      <FloatLabel
        {...register("floatField", {
          required: "هذا الحقل مطلوب",
        })}
        label="حقل عائم"
        error={errors.floatField}
      />
    </Card>
  );
};

export default AdvancedForm;