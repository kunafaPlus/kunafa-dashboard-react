import React, { useState } from "react";

interface LocalSwitchProps {
  bg: string;
}

const LocalSwitch: React.FC<LocalSwitchProps> = ({ bg }) => {
  const [localActive, setLocalActive] = useState<"en" | "ar">("en");

  const onClickBtn = () => {
    const nextLocale = localActive === "en" ? "ar" : "en";
    setLocalActive(nextLocale);

    // تحديث عنوان URL
    const newUrl = `/${nextLocale}`;
    window.history.pushState({}, "", newUrl);
  };

  return (
    <button
      onClick={onClickBtn}
      className={`bg-${bg} rounded-full text-text-primary shadow px-3 py-2`}
    >
      {localActive === "ar" ? "English" : "العربية"}
    </button>
  );
};

export default LocalSwitch;