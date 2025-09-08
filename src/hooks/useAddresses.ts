import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Status} from '@/enums';
import {RootState} from '@/store';

import {IAddress, IAddressCreate, IAddressUpdate} from '@/types/address';
import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';

import {addressService} from '@/services/addressService';

import {
    addAddress,
    clearActionStatus,
    clearDetailsStatus,
    deleteAddress,
    setActionStatus,
    setAddresses,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setSelectedAddress,
    updateAddress,
} from '@/store/slices/addressSlice';

export const useAddresses = () => {
  const dispatch = useDispatch();
  const { addresses, selectedAddress, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.addresses);

  const loadAddresses = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IAddress> =
          await addressService.getAddresses(params);
        dispatch(setAddresses(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load addresses'
            : 'Failed to load addresses';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadAddress = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IAddress> = await addressService.getAddress(id);
        dispatch(setSelectedAddress(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load address'
            : 'Failed to load address';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createAddress = useCallback(
    async (data: IAddressCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IAddress = await addressService.createAddress(data);
        dispatch(addAddress(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Address created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create address'
            : 'Failed to create address';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editAddress = useCallback(
    async (id: number, data: IAddressUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IAddress = await addressService.updateAddress(id, data);
        dispatch(updateAddress(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Address updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update address'
            : 'Failed to update address';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeAddress = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await addressService.deleteAddress(id);
        dispatch(deleteAddress(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Address deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete address'
            : 'Failed to delete address';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getAddressById = useCallback(
    (id: number) => {
      if (selectedAddress && selectedAddress.id === id) {
        return;
      }

      const address = addresses.find((address) => address.id === id);
      if (address) {
        dispatch(setSelectedAddress(address));
      } else {
        loadAddress(id);
      }
    },
    [addresses, selectedAddress, dispatch, loadAddress],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (address: IAddress | null) => {
      dispatch(setSelectedAddress(address));
    },
    [dispatch],
  );

  return {
    addresses,
    selectedAddress,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadAddresses,
    loadAddress,
    createAddress,
    editAddress,
    removeAddress,
    getAddressById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
