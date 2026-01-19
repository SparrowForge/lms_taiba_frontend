import { Drawer } from "antd"
import { useEffect } from "react";

import { LOCALE_KEYS } from "@/constants/localizationKeys"

import { useLocalization } from "@/hooks/useLocalization";
import { useSubjectDiscussions } from "@/hooks/useSubjectDiscussions";

import MessageForm from "./MessageForm";



interface DiscussionFormDrawerProps {
    mode: 'create' | 'edit';
    discussionId?: number;
    visible: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}


const DiscussionFormDrawer: React.FC<DiscussionFormDrawerProps> = ({
    mode,
    discussionId,
    visible,
    onCancel,
    onSuccess,
}) => {
    const { selectedSubjectDiscussion, loadSubjectDiscussion } = useSubjectDiscussions()
    const { t } = useLocalization();
    const entityName = t(LOCALE_KEYS.DISCUSSION, { defaultValue: 'Discussion' });
    const handleCancel = () => {
        onCancel()
    }
    const handleSuccess = () => {
        onSuccess()
    }

  useEffect(() => {
    if (visible && mode === 'edit' && discussionId) {
      loadSubjectDiscussion(discussionId);
    }
  }, [visible, mode, discussionId, loadSubjectDiscussion]);
    return (
        <div>
            <Drawer
                key={discussionId} // Force remount when discussionId changes
                title={
                    mode === 'create'
                        ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
                        : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })
                }
                width={600}
                open={visible}
                onClose={handleCancel}
                destroyOnHidden={true}
            >
                <MessageForm
                    mode={mode}
                    discussionId={discussionId}
                    initialValues={selectedSubjectDiscussion || undefined}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}

                />
            </Drawer>
        </div>
    )
}

export default DiscussionFormDrawer
