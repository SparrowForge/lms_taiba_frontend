'use client';

import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, ReloadOutlined} from '@ant-design/icons';
import {Button, Checkbox, Form, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useCallback, useEffect, useState} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';
import {useMenus} from '@/hooks/useMenus';
import {usePanels} from '@/hooks/usePanels';
import {useRoleMenuPermissions} from '@/hooks/useRoleMenuPermissions';
import {useRoles} from '@/hooks/useRoles';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IMenu} from '@/types/menu'

import {RoleMenuPermissionFormProps} from './RoleMenuPermissionFormTabView'


function RoleMenuPermissionFormMultiple({
    roleMenuPermissionId,
    initialValues,
    onSuccess,
    onCancel,
    embedded
}: RoleMenuPermissionFormProps) {
    const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROLE_MENU_PERMISSION, { defaultValue: 'Role Menu Permission' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createRoleMenuPermission, editRoleMenuPermission, actionStatus, bulkUpdateRoleMenuPermissions } =
    useRoleMenuPermissions();
  const { roles, loadRoles } = useRoles();
  const { menus, loadMenus, loadPanelsWithMenus, panelsWithMenus, panelsWithMenusStatus } = useMenus();
  const { rolesWithPermissions, rolesWithPermissionsStatus, loadRolesWithPermissions } = useRoleMenuPermissions();
  const { panels, loadPanels } = usePanels();
  const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>();

  // Load panels with menus when component mounts
  useEffect(() => {
    loadPanelsWithMenus();
    loadRolesWithPermissions();
    loadRoles({ page: 1, limit: 100 });
    form.resetFields();
  }, [loadPanelsWithMenus, loadRolesWithPermissions, loadRoles]);

  // Load existing permissions when a role is selected
  useEffect(() => {
    if (selectedRoleId && rolesWithPermissions.length > 0) {
      const selectedRole = rolesWithPermissions.find(role => role.id === selectedRoleId);

      if (selectedRole && selectedRole.menuPermissions) {
        console.log('Loading existing permissions for role:', selectedRole.name, selectedRole.menuPermissions);

        // Reset local state
        setLocalSelectedMenus([]);
        setLocalPermissions({});

        // Pre-populate with existing permissions
        selectedRole.menuPermissions.forEach(permission => {
          if (permission.menu && permission.menu.panel) {
            const menuId = `${permission.menu.panel.id}-${permission.menu.id}`;

            // Add menu to selected menus if it has any permissions
            if (permission.view || permission.insert || permission.update || permission.delete) {
              setLocalSelectedMenus(prev => {
                if (!prev.includes(menuId)) {
                  return [...prev, menuId];
                }
                return prev;
              });
            }

            // Set permissions
            setLocalPermissions(prev => ({
              ...prev,
              [menuId]: {
                view: permission.view || false,
                insert: permission.insert || false,
                update: permission.update || false,
                delete: permission.delete || false
              }
            }));
          }
        });

        console.log('Pre-populated permissions for role:', selectedRoleId);
      }
    }
  }, [selectedRoleId, rolesWithPermissions]);

  // Initialize form fields
  useEffect(() => {
    if (panelsWithMenus.length > 0) {
      form.resetFields();
      setLocalSelectedPanels([]);
      setLocalSelectedMenus([]);
      setLocalPermissions({});
    }
  }, [panelsWithMenus]);

  // Use local state to track selections and trigger re-renders
  const [localSelectedPanels, setLocalSelectedPanels] = useState<number[]>([]);
  const [localSelectedMenus, setLocalSelectedMenus] = useState<string[]>([]);
  const [localPermissions, setLocalPermissions] = useState<Record<string, { view: boolean; insert: boolean; update: boolean; delete: boolean }>>({});

  // Helper function to update panel selection based on menu selection
  const updatePanelSelection = useCallback((panelId: number) => {
    const panel = panelsWithMenus.find(p => p.id === panelId);
    if (!panel || !panel.menus) return;

    const panelMenuIds = panel.menus.map(menu => `${panelId}-${menu.id}`);
    const selectedCount = panelMenuIds.filter(menuId => localSelectedMenus.includes(menuId)).length;

    // Check if all menus in this panel have all permissions selected
    const allMenusWithAllPermissions = panelMenuIds.every(menuId => {
      const menuPermissions = localPermissions[menuId];
      return menuPermissions &&
             menuPermissions.view &&
             menuPermissions.insert &&
             menuPermissions.update &&
             menuPermissions.delete;
    });

    // Check if any menus in this panel have any permissions selected
    const hasAnyPermissions = panelMenuIds.some(menuId => {
      const menuPermissions = localPermissions[menuId];
      return menuPermissions && (menuPermissions.view || menuPermissions.insert || menuPermissions.update || menuPermissions.delete);
    });

    console.log(`Panel ${panelId} selection update:`, {
      selectedCount,
      totalMenus: panelMenuIds.length,
      allMenusWithAllPermissions,
      hasAnyPermissions,
      currentSelectedPanels: localSelectedPanels
    });

    if (selectedCount === 0 || !hasAnyPermissions) {
      // Remove panel if no menus are selected or no permissions
      if (localSelectedPanels.includes(panelId)) {
        const newSelectedPanels = localSelectedPanels.filter(id => id !== panelId);
        setLocalSelectedPanels(newSelectedPanels);
        console.log('Removed panel from selection:', panelId);
      }
    } else if (selectedCount === panelMenuIds.length && allMenusWithAllPermissions) {
      // Add panel if all menus are selected and all permissions are selected
      if (!localSelectedPanels.includes(panelId)) {
        const newSelectedPanels = [...localSelectedPanels, panelId];
        setLocalSelectedPanels(newSelectedPanels);
        console.log('Added panel to selection (all menus + all permissions):', panelId);
      }
    }
    // If some menus are selected or some permissions are selected, panel stays in current state (for indeterminate)
  }, [localSelectedPanels, localSelectedMenus, localPermissions, panelsWithMenus]);

  // Remove the useEffect that syncs form with local state - we'll manage everything through local state


  const handleMultipleSubmit = async () => {

    if(await form.validateFields() === false) {
      return;
    }

    try {
      console.log('=== ROLE MENU PERMISSION SUBMISSION START ===');

      // Use local state directly instead of reading from form
      console.log('Local state values:', {
        selectedRoleId,
        localSelectedMenus,
        localPermissions
      });

      // Validate required fields
      if (!selectedRoleId) {
        toast.error(t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.ROLE) }));
        return;
      }

      if (localSelectedMenus.length === 0) {
        toast.error('Please select at least one menu');
        return;
      }

      // Create the new data structure using local state
      const submitData = {
        roleId: selectedRoleId,
        permissions: [] as Array<{
          menuId: number;
          view: boolean;
          insert: boolean;
          update: boolean;
          delete: boolean;
        }>
      };

      // Transform localSelectedMenus and localPermissions into the new format
      localSelectedMenus.forEach((menuId: string) => {
        const [panelId, actualMenuId] = menuId.split('-');
        const menuPermissions = localPermissions[menuId] || {};

        // Only add if at least one permission is selected
        if (menuPermissions.view || menuPermissions.insert || menuPermissions.update || menuPermissions.delete) {
          submitData.permissions.push({
            menuId: parseInt(actualMenuId),
            view: menuPermissions.view || false,
            insert: menuPermissions.insert || false,
            update: menuPermissions.update || false,
            delete: menuPermissions.delete || false
          });
        }
      });

      console.log('=== NEW DATA STRUCTURE ===');
      console.log('Submit data:', submitData);
      console.log('Role ID:', submitData.roleId);
      console.log('Total permissions:', submitData.permissions.length);

      // Log each permission in detail
      submitData.permissions.forEach((permission, index) => {
        const menu = menus.find(m => m.id === permission.menuId);
        const panel = panels.find(p => p.id === parseInt(localSelectedMenus.find((m: string) => m.endsWith(`-${permission.menuId}`))?.split('-')[0] || '0'));

        console.log(`Permission ${index + 1}:`, {
          menuId: permission.menuId,
          menuName: menu?.name || 'Unknown',
          panelName: panel?.name || 'Unknown',
          permissions: {
            view: permission.view,
            insert: permission.insert,
            update: permission.update,
            delete: permission.delete
          }
        });
      });

      console.log('=== CALLING API ===');
      console.log('Endpoint: /role-menu-permissions/bulk');
      console.log('Data structure matches required format:', {
        roleId: submitData.roleId,
        permissions: submitData.permissions
      });

      // Call the API to replace all permissions for this role
      await bulkUpdateRoleMenuPermissions(submitData);

      toast.success(`Successfully updated ${submitData.permissions.length} menu permissions for role`);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/role-menu-permissions');
      }

    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
        name: entityName,
        defaultValue: `Failed to update ${entityName.toLowerCase()}`,
      });

      // Try to extract error message from API response
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else {
        // Use the helper function for other error types
        errorMessage = getErrorMessage(error);
      }

      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const resetForm = () => {
    form.resetFields();
    setLocalSelectedPanels([]);
    setLocalSelectedMenus([]);
    setLocalPermissions({});
  };

  const getSubmitText = () =>
    t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });



  const renderMultipleRoleForm = () => {

    // Helper function to check if all menus in a panel are selected
    const areAllMenusSelected = (panelId: number) => {
      const panel = panelsWithMenus.find(p => p.id === panelId);
      if (!panel || !panel.menus || panel.menus.length === 0) return false;

      const panelMenuIds = panel.menus.map(menu => `${panelId}-${menu.id}`);

      // Check if all menus are selected
      const allMenusSelected = panelMenuIds.every(menuId => localSelectedMenus.includes(menuId));
      if (!allMenusSelected) return false;

      // Check if all menus have all permissions selected
      const allPermissionsSelected = panelMenuIds.every(menuId => {
        const menuPermissions = localPermissions[menuId];
        return menuPermissions &&
               menuPermissions.view &&
               menuPermissions.insert &&
               menuPermissions.update &&
               menuPermissions.delete;
      });

      return allPermissionsSelected;
    };

    // Helper function to check if some menus in a panel are selected
    const areSomeMenusSelected = (panelId: number) => {
      const panel = panelsWithMenus.find(p => p.id === panelId);
      if (!panel || !panel.menus || panel.menus.length === 0) return false;

      const panelMenuIds = panel.menus.map(menu => `${panelId}-${menu.id}`);
      const selectedCount = panelMenuIds.filter(menuId => localSelectedMenus.includes(menuId)).length;

      // Return true if some but not all menus are selected
      return selectedCount > 0 && selectedCount < panelMenuIds.length;
    };

    // Helper function to check if panel should be checked (all menus selected)
    const isPanelChecked = (panelId: number) => {
      const panel = panelsWithMenus.find(p => p.id === panelId);
      if (!panel || !panel.menus || panel.menus.length === 0) return false;

      const panelMenuIds = panel.menus.map(menu => `${panelId}-${menu.id}`);
      return panelMenuIds.every(menuId => localSelectedMenus.includes(menuId));
    };

    // Helper function to check if panel should be indeterminate (some menus selected or partial permissions)
    const isPanelIndeterminate = (panelId: number) => {
      const panel = panelsWithMenus.find(p => p.id === panelId);
      if (!panel || !panel.menus || panel.menus.length === 0) return false;

      const panelMenuIds = panel.menus.map(menu => `${panelId}-${menu.id}`);

      // Check if some but not all menus are selected
      const selectedCount = panelMenuIds.filter(menuId => localSelectedMenus.includes(menuId)).length;
      const someMenusSelected = selectedCount > 0 && selectedCount < panelMenuIds.length;

      // Check if all menus are selected but have partial permissions
      const allMenusSelected = selectedCount === panelMenuIds.length;
      const hasPartialPermissions = allMenusSelected && panelMenuIds.some(menuId => {
        const menuPermissions = localPermissions[menuId];
        if (!menuPermissions) return true; // No permissions = partial

        // Check if this menu has all permissions
        const hasAllPermissions = menuPermissions.view && menuPermissions.insert && menuPermissions.update && menuPermissions.delete;
        return !hasAllPermissions; // Return true if permissions are partial
      });

      // Show indeterminate if some menus are selected OR if all menus are selected but have partial permissions
      return someMenusSelected || hasPartialPermissions;
    };

    const somePermissionsSelected = (panelId: number, menuId: number) => {
      const menuKey = `${panelId}-${menuId}`;
      const menuPermissions = localPermissions[menuKey];

      if (!menuPermissions) return false;

      const hasSome = menuPermissions.view || menuPermissions.insert || menuPermissions.update || menuPermissions.delete;
      const hasAll = menuPermissions.view && menuPermissions.insert && menuPermissions.update && menuPermissions.delete;

      // Return true if some but not all permissions are selected (for indeterminate state)
      return hasSome && !hasAll;
    };

    const allPermissionsSelected = (panelId: number, menuId: number) => {
      const menuKey = `${panelId}-${menuId}`;
      const menuPermissions = localPermissions[menuKey];

      if (!menuPermissions) return false;

      // Return true if all permissions are selected
      return menuPermissions.view && menuPermissions.insert && menuPermissions.update && menuPermissions.delete;
    };

    // Helper function to update panel selection based on permissions
    const updatePanelSelectionFromPermissions = (panelId: number, updatedPermissions?: Record<string, { view: boolean; insert: boolean; update: boolean; delete: boolean }>) => {
      const panel = panelsWithMenus.find(p => p.id === panelId);
      if (!panel || !panel.menus) return;

      // Use the passed permissions or fall back to local state
      const permissionsToCheck = updatedPermissions || localPermissions;

      console.log('=== UPDATING PANEL SELECTION ===');
      console.log('Panel ID:', panelId);
      console.log('Panel menus:', panel.menus.map(m => m.id));
      console.log('Using permissions:', updatedPermissions ? 'passed directly' : 'from local state');

      // Check if any menu in this panel has any permissions selected
      const hasAnyPermissions = panel.menus.some(menu => {
        const menuKey = `${panelId}-${menu.id}`;
        const menuPermissions = permissionsToCheck[menuKey];
        const hasPermissions = menuPermissions && (menuPermissions.view || menuPermissions.insert || menuPermissions.update || menuPermissions.delete);
        console.log(`Menu ${menu.id} (${menu.name}) has permissions:`, hasPermissions, menuPermissions);
        return hasPermissions;
      });

      console.log('Panel has any permissions:', hasAnyPermissions);

      const currentSelectedPanels = form.getFieldValue('selectedPanels') || [];
      console.log('Current selected panels:', currentSelectedPanels);
      console.log('Panel is currently selected:', currentSelectedPanels.includes(panelId));

      if (hasAnyPermissions && !currentSelectedPanels.includes(panelId)) {
        // Add panel to selection if it has any permissions
        const newSelectedPanels = [...currentSelectedPanels, panelId];
        form.setFieldValue('selectedPanels', newSelectedPanels);
        setLocalSelectedPanels(newSelectedPanels);
        console.log('✅ Added panel to selection due to permissions:', panelId);
        console.log('New selected panels:', newSelectedPanels);
      } else if (!hasAnyPermissions && currentSelectedPanels.includes(panelId)) {
        // Remove panel from selection if it has no permissions
        const newSelectedPanels = currentSelectedPanels.filter((id: number) => id !== panelId);
        form.setFieldValue('selectedPanels', newSelectedPanels);
        setLocalSelectedPanels(newSelectedPanels);
        console.log('❌ Removed panel from selection due to no permissions:', panelId);
        console.log('New selected panels:', newSelectedPanels);
      } else {
        console.log('No change needed for panel:', panelId);
      }

      console.log('=== END PANEL SELECTION UPDATE ===');
    };

    return (
      <Form layout="vertical" form={form}>
        {/* Role Selection and Submit Button - Same Row */}
        <div className='flex flex-row gap-4 items-end'>
          <div className='flex-1'>
            <Form.Item
              name="roleId"
              label={t(LOCALE_KEYS.ROLE)}
              rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ROLE) }) }]}
            >
              <Select
                placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.ROLE) })}
                loading={roles.length === 0}
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }
                onChange={(value) => setSelectedRoleId(value)}
              >
                {roles.map((role) => (
                  <Select.Option key={role.id} value={role.id}>
                    {role.name} ({role.branch?.name})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item>
            <Space>
            <Button
                onClick={resetForm}
                size="large"
              >
                <ReloadOutlined /> Reset
            </Button>
              <Button
                type="primary"
                htmlType="submit"
                onClick={handleMultipleSubmit}
                loading={actionStatus.status === Status.LOADING}
                size="large"
              >
                {t(LOCALE_KEYS.UPDATE_NAME, { name: t(LOCALE_KEYS.ROLE_MENU_PERMISSIONS) })}
              </Button>
              <Button
                onClick={handleCancel}
                size="large"
              >
                {t(LOCALE_KEYS.CANCEL)}
              </Button>
            </Space>
          </Form.Item>

        </div>

                {/* Panel and Menu Selection - Only show after role is selected */}
        {selectedRoleId && (
          <>
            {/* Panel Selection */}
            <div style={{
                fontSize: '12px',
                color: '#8c8c8c',
                marginBottom: '12px',
                fontStyle: 'italic',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #e8e8e8'
              }}>
                💡 <strong>Tip:</strong> Selecting a panel automatically selects all its menus and grants all permissions
              </div>
              <div className='flex flex-row gap-2'>
              <div style={{
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                padding: '16px',
                height: 'calc(100vh - 400px)',
                overflowY: 'auto',
              }}>
                {panelsWithMenusStatus.status === Status.LOADING ? (
                  <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '20px 0' }}>
                    Loading panels with menus...
                  </div>
                ) : panelsWithMenus.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '20px 0' }}>
                    No panels with menus found
                  </div>
                ) : (
                                    <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    justifyContent: 'flex-start'
                  }}>
                    {panelsWithMenus.map((panel) => (
                      <div key={panel.id} style={{
                        border: '1px solid #e8e8e8',
                        borderRadius: '6px',
                        padding: '12px',
                        maxWidth: '350px',
                        minWidth: '250px',
                        flex: '1 1 250px',
                        width: '100%'
                      }}>
                      {/* Panel Header */}
                      <div className='flex flex-col gap-2 border-b border-gray-200 pb-[12px] mb-[12px]'>

                        {/* Select All View Button */}
                        <div className='flex flex-row gap-2'>
                          <Button
                            size="small"
                            type="primary"
                            onClick={() => {
                              console.log('Select All View clicked for panel:', panel.id);

                              // Get current permissions from local state
                              const newPermissions = { ...localPermissions };

                              // Set view: true for all menus under this panel
                              panel.menus?.forEach(menu => {
                                const menuKey = `${panel.id}-${menu.id}`;
                                const existingPermissions = newPermissions[menuKey] || {};

                                newPermissions[menuKey] = {
                                  ...existingPermissions,
                                  view: true
                                };
                              });

                              // Update local state
                              setLocalPermissions(newPermissions);

                              // Also add all menus to selected menus if they're not already there
                              const panelMenuIds = panel.menus?.map(menu => `${panel.id}-${menu.id}`) || [];
                              const newSelectedMenus = [...localSelectedMenus];

                              panelMenuIds.forEach(menuId => {
                                if (!newSelectedMenus.includes(menuId)) {
                                  newSelectedMenus.push(menuId);
                                }
                              });

                              setLocalSelectedMenus(newSelectedMenus);

                              console.log('Updated permissions for Select All View:', newPermissions);
                              console.log('Updated selected menus:', newSelectedMenus);

                              // Update panel selection if needed
                              updatePanelSelection(panel.id);
                            }}
                            style={{
                              fontSize: '11px',
                              height: '24px',
                              padding: '0 8px',
                              backgroundColor: '#52c41a',
                              borderColor: '#52c41a',
                              marginRight: '8px'
                            }}
                          >
                            <EyeOutlined /> All View
                          </Button>

                          <Button
                            size="small"
                            type="default"
                            onClick={() => {
                              console.log('Reset panel clicked for panel:', panel.id);

                              // Get current permissions from local state
                              const newPermissions = { ...localPermissions };

                              // Reset all permissions for all menus under this panel
                              panel.menus?.forEach(menu => {
                                const menuKey = `${panel.id}-${menu.id}`;
                                newPermissions[menuKey] = {
                                  view: false,
                                  insert: false,
                                  update: false,
                                  delete: false
                                };
                              });

                              // Update local state
                              setLocalPermissions(newPermissions);

                              // Remove all menus from selected menus for this panel
                              const panelMenuIds = panel.menus?.map(menu => `${panel.id}-${menu.id}`) || [];
                              const newSelectedMenus = localSelectedMenus.filter(menuId => !panelMenuIds.includes(menuId));

                              setLocalSelectedMenus(newSelectedMenus);

                              console.log('Reset permissions for panel:', newPermissions);
                              console.log('Updated selected menus:', newSelectedMenus);

                              // Update panel selection if needed
                              updatePanelSelection(panel.id);
                            }}
                            style={{
                              fontSize: '11px',
                              height: '24px',
                              padding: '0 8px',
                              backgroundColor: '#ffffff',
                              borderColor: '#d9d9d9',
                              color: '#595959'
                            }}
                          >
                            <ReloadOutlined /> Reset
                          </Button>
                        </div>

                        <Checkbox
                          style={{ marginRight: 12 }}
                          checked={isPanelChecked(panel.id)}
                          indeterminate={isPanelIndeterminate(panel.id)}
                          onChange={(e) => {
                            console.log('Panel checkbox changed:', { panelId: panel.id, checked: e.target.checked });

                            // Handle panel selection using local state
                            if (e.target.checked) {
                              const newSelectedPanels = [...localSelectedPanels, panel.id];
                              setLocalSelectedPanels(newSelectedPanels);
                            } else {
                              const newSelectedPanels = localSelectedPanels.filter((id: number) => id !== panel.id);
                              setLocalSelectedPanels(newSelectedPanels);
                            }

                            // Handle menu selection for this panel using local state
                            const panelMenuIds = panel.menus?.map(menu => `${panel.id}-${menu.id}`) || [];

                            if (e.target.checked) {
                              // Check all menus under this panel
                              const newSelectedMenus = [...localSelectedMenus, ...panelMenuIds];
                              setLocalSelectedMenus(newSelectedMenus);
                              console.log('Added all menus for panel:', { panelId: panel.id, menuIds: panelMenuIds });

                              // Auto-check all permissions for all menus under this panel
                              const newPermissions = { ...localPermissions };
                              panel.menus.forEach(menu => {
                                const menuKey = `${panel.id}-${menu.id}`;
                                newPermissions[menuKey] = {
                                  view: true,
                                  insert: true,
                                  update: true,
                                  delete: true
                                };
                              });
                              setLocalPermissions(newPermissions);
                              console.log('Auto-checked all permissions for all menus under panel:', panel.id);
                            } else {
                              // Uncheck all menus under this panel
                              const newSelectedMenus = localSelectedMenus.filter((menuId: string) =>
                                !panelMenuIds.includes(menuId)
                              );
                              setLocalSelectedMenus(newSelectedMenus);
                              console.log('Removed all menus for panel:', { panelId: panel.id, menuIds: panelMenuIds });

                              // Auto-uncheck all permissions for all menus under this panel
                              const newPermissions = { ...localPermissions };
                              panel.menus.forEach(menu => {
                                const menuKey = `${panel.id}-${menu.id}`;
                                newPermissions[menuKey] = {
                                  view: false,
                                  insert: false,
                                  update: false,
                                  delete: false
                                };
                              });
                              setLocalPermissions(newPermissions);
                              console.log('Auto-unchecked all permissions for all menus under panel:', panel.id);
                            }

                            // Update panel selection state
                            updatePanelSelection(panel.id);
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>
                            {panel.name}
                            <span style={{
                              marginLeft: '8px',
                              fontSize: '12px',
                              color: '#8c8c8c',
                              fontWeight: 'normal'
                            }}>
                              ({panel.menus?.length || 0})
                            </span>
                          </div>
                        </Checkbox>




                      </div>



                      {/* Menus under this panel */}
                      {panel.menus && panel.menus.length > 0 ? (
                        <div style={{ marginLeft: '12px' }}>
                          <div style={{
                            fontSize: '12px',
                            color: '#8c8c8c',
                            marginBottom: '8px',
                            fontStyle: 'italic'
                          }}>
                            Select specific menus:
                          </div>
                          {panel.menus.map((menu: IMenu) => (
                            <div key={menu.id} style={{
                              display: 'flex',
                              flexDirection: 'column',
                              padding: '12px 0',
                              marginLeft: '8px',
                              borderBottom: '1px solid #f0f0f0'
                            }}>
                              <Checkbox
                                style={{ marginRight: 8 }}
                                checked={allPermissionsSelected(panel.id, menu.id)}
                                indeterminate={somePermissionsSelected(panel.id, menu.id)}
                                onChange={(e) => {
                                  console.log('Menu checkbox changed:', {
                                    panelId: panel.id,
                                    menuId: menu.id,
                                    checked: e.target.checked
                                  });

                                  // Handle individual menu selection using local state
                                  const menuId = `${panel.id}-${menu.id}`;

                                  if (e.target.checked) {
                                    // Add menu to selection
                                    const newSelectedMenus = [...localSelectedMenus, menuId];
                                    setLocalSelectedMenus(newSelectedMenus);
                                    console.log('Added menu:', { menuId, newSelectedMenus });

                                    // Auto-check all permissions for this menu
                                    const newPermissions = { ...localPermissions };
                                    const menuKey = `${panel.id}-${menu.id}`;
                                    newPermissions[menuKey] = {
                                      view: true,
                                      insert: true,
                                      update: true,
                                      delete: true
                                    };
                                    setLocalPermissions(newPermissions);

                                    console.log('Auto-checked all permissions for menu:', menuKey);
                                  } else {
                                    // Remove menu from selection
                                    const newSelectedMenus = localSelectedMenus.filter((id: string) => id !== menuId);
                                    setLocalSelectedMenus(newSelectedMenus);
                                    console.log('Removed menu:', { menuId, newSelectedMenus });

                                    // Auto-uncheck all permissions for this menu
                                    const newPermissions = { ...localPermissions };
                                    const menuKey = `${panel.id}-${menu.id}`;
                                    newPermissions[menuKey] = {
                                      view: false,
                                      insert: false,
                                      update: false,
                                      delete: false
                                    };
                                    setLocalPermissions(newPermissions);
                                    console.log('Auto-unchecked all permissions for menu:', menuKey);
                                  }

                                  // Update panel selection based on menu selection
                                  const updatedSelectedMenus = e.target.checked ? [...localSelectedMenus, menuId] : localSelectedMenus.filter((id: string) => id !== menuId);
                                  const panelMenuIds = panel.menus.map(m => `${panel.id}-${m.id}`);
                                  const allMenusSelected = panelMenuIds.every(id => updatedSelectedMenus.includes(id));
                                  const someMenusSelected = panelMenuIds.some(id => updatedSelectedMenus.includes(id));

                                  console.log('Menu selection update:', {
                                    allMenusSelected,
                                    someMenusSelected,
                                    panelMenuIds,
                                    updatedSelectedMenus
                                  });

                                  // Use the new updatePanelSelection function for instant updates
                                  updatePanelSelection(panel.id);
                                }}
                              >
                                <div style={{ fontSize: '13px', fontWeight: 500 }}>
                                  {menu.name}
                                </div>
                              </Checkbox>

                              {/* Permission Checkboxes */}
                              <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px',
                                marginLeft: '32px',
                                marginTop: '8px'
                              }}>
                                <Checkbox
                                  checked={localPermissions[`${panel.id}-${menu.id}`]?.view || false}
                                  onChange={(e) => {
                                    console.log('=== VIEW PERMISSION CHANGED ===');
                                    console.log('Panel ID:', panel.id, 'Menu ID:', menu.id);
                                    console.log('New value:', e.target.checked);

                                    // Update local permissions directly
                                    const newPermissions = { ...localPermissions };
                                    const menuKey = `${panel.id}-${menu.id}`;
                                    const existingPermissions = newPermissions[menuKey] || {};

                                    newPermissions[menuKey] = {
                                      ...existingPermissions,
                                      view: e.target.checked
                                    };

                                    console.log('New permissions object:', newPermissions);

                                    setLocalPermissions(newPermissions);

                                    // Ensure menu is added to selected menus if any permission is selected
                                    const menuId = `${panel.id}-${menu.id}`;
                                    if (e.target.checked && !localSelectedMenus.includes(menuId)) {
                                      const newSelectedMenus = [...localSelectedMenus, menuId];
                                      setLocalSelectedMenus(newSelectedMenus);
                                    } else if (!e.target.checked) {
                                      // Check if any other permissions are still selected
                                      const hasOtherPermissions = existingPermissions.insert || existingPermissions.update || existingPermissions.delete;
                                      if (!hasOtherPermissions && localSelectedMenus.includes(menuId)) {
                                        const newSelectedMenus = localSelectedMenus.filter(id => id !== menuId);
                                        setLocalSelectedMenus(newSelectedMenus);
                                      }
                                    }

                                    console.log('Updated local state');
                                    console.log('Local permissions after update:', newPermissions);

                                    // Update panel selection based on permissions
                                    updatePanelSelection(panel.id);
                                  }}
                                >
                                  <span style={{ fontSize: '12px' }}> <EyeOutlined/> View</span>
                                </Checkbox>

                                <Checkbox
                                  checked={localPermissions[`${panel.id}-${menu.id}`]?.insert || false}
                                  onChange={(e) => {
                                    // Update local permissions directly
                                    const newPermissions = { ...localPermissions };
                                    const menuKey = `${panel.id}-${menu.id}`;
                                    const existingPermissions = newPermissions[menuKey] || {};

                                    newPermissions[menuKey] = {
                                      ...existingPermissions,
                                      insert: e.target.checked
                                    };

                                    setLocalPermissions(newPermissions);

                                    // Ensure menu is added to selected menus if any permission is selected
                                    const menuId = `${panel.id}-${menu.id}`;
                                    if (e.target.checked && !localSelectedMenus.includes(menuId)) {
                                      const newSelectedMenus = [...localSelectedMenus, menuId];
                                      setLocalSelectedMenus(newSelectedMenus);
                                    } else if (!e.target.checked) {
                                      // Check if any other permissions are still selected
                                      const hasOtherPermissions = existingPermissions.view || existingPermissions.update || existingPermissions.delete;
                                      if (!hasOtherPermissions && localSelectedMenus.includes(menuId)) {
                                        const newSelectedMenus = localSelectedMenus.filter(id => id !== menuId);
                                        setLocalSelectedMenus(newSelectedMenus);
                                      }
                                    }

                                    // Update panel selection based on permissions
                                    updatePanelSelection(panel.id);
                                  }}
                                >
                                  <span style={{ fontSize: '12px' }}> <PlusOutlined/> Insert</span>
                                </Checkbox>

                                <Checkbox
                                  checked={localPermissions[`${panel.id}-${menu.id}`]?.update || false}
                                  onChange={(e) => {
                                    // Update local permissions directly
                                    const newPermissions = { ...localPermissions };
                                    const menuKey = `${panel.id}-${menu.id}`;
                                    const existingPermissions = newPermissions[menuKey] || {};

                                    newPermissions[menuKey] = {
                                      ...existingPermissions,
                                      update: e.target.checked
                                    };

                                    setLocalPermissions(newPermissions);

                                    // Ensure menu is added to selected menus if any permission is selected
                                    const menuId = `${panel.id}-${menu.id}`;
                                    if (e.target.checked && !localSelectedMenus.includes(menuId)) {
                                      const newSelectedMenus = [...localSelectedMenus, menuId];
                                      setLocalSelectedMenus(newSelectedMenus);
                                    } else if (!e.target.checked) {
                                      // Check if any other permissions are still selected
                                      const hasOtherPermissions = existingPermissions.view || existingPermissions.insert || existingPermissions.delete;
                                      if (!hasOtherPermissions && localSelectedMenus.includes(menuId)) {
                                        const newSelectedMenus = localSelectedMenus.filter(id => id !== menuId);
                                        setLocalSelectedMenus(newSelectedMenus);
                                      }
                                    }

                                    // Update panel selection based on permissions
                                    updatePanelSelection(panel.id);
                                  }}
                                >
                                  <span style={{ fontSize: '12px' }}> <EditOutlined/> Update</span>
                                </Checkbox>

                                <Checkbox
                                  checked={localPermissions[`${panel.id}-${menu.id}`]?.delete || false}
                                  onChange={(e) => {
                                    // Update local permissions directly
                                    const newPermissions = { ...localPermissions };
                                    const menuKey = `${panel.id}-${menu.id}`;
                                    const existingPermissions = newPermissions[menuKey] || {};

                                    newPermissions[menuKey] = {
                                      ...existingPermissions,
                                      delete: e.target.checked
                                    };

                                    setLocalPermissions(newPermissions);

                                    // Ensure menu is added to selected menus if any permission is selected
                                    const menuId = `${panel.id}-${menu.id}`;
                                    if (e.target.checked && !localSelectedMenus.includes(menuId)) {
                                      const newSelectedMenus = [...localSelectedMenus, menuId];
                                      setLocalSelectedMenus(newSelectedMenus);
                                    } else if (!e.target.checked) {
                                      // Check if any other permissions are still selected
                                      const hasOtherPermissions = existingPermissions.view || existingPermissions.insert || existingPermissions.update;
                                      if (!hasOtherPermissions && localSelectedMenus.includes(menuId)) {
                                        const newSelectedMenus = localSelectedMenus.filter(id => id !== menuId);
                                        setLocalSelectedMenus(newSelectedMenus);
                                      }
                                    }

                                    // Update panel selection based on permissions
                                    updatePanelSelection(panel.id);
                                  }}
                                >
                                  <span style={{ fontSize: '12px' }}> <DeleteOutlined/> Delete</span>
                                </Checkbox>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{
                          marginLeft: '24px',
                          fontSize: '12px',
                          color: '#bfbfbf',
                          fontStyle: 'italic'
                        }}>
                          No menus available for this panel
                        </div>
                      )}
                    </div>
                  ))}
                  </div>
                )}
              </div>

            {/* Menu Selection */}
            <div style={{
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                padding: '16px',
                width: '400px',
                height: 'calc(100vh - 400px)',
                overflowY: 'auto',
              }}>
                {(() => {
                  // Use local state directly
                  if (localSelectedMenus.length === 0) {
                    return (
                      <div style={{ fontSize: '12px', color: '#8c8c8c', fontStyle: 'italic' }}>
                        No menus selected
                      </div>
                    );
                  }

                  // Group menus by panel
                  const menusByPanel: Record<string, { panel: any; menus: any[] }> = {};

                  localSelectedMenus.forEach((menuId: string) => {
                    const [panelId, menuIdNum] = menuId.split('-');
                    const panel = panelsWithMenus.find(p => p.id === parseInt(panelId));
                    const menu = panel?.menus?.find(m => m.id === parseInt(menuIdNum));

                    if (!panel || !menu) return;

                    if (!menusByPanel[panelId]) {
                      menusByPanel[panelId] = { panel, menus: [] };
                    }
                    menusByPanel[panelId].menus.push(menu);
                  });

                  return (
                    <div>
                      <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '12px' }}>
                        {localSelectedMenus.length} menu(s) selected:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {Object.values(menusByPanel).map(({ panel, menus }) => (
                          <div key={panel.id} style={{
                            border: '1px solid #e8e8e8',
                            borderRadius: '6px',
                            padding: '12px',
                            //backgroundColor: '#fafafa'
                          }}>
                            {/* Panel Header */}
                            <div style={{
                              fontWeight: 600,
                              fontSize: '14px',
                              // color: '#262626',
                              marginBottom: '8px',
                              paddingBottom: '6px',
                              borderBottom: '1px solid #f0f0f0'
                            }}>
                              {panel.name} ({menus.length} menu{menus.length > 1 ? 's' : ''})
                            </div>

                            {/* Menus List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {menus.map((menu) => (
                                <div
                                  key={`${panel.id}-${menu.id}`}
                                  style={{
                                    backgroundColor: '#e6f7ff',
                                    border: '1px solid #91d5ff',
                                    borderRadius: '4px',
                                    padding: '6px 10px',
                                    fontSize: '12px',
                                    color: '#1890ff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}
                                >
                                  <span style={{ fontSize: '10px', opacity: 0.7 }}>•</span>
                                  {menu.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
              </div>
          </>
        )}
      </Form>
    );
  };

  return (
    renderMultipleRoleForm()
  )
}



export default RoleMenuPermissionFormMultiple
