import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import {
  ILeadActivityCreate,
  ILeadAssign,
  ILeadConvert,
  ILeadCreate,
  ILeadStageUpdate,
  ILeadUpdate,
} from '@/types/lead';

import { leadService } from '@/services/leadService';

import {
  addActivity,
  addLead,
  clearActionStatus,
  clearDetailsStatus,
  deleteLead,
  removeActivity,
  setActionStatus,
  setActivities,
  setActivitiesStatus,
  setDetailsStatus,
  setDueFollowUps,
  setFunnelStats,
  setLeads,
  setListStatus,
  setPagination,
  setSelectedLead,
  setSources,
  setStatsStatus,
  updateLead,
} from '@/store/slices/leadSlice';

const emptyPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

/** Pulls the API message out of an axios error, falling back to a default. */
const messageFrom = (error: unknown, fallback: string): string =>
  error instanceof AxiosError
    ? error?.response?.data?.message || error?.message || fallback
    : fallback;

export const useLeads = () => {
  const dispatch = useDispatch();
  const {
    leads,
    selectedLead,
    activities,
    funnelStats,
    sources,
    dueFollowUps,
    listStatus,
    detailsStatus,
    actionStatus,
    activitiesStatus,
    statsStatus,
    pagination,
  } = useSelector((state: RootState) => state.leads);

  const loadLeads = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response = await leadService.getLeads(params);
        dispatch(setLeads(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? emptyPagination));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        dispatch(
          setListStatus({
            status: Status.FAILED,
            message: messageFrom(error, 'Failed to load leads'),
          }),
        );
      }
    },
    [dispatch],
  );

  const loadLead = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response = await leadService.getLead(id);
        dispatch(setSelectedLead(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        dispatch(
          setDetailsStatus({
            status: Status.FAILED,
            message: messageFrom(error, 'Failed to load lead'),
          }),
        );
      }
    },
    [dispatch],
  );

  const createLead = useCallback(
    async (data: ILeadCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await leadService.createLead(data);
        dispatch(addLead(response.data));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Lead created successfully',
          }),
        );
        return response.data;
      } catch (error: unknown) {
        dispatch(
          setActionStatus({
            status: Status.FAILED,
            message: messageFrom(error, 'Failed to create lead'),
          }),
        );
        throw error;
      }
    },
    [dispatch],
  );

  const editLead = useCallback(
    async (id: number, data: ILeadUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await leadService.updateLead(id, data);
        dispatch(updateLead(response.data));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Lead updated successfully',
          }),
        );
        return response.data;
      } catch (error: unknown) {
        dispatch(
          setActionStatus({
            status: Status.FAILED,
            message: messageFrom(error, 'Failed to update lead'),
          }),
        );
        throw error;
      }
    },
    [dispatch],
  );

  const removeLead = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await leadService.deleteLead(id);
        dispatch(deleteLead(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Lead deleted successfully',
          }),
        );
      } catch (error: unknown) {
        dispatch(
          setActionStatus({
            status: Status.FAILED,
            message: messageFrom(error, 'Failed to delete lead'),
          }),
        );
        throw error;
      }
    },
    [dispatch],
  );

  // --- pipeline -----------------------------------------------------------

  const changeStage = useCallback(
    async (id: number, data: ILeadStageUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await leadService.updateStage(id, data);
        dispatch(updateLead(response.data));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Lead stage updated successfully',
          }),
        );
        return response.data;
      } catch (error: unknown) {
        dispatch(
          setActionStatus({
            status: Status.FAILED,
            message: messageFrom(error, 'Failed to update lead stage'),
          }),
        );
        throw error;
      }
    },
    [dispatch],
  );

  const assignLead = useCallback(
    async (id: number, data: ILeadAssign) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await leadService.assignLead(id, data);
        dispatch(updateLead(response.data));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Lead assigned successfully',
          }),
        );
        return response.data;
      } catch (error: unknown) {
        dispatch(
          setActionStatus({
            status: Status.FAILED,
            message: messageFrom(error, 'Failed to assign lead'),
          }),
        );
        throw error;
      }
    },
    [dispatch],
  );

  const convertLead = useCallback(
    async (id: number, data: ILeadConvert) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await leadService.convertLead(id, data);
        dispatch(updateLead(response.data.lead));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Lead converted to student successfully',
          }),
        );
        return response.data;
      } catch (error: unknown) {
        dispatch(
          setActionStatus({
            status: Status.FAILED,
            message: messageFrom(error, 'Failed to convert lead'),
          }),
        );
        throw error;
      }
    },
    [dispatch],
  );

  // --- timeline -----------------------------------------------------------

  const loadActivities = useCallback(
    async (leadId: number, params = {}) => {
      try {
        dispatch(setActivitiesStatus({ status: Status.LOADING }));
        const response = await leadService.getActivities(leadId, {
          limit: 50,
          ...params,
        });
        dispatch(setActivities(response?.data?.items ?? []));
        dispatch(setActivitiesStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        dispatch(
          setActivitiesStatus({
            status: Status.FAILED,
            message: messageFrom(error, 'Failed to load activities'),
          }),
        );
      }
    },
    [dispatch],
  );

  const logActivity = useCallback(
    async (leadId: number, data: ILeadActivityCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await leadService.addActivity(leadId, data);
        dispatch(addActivity(response.data));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Activity logged successfully',
          }),
        );
        return response.data;
      } catch (error: unknown) {
        dispatch(
          setActionStatus({
            status: Status.FAILED,
            message: messageFrom(error, 'Failed to log activity'),
          }),
        );
        throw error;
      }
    },
    [dispatch],
  );

  const deleteActivity = useCallback(
    async (activityId: number) => {
      await leadService.deleteActivity(activityId);
      dispatch(removeActivity(activityId));
    },
    [dispatch],
  );

  // --- reporting ----------------------------------------------------------

  const loadFunnelStats = useCallback(
    async (params = {}) => {
      try {
        dispatch(setStatsStatus({ status: Status.LOADING }));
        const response = await leadService.getFunnelStats(params);
        dispatch(setFunnelStats(response.data));
        dispatch(setStatsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        dispatch(
          setStatsStatus({
            status: Status.FAILED,
            message: messageFrom(error, 'Failed to load funnel statistics'),
          }),
        );
      }
    },
    [dispatch],
  );

  const loadDueFollowUps = useCallback(
    async (params = {}) => {
      try {
        const response = await leadService.getDueFollowUps(params);
        dispatch(setDueFollowUps(response.data ?? []));
      } catch {
        dispatch(setDueFollowUps([]));
      }
    },
    [dispatch],
  );

  const loadSources = useCallback(async () => {
    try {
      const response = await leadService.getLeadSources({ limit: 100 });
      dispatch(setSources(response?.data?.items ?? []));
    } catch {
      dispatch(setSources([]));
    }
  }, [dispatch]);

  const checkDuplicate = useCallback(async (email?: string, phone?: string) => {
    if (!email && !phone) return null;
    try {
      const response = await leadService.checkDuplicate(email, phone);
      return response.data.duplicate;
    } catch {
      return null;
    }
  }, []);

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);
  const setSelected = useCallback(
    (item: Parameters<typeof setSelectedLead>[0]) => {
      dispatch(setSelectedLead(item));
    },
    [dispatch],
  );

  return {
    leads,
    selectedLead,
    activities,
    funnelStats,
    sources,
    dueFollowUps,
    listStatus,
    detailsStatus,
    actionStatus,
    activitiesStatus,
    statsStatus,
    pagination,

    loadLeads,
    loadLead,
    createLead,
    editLead,
    removeLead,
    changeStage,
    assignLead,
    convertLead,
    loadActivities,
    logActivity,
    deleteActivity,
    loadFunnelStats,
    loadDueFollowUps,
    loadSources,
    checkDuplicate,
    clearAction,
    clearDetails,
    setSelected,
  };
};
