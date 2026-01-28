'use client';

import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

interface QuickAddRouteButtonProps {
  /**
   * The route to navigate to when button is clicked
   */
  route: string;
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
  /**
   * Optional query parameters to append to the route
   */
  queryParams?: Record<string, string | number>;
}

/**
 * Generic component that renders a button next to a Select dropdown
 * and redirects to a specified route when clicked.
 *
 * @example
 * ```tsx
 * <Form.Item name="addressId" label="Address">
 *   <Row gutter={8}>
 *     <Col flex="1">
 *       <Select
 *         options={addressOptions}
 *         placeholder="Select address"
 *         style={{ width: '100%' }}
 *       />
 *     </Col>
 *     <Col>
 *       <QuickAddRouteButton
 *         route="/addresses/create"
 *         iconOnly
 *         buttonType="dashed"
 *       />
 *     </Col>
 *   </Row>
 * </Form.Item>
 * ```
 */
const QuickAddRouteButton: React.FC<QuickAddRouteButtonProps> = ({
  route,
  buttonText,
  buttonType = 'default',
  buttonSize = 'middle',
  icon = <PlusOutlined />,
  iconOnly = false,
  queryParams,
}) => {
  const router = useRouter();

  const handleClick = () => {
    let finalRoute = route;
    
    // Append query parameters if provided
    if (queryParams && Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        params.append(key, String(value));
      });
      finalRoute = `${route}?${params.toString()}`;
    }
    
    router.push(finalRoute);
  };

  return (
    <Button
      type={buttonType}
      size={buttonSize}
      icon={iconOnly ? icon : undefined}
      onClick={handleClick}
      title={buttonText || 'Add new'}
    >
      {!iconOnly && (buttonText || 'Add')}
    </Button>
  );
};

export default QuickAddRouteButton;
