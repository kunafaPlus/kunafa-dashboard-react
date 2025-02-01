import { useState } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import CustomDialog from "../components/CustomDialog";
import { FormDialog } from "../components/FormDialog";
import { FiCheck, FiImage, FiShare2, FiVideo } from "react-icons/fi";
import { ImagePreviewDialog } from "../components/ImagePreviewDialog";
import { VideoDialog } from "../components/VideoDialog";
import { LoadingDialog } from "../components/LoadingDialog";
import { NotificationDialog } from "../components/NotificationDialog";
import { SelectionDialog } from "../components/SelectionDialog";
import { ShareDialog } from "../components/ShareDialog";
import { WizardDialog } from "../components/WizardDialog";
import Card from "../../layout/Card";
import { Input } from "../../input/component/Input";

export default function Dialog() {
  // State for controlling dialog visibility
  const [dialogs, setDialogs] = useState({
    confirm: false,
    custom: false,
    form: false,
    image: false,
    loading: false,
    notification: false,
    selection: false,
    share: false,
    video: false,
    wizard: false
  });

  // Toggle dialog visibility
  const toggleDialog = (dialogName: keyof typeof dialogs) => {
    setDialogs(prev => ({
      ...prev,
      [dialogName]: !prev[dialogName]
    }));
  };




  // Sample selection options
  const selectionOptions = [
    { id: 1, label: 'Option 1', value: 'option1', description: 'Description for option 1' },
    { id: 2, label: 'Option 2', value: 'option2', description: 'Description for option 2' },
    { id: 3, label: 'Option 3', value: 'option3', description: 'Description for option 3' }
  ];

  // Sample wizard steps
  const wizardSteps = [
    { 
      title: 'Account Details',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <input type="text" className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input type="email" className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>
      )
    },
    {
      title: 'Personal Information',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <input type="text" className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <input type="tel" className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>
      )
    },
    {
      title: 'Confirmation',
      content: (
        <div className="text-center">
          <FiCheck className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Almost Done!</h3>
          <p className="text-gray-600">Please review your information before submitting.</p>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Basic Dialogs */}
      <Card title="Basic Dialogs" >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Confirm Dialog */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Confirm Dialog</h3>
            <button
              onClick={() => toggleDialog('confirm')}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Open Confirm Dialog
            </button>
            <ConfirmDialog
              open={dialogs.confirm}
              onOpenChange={(open) => setDialogs(prev => ({ ...prev, confirm: open }))}
              type="warning"
              title="Confirm Action"
              description="Are you sure you want to perform this action? This cannot be undone."
              onConfirm={() => {
                console.log('Action confirmed');
                toggleDialog('confirm');
              }}
              confirmLabel="Yes, proceed"
              cancelLabel="No, cancel"
            />
          </div>

          {/* Custom Dialog */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Custom Dialog</h3>
            <button
              onClick={() => toggleDialog('custom')}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Open Custom Dialog
            </button>
            <CustomDialog
              isOpen={dialogs.custom}
              onClose={() => toggleDialog('custom')}
              title="Custom Dialog"
              size="md"
              variant="default"
              rounded="lg"
            >
              <div className="p-4 space-y-4">
                <p className="text-gray-600">
                  This is a custom dialog with custom content. You can add any content here.
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => toggleDialog('custom')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      console.log('Custom action');
                      toggleDialog('custom');
                    }}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </CustomDialog>
          </div>

          {/* Form Dialog */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Form Dialog</h3>
            <button
              onClick={() => toggleDialog('form')}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Open Form Dialog
            </button>
            <FormDialog
              open={dialogs.form}
              onOpenChange={(open) => setDialogs(prev => ({ ...prev, form: open }))}
              title="Contact Form"
              description="Please fill out the form below"
              submitLabel="Send Message"
              cancelLabel="Cancel"
              size="md"
              onSubmit={(data) => {
                console.log('Form submitted:', data);
                toggleDialog('form');
              }}
              onCancel={() => toggleDialog('form')}
            >

                <Input label="label"/>
                <Input label="label"/>
                <Input label="label"/>
            </FormDialog>
          </div>

          {/* Image Preview Dialog */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Image Preview Dialog</h3>
            <button
              onClick={() => toggleDialog('image')}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <FiImage /> Preview Image
            </button>
            <ImagePreviewDialog
              open={dialogs.image}
              onOpenChange={(open) => setDialogs(prev => ({ ...prev, image: open }))}
              images={[
                {
                  src: "/vite.svg",
                  alt: "Sample Image",
                  title: "Sample Image"
                }
              ]}
              initialIndex={0}
              showThumbnails={true}
              showControls={true}
              allowDownload={true}
              onIndexChange={(index) => console.log('Current image index:', index)}
            />
          </div>

          {/* Video Dialog */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Video Dialog</h3>
            <button
              onClick={() => toggleDialog('video')}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <FiVideo /> Play Video
            </button>
            <VideoDialog
              open={dialogs.video}
              onOpenChange={(open) => setDialogs(prev => ({ ...prev, video: open }))}
              src="https://example.com/sample-video.mp4"
              title="Sample Video"
              // description="Watch this sample video"
              controls
              autoPlay={false}
            />
          </div>

          {/* Loading Dialog */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Loading Dialog</h3>
            <button
              onClick={() => {
                toggleDialog('loading');
                setTimeout(() => toggleDialog('loading'), 3000);
              }}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Show Loading
            </button>
            <LoadingDialog
              open={dialogs.loading}
              title="Processing your request..."
            />
          </div>

          {/* Notification Dialog */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Notification Dialog</h3>
            <button
              onClick={() => toggleDialog('notification')}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Show Notification
            </button>
            <NotificationDialog
              open={dialogs.notification}
              onClose={() => toggleDialog('notification')}
              title="Success!"
              description="Operation completed successfully"
              icon={<FiCheck className="w-6 h-6 text-green-500" />}
              type="success"
            />
          </div>

          {/* Selection Dialog */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Selection Dialog</h3>
            <button
              onClick={() => toggleDialog('selection')}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Open Selection Dialog
            </button>
            <SelectionDialog
              open={dialogs.selection}
              onOpenChange={(open) => setDialogs(prev => ({ ...prev, selection: open }))}
              title="Select Options"
              description="Choose one or more options from the list below"
              options={selectionOptions.map(opt => ({
                id: opt.value,
                label: opt.label,
                description: opt.description
              }))}
              onChange={(selected) => {
                console.log('Selected:', selected);
                toggleDialog('selection');
              }}
              multiple={false}
              searchable={true}
            />
          </div>

          {/* Share Dialog */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Share Dialog</h3>
            <button
              onClick={() => toggleDialog('share')}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <FiShare2 /> Share Content
            </button>
            <ShareDialog
              open={dialogs.share}
              onOpenChange={(open) => setDialogs(prev => ({ ...prev, share: open }))}
              title="Share this content"
              description="Share this content with your friends and colleagues"
              url="https://example.com/share"
              text="Check out this awesome content!"
              showCopyLink={true}
              showNativeShare={true}
              onShare={(option) => {
                console.log('Shared via:', option);
              }}
            />
          </div>

          {/* Wizard Dialog */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Wizard Dialog</h3>
            <button
              onClick={() => toggleDialog('wizard')}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Open Wizard
            </button>
            <WizardDialog
              open={dialogs.wizard}
              onOpenChange={(open) => setDialogs(prev => ({ ...prev, wizard: open }))}
              title="Setup Wizard"
              description="Complete the setup process by following these steps"
              steps={wizardSteps}
              finishLabel="Complete Setup"
              cancelLabel="Cancel"
              nextLabel="Next Step"
              backLabel="Previous"
              showStepIndicator={true}
              size="lg"
              onFinish={() => {
                console.log('Wizard completed');
                toggleDialog('wizard');
              }}
              onCancel={() => {
                console.log('Wizard cancelled');
                toggleDialog('wizard');
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
