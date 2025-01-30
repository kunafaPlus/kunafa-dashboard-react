import useForm from "../../../utils/useForm";
import Card from "../../layout/Card";
import { CascadeSelect } from "../component/CascadeSelect";
import { Rating } from "../component/Rating";
import { ScheduleInput } from "../component/ScheduleInput";
import { SearchInput } from "../component/SearchInput";
import { Select } from "../component/Select";


const AdditionalForms = () => {
    const { register, setValue, errors, formData }=useForm()
  return (
    <Card title="معلومات إضافية">
      <CascadeSelect
        options={[
          {
            label: "فواكه",
            value: "fruits",
            children: [
              { label: "تفاح", value: "apple" },
              { label: "موز", value: "banana" },
              { label: "برتقال", value: "orange" },
            ],
          },
        ]}
        {...register("select", { required: "الرجاء اختيار خيار" })}
        label="اختر الفاكهة"
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
      <SearchInput
        {...register("search", {})}
        label="البحث"
        placeholder="ابحث هنا..."
        error={errors.search}
        onSearch={(value) => console.log("Searching for:", value)}
      />
      <Select
        {...register("country", {
          required: "الرجاء اختيار الدولة",
        })}
        options={[
          { value: "sa", label: "السعودية" },
          { value: "ae", label: "الإمارات" },
          { value: "kw", label: "الكويت" },
        ]}
        label="الدولة"
        placeholder="اختر الدولة"
        error={errors.country}
      />
    </Card>
  );
};

export default AdditionalForms;