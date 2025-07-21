'use client'

import {Alert, Button, Card, Input, Space, Table, Typography} from 'antd'
import {FileExcelOutlined, SearchOutlined, UserAddOutlined} from '@ant-design/icons'
import {usePathname, useRouter} from 'next/navigation'
import {TableProps} from 'antd/es/table'

const { Title } = Typography
const { Search } = Input

// Generic interface for entity configuration
export interface EntityConfig<T> {
  name: string
  title: string
  route: string
  exportUrl?: string
  columns: TableProps<T>['columns']
  searchFields: (keyof T)[],
  onSearch?: (searchText: string) => void,
  onAdd?: () => void,
  items: T[],
  itemsCount: number,
  loading: boolean
  error: string | null | undefined,
}

// Generic EntityList component
export const EntityList = <T extends { id: number }>({ config }: { config: EntityConfig<T> }) => {
  //const [searchText, setSearchText] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const handleAddItem = () => {
    // if (config.onAdd) {
    //   config.onAdd()
    // } else {
    //   router.push(`${config.route}/create`)
    // }
    router.push(`${config.route}/create`)
  }

  const handleExport = () => {
    //download file from url
    const url = `${process.env.NEXT_PUBLIC_API_URL}${config.exportUrl}`
    //download file from url
    const a = document.createElement('a')
    a.href = url
    a.download = `${config.name}.xlsx`
    a.click()
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={2}>{config.title}</Title>
          <div style={{display: 'flex', gap: '16px'}}>

            <Button type="primary" icon={<UserAddOutlined />} onClick={handleAddItem} style={{backgroundColor: '#1890ff', borderColor: '#1890ff'}}>
              Add {config.name}
            </Button>

            {config.onAdd && (
              <Button type="primary" icon={<UserAddOutlined />} onClick={config.onAdd} style={{backgroundColor: '#722ed1', borderColor: '#722ed1'}}>
                Quick Add {config.name}
              </Button>
            )}
            {config.exportUrl && (
              <Button type="primary" icon={<FileExcelOutlined />} onClick={handleExport}>
                Export
              </Button>
            )}
          </div>
        </div>

        {config.error && (
          <Alert
            message="Error"
            description={config.error}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        <Space direction="vertical" style={{ width: '100%' }}>
          <Search
            placeholder={`Search ${config.name} by ${config.searchFields.join(', ')}`}
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
           // value={searchText}
            onChange={(e) => {
              //setSearchText(e.target.value)
              config.onSearch?.(e.target.value)
            }}
            style={{ maxWidth: '400px', marginBottom: '16px' }}
          />

          <Table
            loading={config.loading}
            columns ={config.columns}
            dataSource={config.items}
            rowKey="id"
            style={{border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px', }}
            pagination={{
              current: pathname.includes('skip=') ? parseInt(pathname.split('skip=')[1]) / 10 + 1 : 1,
              total: config.itemsCount ?? config.items.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} ${config.name}`,
              onChange: (page, pageSize) => {
                router.push(`${config.route}?skip=${(page - 1) * pageSize}&limit=${pageSize}`)
              }
            }}
          />
        </Space>
      </Card>
    </div>
  )
}
