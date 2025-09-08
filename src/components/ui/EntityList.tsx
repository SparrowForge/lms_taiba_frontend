'use client';

import {FileExcelOutlined, SearchOutlined, UserAddOutlined} from '@ant-design/icons';
import {Alert, Button, Card, Input, Pagination, Table, Typography} from 'antd';
import {TableProps} from 'antd/es/table';
import {useRouter, useSearchParams} from 'next/navigation';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

const { Title } = Typography;
const { Search } = Input;

// Generic interface for entity configuration
export interface EntityConfig<T> {
  name: string;
  title: string;
  route: string;
  exportUrl?: string;
  columns: TableProps<T>['columns'];
  searchFields: (keyof T)[];
  onSearch?: (searchText: string) => void;
  onQuickAdd?: () => void;
  disableAddNew?: boolean;
  items: T[];
  itemsCount: number;
  loading: boolean;
  error: string | null | undefined;
  extraActions?: React.ReactNode[];
}

// Generic EntityList component
export const EntityList = <T extends { id: number }>({ config }: { config: EntityConfig<T> }) => {
  const { t } = useLocalization();
  const router = useRouter();
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');
  const handleAddItem = () => {
    // if (config.onAdd) {
    //   config.onAdd()
    // } else {
    //   router.push(`${config.route}/create`)
    // }
    router.push(`${config.route}/create`);
  };

  const handleExport = () => {
    //download file from url
    const url = `${process.env.NEXT_PUBLIC_API_URL}${config.exportUrl}`;
    //download file from url
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name}.xlsx`;
    a.click();
  };

  return (
    <div style={{ padding: '8px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Fixed Top Section */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            paddingBottom: '16px',
            borderBottom: '1px solid #f0f0f0',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <Title level={2}>{config.title}</Title>
            <div style={{ display: 'flex', gap: '16px' }}>
              {config.extraActions?.map((action, index) => (
                <div key={index}>{action}</div>
              ))}
              {!config.disableAddNew && (
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={handleAddItem}
                  style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                >
                  {t(LOCALE_KEYS.ADD_NAME, { name: config.name })}
                </Button>
              )}

              {config.onQuickAdd && (
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={config.onQuickAdd}
                  style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
                >
                  {t(LOCALE_KEYS.QUICK_ADD_NAME, { name: config.name })}
                </Button>
              )}
              {config.exportUrl && (
                <Button type="primary" icon={<FileExcelOutlined />} onClick={handleExport}>
                  {t(LOCALE_KEYS.EXPORT)}
                </Button>
              )}
            </div>
          </div>

          {config.error && (
            <Alert
              message={t(LOCALE_KEYS.ERROR)}
              description={config.error}
              type="error"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}

          {config.onSearch && (
            <Search
              placeholder={t(LOCALE_KEYS.SEARCH_NAME, {
                name: config.name,
                fields: config.searchFields.join(', '),
              })}
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={(value) => {
                config.onSearch?.(value);
              }}
              size="large"
              style={{ maxWidth: '400px' }}
            />
          )}
        </div>

        {/* Scrollable Table Section */}
        <div
          style={{ flex: 1, overflow: 'auto', marginBottom: '16px', height: 'calc(100vh - 200px)' }}
        >
          <Table
            scroll={{ y: 'calc(100vh - 360px)' }}
            loading={config.loading}
            columns={config.columns}
            dataSource={config.items}
            rowKey="id"
            style={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}
            pagination={false}
          />
        </div>

        {/* Fixed Bottom Pagination */}
        <div
          style={{
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
            // backgroundColor: '#fff',
            paddingTop: '12px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: '12px',
          }}
        >
          <Pagination
            current={skip ? parseInt(skip ?? '0') / parseInt(limit ?? '10') + 1 : 1}
            total={config.itemsCount ?? config.items.length}
            pageSize={parseInt(limit ?? '10')}
            showSizeChanger={true}
            showQuickJumper={true}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} ${t(LOCALE_KEYS.OF)} ${total} ${config.name}`
            }
            onChange={(page, pageSize) => {
              router.push(`${config.route}?skip=${(page - 1) * pageSize}&limit=${pageSize}`);
            }}
          />
        </div>
      </Card>
    </div>
  );
};
