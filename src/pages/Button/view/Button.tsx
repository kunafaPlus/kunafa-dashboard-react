import { AlertButton } from "../../../components/button/AlertButton";
import { AudioPlayButton } from "../../../components/button/AudioPlayButton";
import { BackButton } from "../../../components/button/BackButton";
import { BiometricButton } from "../../../components/button/BiometricButton";
import { ButtonGroup } from "../../../components/button/ButtonGroup";
import { CommentButton } from "../../../components/button/CommentButton";
import { CopyButton } from "../../../components/button/CopyButton";
import { DownloadButton } from "../../../components/button/DownloadButton";
import { FloatingButton } from "../../../components/button/FloatingButton";
import { FollowButton } from "../../../components/button/FollowButton";
import { GlassButton } from "../../../components/button/GlassButton";
import { GradientButton } from "../../../components/button/GradientButton";
import { HoldButton } from "../../../components/button/HoldButton";
import { HoverButton } from "../../../components/button/HoverButton";
import { IconButton } from "../../../components/button/IconButton";
import { BiBell, BiPlus } from "react-icons/bi";
import { LikeButton } from "../../../components/button/LikeButton";
import { LoadingButton } from "../../../components/button/LoadingButton";
import { LocationButton } from "../../../components/button/LocationButton";
import { MenuButton } from "../../../components/button/MenuButton";
import { NotificationButton } from "../../../components/button/NotificationButton";
import { OutlineButton } from "../../../components/button/OutlineButton";
import { PaginationButton } from "../../../components/button/PaginationButton";
import { PopoverButton } from "../../../components/button/PopoverButton";
import { PressButton } from "../../../components/button/PressButton";
import { PrintButton } from "../../../components/button/PrintButton";
import { ProgressButton } from "../../../components/button/ProgressButton";
import { ScrollToTopButton } from "../../../components/button/ScrollToTopButton";
import { ScrollButton } from "../../../components/button/ScrollButton";
import { SaveButton } from "../../../components/button/SaveButton";
import { SocialButton } from "../../../components/button/SocialButton";
import { ShareButton } from "../../../components/button/ShareButton";
import { UploadButton } from "../../../components/button/UploadButton";
import { TooltipButton } from "../../../components/button/TooltipButton";
import { ThreeDButton } from "../../../components/button/ThreeDButton";
import { ThemeToggleButton } from "../../../components/button/ThemeToggleButton";
import { SwitchButton } from "../../../components/button/SwitchButton";
import { SwipeButton } from "../../../components/button/SwipeButton";
import { StatusButton } from "../../../components/button/StatusButton";
import { useState } from "react";
import { BsInfo } from "react-icons/bs";
import { SplitButton } from "../../../components/button/SplitButton";
import { SortButton } from "../../../components/button/SortButton";
import { SegmentedButton } from "../../../components/button/SegmentedButton";
import { RadioButtonGroup } from "../../../components/button/RadioButtonGroup";
import { VideoPlayButton } from "../../../components/button/VideoPlayButton";
import { ToolbarButton } from "../../../components/button/ToolbarButton";
import CustomButton from "../../../components/button/CustomButton";

