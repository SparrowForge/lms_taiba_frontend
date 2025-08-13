import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '@/store';

import {IAudit} from '@/types/audit';
import {IBasePaginatedResponse, IBaseResponse, Status} from '@/types/common';

import {auditService} from '@/services/auditService';

import {
    clearActionStatus,
    clearAudits,
    clearDetailsStatus,
    setActionStatus,
    setAudits,
    setAuditsByResource,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setSelectedAudit,
} from '@/store/slices/auditSlice';

export const useAudit = () => {
  const dispatch = useDispatch();
  const { audits, auditsByResource, selectedAudit, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.audits);

  // Load audit logs with pagination and search
  const loadAudits = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IAudit> = await auditService.getAudit(params);
        dispatch(setAudits(response?.data?.items ?? []));
        dispatch(
          setPagination(
            response?.data?.meta ?? {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          ),
        );
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load audit logs'
            : 'Failed to load audit logs';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load audit logs by resource/resourceId
  const loadAuditsByResource = useCallback(
    async (resource: string, resourceId: number, params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IAudit> = await auditService.getAuditByResource(resource, resourceId, params);
        dispatch(setAuditsByResource(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load audit logs by resource'
            : 'Failed to load audit logs by resource';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
  }, [dispatch]);

  // Load a single audit log
  const loadAudit = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IAudit> = await auditService.getAuditById(id);
        dispatch(setSelectedAudit(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load audit log'
            : 'Failed to load audit log';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Clean audit logs
  const cleanAudit = useCallback(
    async (params = {}) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await auditService.cleanAudit(params);
        dispatch(clearAudits());
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Audit logs cleaned successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to clean audit logs'
            : 'Failed to clean audit logs';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get audit by ID from the current list
  const getAuditById = useCallback(
    (id: number) => {
      const audit = audits.find((audit) => audit.id === id);
      if (audit) {
        dispatch(setSelectedAudit(audit));
      } else {
        loadAudit(id);
      }
    },
    [dispatch],
  );

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  // Set selected audit
  const setSelected = useCallback(
    (audit: IAudit | null) => {
      dispatch(setSelectedAudit(audit));
    },
    [dispatch],
  );

  return {
    // State
    audits,
    auditsByResource,
    selectedAudit,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadAudits,
    loadAuditsByResource,
    loadAudit,
    cleanAudit,
    getAuditById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
