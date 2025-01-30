import useForm from "../../../utils/useForm";
import Card from "../../layout/Card";
import { CascadeSelect } from "../component/CascadeSelect";
import { InputGroup, InputGroupButton, InputGroupInput, InputGroupText } from "../component/InputGroup";
import { InputNumber } from "../component/InputNumber";
import { MatrixInput } from "../component/MatrixInput";
import { MultiSelect } from "../component/MultiSelect";
import { MultiStateCheckbox } from "../component/MultiStateCheckbox";
import { Rating } from "../component/Rating";
import { ScheduleInput } from "../component/ScheduleInput";
import { SearchInput } from "../component/SearchInput";
import { Select } from "../component/Select";


const AdditionalForms = () => {
    const { register, setValue, errors, formData }=useForm()
  return (
    <Card title="معلومات إضافية">
      <SearchInput
        {...register("search", {})}
        label="البحث"
        placeholder="ابحث هنا..."
        error={errors.search}
        onSearch={(value) => console.log("Searching for:", value)}
      />
            <CascadeSelect
        options={[
          {
            label: "Fruits",
            value: "fruits",
            children: [
              { label: "Apple", value: "apple" },
              { label: "Banana", value: "banana" },
              { label: "Orange", value: "orange" },
            ],
          },
        ]}
        {...register("select", { required: "Please select an option" })}
        label="الاسم الأول"
        error={errors.select}
      />
      <Rating
        {...register("rating", {
          required: "الرجاء تحديد التقييم",
        })}
        label="التقييم"
        maxStars={5}
        error={errors.rating}
      />
      <ScheduleInput
        {...register("schedule", {
          required: "الرجاء تحديد الموعد",
        })}
        error={errors.schedule}
      />
      <InputGroup>
        <InputGroupText>https://</InputGroupText>
        <InputGroupInput placeholder="Enter your website" />
        <InputGroupButton>Go</InputGroupButton>
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

export default AdditionalForms;