function Button() {
  const [loading, setLoading] = useState(false);
  const handleSwipe = (confirmed) => {
    if (confirmed) {
      alert("Action confirmed!");
    } else {
      alert("Action reset.");
    }
  };
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];
  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
  };
  const handleClick = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };
  const handleAuthenticate = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
  };
  const handleSuccess = () => {
    alert("Authentication successful!");
  };
  const handleError = (error) => {
    alert(`Authentication failed: ${error.message}`);
  };
  const handlePlay = () => {
    console.log("Audio is playing");
  };
  const handlePause = () => {
    console.log("Audio is paused");
  };
  const handleEnded = () => {
    console.log("Audio has ended");
  };
  const items = [
    { id: "1", label: "Option 1", onClick: () => alert("Option 1 selected") },
    { id: "2", label: "Option 2", onClick: () => alert("Option 2 selected") },
    { id: "3", label: "Divider", divider: true },
    { id: "4", label: "Option 3", onClick: () => alert("Option 3 selected") },
  ];

  return (
    <div className="flex flex-col gap-8 p-4">
      {/* الأزرار الأساسية */}
      <section>
        <h2 className="text-2xl font-bold mb-4">الأزرار الأساسية</h2>
        <div className="flex flex-wrap gap-4">
          <CustomButton variant="primary" size="lg" label="Primary" />
          <CustomButton variant="secondary" size="lg" label="Secondary" />
          <CustomButton variant="success" size="lg" label="Success" />
          <CustomButton variant="warning" size="lg" label="Warning" />
          <CustomButton variant="danger" size="lg" label="Danger" />
          <CustomButton variant="info" size="lg" label="Info" />
          <CustomButton variant="light" size="lg" label="Light" />
          <CustomButton variant="dark" size="lg" label="Dark" />
          <CustomButton variant="link" size="lg" label="Link" />
        </div>
      </section>

      {/* أزرار الأيقونات */}
      <section>
        <h2 className="text-2xl font-bold mb-4">أزرار الأيقونات</h2>
        <div className="flex flex-wrap gap-4">
          <IconButton icon={<BiPlus />} />
          <IconButton icon={<BiBell />} />
        </div>
      </section>

      {/* أزرار التنبيه */}
      <section>
        <h2 className="text-2xl font-bold mb-4">أزرار التنبيه</h2>
        <div className="flex flex-wrap gap-4">
          <AlertButton alertStyle="pulse" alert>
            Pulse Alert
          </AlertButton>
          <AlertButton alertStyle="glow" alert>
            Glow Alert
          </AlertButton>
        </div>
      </section>

      {/* أزرار الصوت والفيديو */}
      <section>
        <h2 className="text-2xl font-bold mb-4">أزرار الصوت والفيديو</h2>
        <div className="flex flex-wrap gap-4">
          <AudioPlayButton src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3">
            Play Audio
          </AudioPlayButton>
          <VideoPlayButton src="https://www.w3schools.com/html/mov_bbb.mp4">
            Play Video
          </VideoPlayButton>
        </div>
      </section>

      {/* أزرار المصادقة */}
      <section>
        <h2 className="text-2xl font-bold mb-4">أزرار المصادقة</h2>
        <div className="flex flex-wrap gap-4">
          <BiometricButton
            onAuthenticate={handleAuthenticate}
            onSuccess={handleSuccess}
            onError={handleError}
            authenticateOnClick={true}
          >
            Authenticate
          </BiometricButton>
        </div>
      </section>

      {/* أزرار التواصل الاجتماعي */}
      <section>
        <h2 className="text-2xl font-bold mb-4">أزرار التواصل الاجتماعي</h2>
        <div className="flex flex-wrap gap-4">
          <SocialButton variant="facebook">Login with Facebook</SocialButton>
          <SocialButton variant="google">Login with Google</SocialButton>
          <SocialButton variant="twitter">Login with Twitter</SocialButton>
        </div>
      </section>

      {/* أزرار الأدوات */}
      <section>
        <h2 className="text-2xl font-bold mb-4">أزرار الأدوات</h2>
        <div className="flex flex-wrap gap-4">
          <CopyButton value="CopyButton" />
          <DownloadButton url="./Button.tsx">DownloadButton</DownloadButton>
          <PrintButton>PrintButton</PrintButton>
          <UploadButton>UploadButton</UploadButton>
          <SaveButton>SaveButton</SaveButton>
        </div>
      </section>

      {/* أزرار تفاعلية */}
      <section>
        <h2 className="text-2xl font-bold mb-4">أزرار تفاعلية</h2>
        <div className="flex flex-wrap gap-4">
          <HoverButton>HoverButton</HoverButton>
          <PressButton>PressButton</PressButton>
          <HoldButton>HoldButton</HoldButton>
          <SwipeButton
            onChange={handleSwipe}
            swipeText="Swipe to confirm"
            confirmText="Confirmed!"
          >
            Confirm
          </SwipeButton>
        </div>
      </section>

      {/* أزرار الإشعارات والحالة */}
      <section>
        <h2 className="text-2xl font-bold mb-4">أزرار الإشعارات والحالة</h2>
        <div className="flex flex-wrap gap-4">
          <NotificationButton count={5} maxCount={99} showZero={false}>
            Notifications
          </NotificationButton>
          <StatusButton status="success" onClick={() => alert("Success!")}>
            Operation Successful
          </StatusButton>
        </div>
      </section>

      {/* أزرار التلميحات والنوافذ المنبثقة */}
      <section>
        <h2 className="text-2xl font-bold mb-4">أزرار التلميحات والنوافذ المنبثقة</h2>
        <div className="flex flex-wrap gap-4">
          <TooltipButton tooltip="This is a tooltip">Tooltip Button</TooltipButton>
          <PopoverButton popoverContent="This is a popover!">
            Popover Button
          </PopoverButton>
        </div>
      </section>

      {/* أزرار المجموعات */}
      <section>
        <h2 className="text-2xl font-bold mb-4">أزرار المجموعات</h2>
        <div className="flex flex-wrap gap-4">
          <ButtonGroup>
            <CustomButton variant="primary" label="Button 1" />
            <CustomButton variant="secondary" label="Button 2" />
            <CustomButton variant="success" label="Button 3" />
          </ButtonGroup>
          <SplitButton
            items={[
              { id: "1", label: "Edit", onClick: () => console.log("Edit clicked") },
              { id: "2", label: "Delete", onClick: () => console.log("Delete clicked") },
            ]}
            onMainClick={() => console.log("Main button clicked")}
          >
            Main Action
          </SplitButton>
        </div>
      </section>

      {/* أزرار أخرى */}
      <section>
        <h2 className="text-2xl font-bold mb-4">أزرار أخرى</h2>
        <div className="flex flex-wrap gap-4">
          <ThemeToggleButton>Toggle Theme</ThemeToggleButton>
          <ScrollToTopButton>Back to Top</ScrollToTopButton>
          <ProgressButton progress={50} showProgress>
            Uploading...
          </ProgressButton>
        </div>
      </section>

      {/* الأزرار الإضافية */}
      <section>
        <h2 className="text-2xl font-bold mb-4">الأزرار الإضافية</h2>
        <div className="flex flex-wrap gap-4">
          <BackButton variant="link">Back</BackButton>
          <CommentButton>Add Comment</CommentButton>
          <FloatingButton>Floating</FloatingButton>
          <FollowButton>Follow</FollowButton>
          <GlassButton>Glass Button</GlassButton>
          <GradientButton variant="earth">Gradient Button</GradientButton>
          <LikeButton>Like</LikeButton>
          <LocationButton>Get Location</LocationButton>
          <MenuButton items={items}>Menu</MenuButton>
          <OutlineButton>Outline Button</OutlineButton>
          <PaginationButton>Next Page</PaginationButton>
          <ScrollButton>Scroll</ScrollButton>
          <SegmentedButton
            options={options}
            onChange={handleChange}
            defaultValue="option1"
          />
          <SortButton
            options={[
              { id: "1", label: "Option 1" },
              { id: "2", label: "Option 2" },
            ]}
          >
            Sort
          </SortButton>
          <ThreeDButton>3D Button</ThreeDButton>
          <ToolbarButton items={items}>Toolbar</ToolbarButton>
        </div>
      </section>
    </div>
  );
}

export default Button;