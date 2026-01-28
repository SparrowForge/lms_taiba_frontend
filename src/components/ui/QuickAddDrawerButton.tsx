'use client';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import React, { useState } from 'react';

interface QuickAddDrawerButtonProps {
  /**
   * The drawer component to render when button is clicked
   * Should accept: visible, onCancel, onSuccess props
   */
  drawerComponent: React.ComponentType<any>;
  /**
   * Additional props to pass to the drawer component
   */
  drawerProps?: Record<string, any>;
  /**
   * Callback function called when the drawer completes successfully
   * This is where you can refresh dropdown options, update form, etc.
   */
  onComplete?: (data?: any) => void;
  /**
   * Button text (default: "Add")
   */
  buttonText?: string;
  /**
   * Button type (default: "default")
   */
  buttonType?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  /**
   * Button size (default: "middle")
   */
  buttonSize?: 'small' | 'middle' | 'large';
  /**
   * Icon to show on button (default: PlusOutlined)
   */
  icon?: React.ReactNode;
  /**
   * Whether to show only icon (default: false)
   */
  iconOnly?: boolean;
}

/**
 * Generic component that renders a button next to a Select dropdown
 * and opens a drawer for creating new items. When the drawer completes,
 * it calls the onComplete callback.
 *
 * @example
 * ```tsx
 * <Form.Item name="type" label="Institute Type">
 *   <Space.Compact style={{ width: '100%' }}>
 *     <Select
 *       options={INSTITUTE_TYPE_OPTIONS}
 *       placeholder="Select type"
 *       style={{ flex: 1 }}
 *     />
 *     <QuickAddDrawerButton
 *       drawerComponent={InstituteTypeFormDrawer}
 *       drawerProps={{ mode: 'create' }}
 *       onComplete={() => {
 *         // Refresh options or update form
 *         loadInstituteTypes();
 *       }}
 *     />
 *   </Space.Compact>
 * </Form.Item>
 * ```
 */
const QuickAddDrawerButton: React.FC<QuickAddDrawerButtonProps> = ({
  drawerComponent: DrawerComponent,
  drawerProps = {},
  onComplete,
  buttonText,
  buttonType = 'default',
  buttonSize = 'middle',
  icon = <PlusOutlined />,
  iconOnly = false,
}) => {
  const [visible, setVisible] = useState(false);

  const handleOpen = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSuccess = () => {
    setVisible(false);
    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <>
      <Button
        type={buttonType}
        size={buttonSize}
        icon={iconOnly ? icon : undefined}
        onClick={handleOpen}
        title={buttonText || 'Add new'}
      >
        {!iconOnly && (buttonText || 'Add')}
      </Button>
      <DrawerComponent
        visible={visible}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
        mode="create"
        {...drawerProps}
      />
    </>
  );
};

export default QuickAddDrawerButton;
