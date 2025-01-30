import useForm from "../../../utils/useForm";
import Card from "../../layout/Card";
import { InputGroup, InputGroupButton, InputGroupInput, InputGroupText } from "../component/InputGroup";
import { InputNumber } from "../component/InputNumber";
import { MatrixInput } from "../component/MatrixInput";
import { MultiSelect } from "../component/MultiSelect";
import { MultiStateCheckbox } from "../component/MultiStateCheckbox";


const UserProfileForm = () => {
    const { register, setValue, errors, formData }=useForm()

  return (
    <Card title="ملف تعريف المستخدم">
      <InputGroup>
        <InputGroupText>https://</InputGroupText>
        <InputGroupInput placeholder="أدخل موقعك الإلكتروني" />
        <InputGroupButton>انتقال</InputGroupButton>
      </InputGroup>
      <InputNumber
        {...register("quantity")}
        label="الكمية"
        error={errors.quantity}
      />
      <MatrixInput
        {...register("matrix")}
        rows={3}
        columns={3}
        label="المصفوفة"
        error={errors.matrix}
      />
      <MultiSelect
        {...register("skills")}
        options={[
          { value: "react", label: "React" },
          { value: "vue", label: "Vue" },
          { value: "angular", label: "Angular" },
        ]}
        label="المهارات"
        error={errors.skills}
      />
      <MultiStateCheckbox
        {...register("status", {
          required: "الرجاء تحديد الحالة",
        })}
        states={["معطل", "مفعل", "قيد المراجعة"]}
        label="الحالة"
        error={errors.status}
      />
    </Card>
  );
};

export default UserProfileForm;