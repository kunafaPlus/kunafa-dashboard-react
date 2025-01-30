import useForm from "../../../utils/useForm";
import Card from "../../layout/Card";
import { ColorPicker } from "../component/ColorPicker";
import { CurrencyInput } from "../component/CurrencyInput";
import { CustomInputWithRightText } from "../component/CustomInputWithRightText";
import { CustomSelect } from "../component/CustomSelect";
import { FileDropzone } from "../component/FileDropzone";
import { FileUploader } from "../component/FileUploader";
import { FloatLabel } from "../component/FloatLabel";
import { OTPInput } from "../component/OTPInput";
import { RichTextEditor } from "../component/RichTextEditor";
import { SignaturePad } from "../component/SignaturePad";
import { TagInput } from "../component/TagInput";
import { VoiceInput } from "../component/VoiceInput";

const AdvancedForm = () => {
  const { register, setValue, errors, formData } = useForm();

  return (
    <Card title="بيانات متقدمة">
      {" "}
      <SignaturePad
        {...register("signature", {
          required: "الرجاء إضافة التوقيع",
        })}
        label=" التوقيع"
        error={errors.signature}
      />
      <TagInput
        {...register("tags", {
          required: "الرجاء إضافة وسوم",
        })}
        label="الوسوم"
        error={errors.tags}
        placeholder="أضف وسماً..."
        suggestions={["React", "JavaScript", "CSS", "HTML"]}
        maxTags={5}
      />
      <RichTextEditor
        {...register("content", {
          required: "المحتوى مطلوب",
        })}
        label="المحتوى"
        error={errors.content}
      />
      <OTPInput
        {...register("otp", {
          required: "الرجاء إدخال رمز التحقق",
        })}
        length={6}
        label="رمز التحقق"
        error={errors.otp}
      />
      <VoiceInput
        {...register("voiceNote", {
          required: "الرجاء تسجيل ملاحظة صوتية",
        })}
        label="ملاحظة صوتية"
        maxDuration={300} // 5 minutes
        error={errors.voiceNote}
        onAudioData={(blob:any) => {
          // This will be called when audio data is available
          console.log("Audio Blob:", blob);
          setValue("voiceNote", blob); // Update the form value with the audio blob
        }}
      />
      <FileDropzone
        {...register("files", {
          required: "الرجاء اختيار ملفات",
        })}
        label="رفع الملفات"
        accept={[".pdf", ".doc", ".docx"]}
        maxFiles={5}
        error={errors.files}
      />
      <FileUploader
        {...register("avatar", {
          required: "الرجاء اختيار صورة",
        })}
        label="الصورة الشخصية"
        accept="image/*"
        error={errors.avatar}
      />
    </Card>
  );
};

export default AdvancedForm;
