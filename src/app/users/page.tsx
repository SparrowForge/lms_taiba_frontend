'use client'

import {EntityConfig, EntityList} from "@/components/ui/EntityList"
import {IUser} from "@/types/user"
import {useUsers} from "@/hooks/useUsers"
import {useEffect, useState} from "react"
import {Status} from "@/types/common"
import EntityActions from "@/components/ui/EntityActions"
import {MainLayout} from "@/components/layout/MainLayout"
import {ProtectedRoute} from "@/components/auth/ProtectedRoute"
import {useRouter} from "next/navigation"
import UserFormDrawer from "@/components/users/UserFormModal"
import UserDetailsDrawer from "@/components/users/UserDetailsDrawer"

export default function UsersPage() {
    const router = useRouter()
    const [drawerVisible, setDrawerVisible] = useState(false)
    const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create')
    const [selectedUserId, setSelectedUserId] = useState<number | undefined>()
    const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false)
    const [selectedDetailsUserId, setSelectedDetailsUserId] = useState<number | undefined>()

    const { users, listStatus, pagination, loadUsers,} = useUsers()

    // Fetch data on component mount
    useEffect(() => {
      loadUsers({page: 1, limit: 10})
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    console.log(users)

    const handleEditDrawer = (userId: number) => {
      setSelectedUserId(userId)
      setDrawerMode('edit')
      setDrawerVisible(true)
    }

    const handleCreateDrawer = () => {
      setSelectedUserId(undefined)
      setDrawerMode('create')
      setDrawerVisible(true)
    }

    const handleDrawerSuccess = () => {
      loadUsers({page: 1, limit: 10}) // Refresh the list
    }

    const handleViewDetails = (userId: number) => {
      setSelectedDetailsUserId(userId)
      setDetailsDrawerVisible(true)
    }

    const handleDetailsEdit = (userId: number) => {
      setDetailsDrawerVisible(false)
      setSelectedUserId(userId)
      setDrawerMode('edit')
      setDrawerVisible(true)
    }

    const config: EntityConfig<IUser> = {
      name: 'user',
      title: 'Users Management',
      route: '/users',
      exportUrl: '/users/export',
      searchFields: ['name', 'email'] as (keyof IUser)[],
      onSearch: (searchText: string) => {
        loadUsers({page: 1, limit: 10, search: searchText})
      },
      onAdd: handleCreateDrawer,
      items: users,
      itemsCount: pagination?.total ?? 0,
      loading: listStatus.status === Status.LOADING,
      error: listStatus.status === Status.FAILED ? listStatus.message : null,
      columns: [
        {
          title: 'First Name',
          dataIndex: 'firstName',
          key: 'firstName',
          render: (text: string) => <span>{text}</span>
        },
        {
          title: 'Last Name',
          dataIndex: 'lastName',
          key: 'lastName',
          render: (text: string) => <span>{text}</span>
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          render: (text: string) => <span>{text}</span>
        },
        {
          title: 'Phone',
          dataIndex: 'phone',
          key: 'phone',
          render: (text: string) => <span>{text}</span>
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (text: string) => <span>{text}</span>
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 250,
          render: (user: IUser) => <EntityActions
            onView={() => router.push(`/users/${user.id}`)}
            onViewModal={handleViewDetails}
            viewModalText="Quick View"
            onEdit={() => router.push(`/users/${user.id}/edit`)}
            onEditModal={handleEditDrawer}
            editModalText="Quick Edit"
            onDelete={() => router.push(`/users/${user.id}/delete`)}
            id={user.id} />
        },

      ]
    }

    return <ProtectedRoute>
        <MainLayout>
            <EntityList config ={config as EntityConfig<IUser>} />

            <UserFormDrawer
              mode={drawerMode}
              userId={selectedUserId}
              visible={drawerVisible}
              onCancel={() => setDrawerVisible(false)}
              onSuccess={handleDrawerSuccess}
            />

            <UserDetailsDrawer
              userId={selectedDetailsUserId}
              visible={detailsDrawerVisible}
              onClose={() => setDetailsDrawerVisible(false)}
              onEdit={handleDetailsEdit}
            />
        </MainLayout>
    </ProtectedRoute>


}
