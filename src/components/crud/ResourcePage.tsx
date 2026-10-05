'use client';

import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';

import { api } from '@/lib/axios';

import type { ColumnsType } from 'antd/es/table';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'switch' | 'date' | 'time';
  required?: boolean;
  options?: SelectOption[];
  /** Load select options from a list endpoint (paginated `{ items }` or plain array). */
  remote?: { url: string; label: (row: any) => string; params?: Record<string, unknown> };
  min?: number;
  max?: number;
  placeholder?: string;
  /** Only shown when creating. */
  createOnly?: boolean;
}

export interface RowAction<T> {
  label: string;
  danger?: boolean;
  show?: (row: T) => boolean;
  /** When set, the action collects these fields in a modal before calling `run`. */
  fields?: FieldDef[];
  run: (row: T, values: Record<string, any>) => Promise<unknown>;
}

export interface ResourcePageProps<T extends { id: number }> {
  title: string;
  /** REST path relative to the API base URL, e.g. `/designations`. */
  endpoint: string;
  /** Override the URL used to list rows; `null` skips loading (e.g. until a filter is chosen). */
  listUrl?: string | null;
  /** False when the list endpoint takes no paging/search query params (paged in the browser). */
  serverPaged?: boolean;
  columns: ColumnsType<T>;
  fields?: FieldDef[];
  /** Select filters sent as query params. */
  filters?: Array<{ name: string; label: string; options: SelectOption[] }>;
  searchable?: boolean;
  canCreate?: boolean;
  canEdit?: (row: T) => boolean;
  canDelete?: (row: T) => boolean;
  rowActions?: RowAction<T>[];
  /** Initial form values for a new record. */
  defaults?: Record<string, unknown>;
  /** Adjust the payload before create/update. */
  toPayload?: (values: Record<string, any>, editing: T | null) => Record<string, any>;
  /** Adjust a row before it fills the edit form. */
  toFormValues?: (row: T) => Record<string, any>;
  /** Extra controls rendered next to the filters. */
  toolbar?: React.ReactNode;
}

const errorMessage = (e: unknown, fallback: string): string => {
  const msg = (e as { response?: { data?: { message?: string | string[] } } })?.response?.data
    ?.message;
  if (Array.isArray(msg)) return msg.join(', ');
  return msg || (e as Error)?.message || fallback;
};

const unwrapItems = (payload: any): any[] => {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const RemoteSelect = ({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value?: unknown;
  onChange?: (v: unknown) => void;
}) => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!field.remote) return;
    let cancelled = false;
    setLoading(true);
    api
      .get(field.remote.url, { params: { limit: 100, ...field.remote.params } })
      .then((res) => {
        if (cancelled) return;
        setOptions(
          unwrapItems(res.data).map((row) => ({
            value: row.id,
            label: field.remote!.label(row),
          })),
        );
      })
      .catch(() => !cancelled && setOptions([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.remote?.url]);

  return (
    <Select
      showSearch
      allowClear
      loading={loading}
      options={options}
      optionFilterProp="label"
      placeholder={field.placeholder}
      value={value as any}
      onChange={onChange}
    />
  );
};

export const FieldInput = ({ field }: { field: FieldDef }) => {
  switch (field.type) {
    case 'textarea':
      return <Input.TextArea rows={3} placeholder={field.placeholder} />;
    case 'number':
      return (
        <InputNumber
          style={{ width: '100%' }}
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
        />
      );
    case 'select':
      return field.remote ? (
        <RemoteSelect field={field} />
      ) : (
        <Select allowClear options={field.options} placeholder={field.placeholder} />
      );
    case 'date':
      return <DatePicker style={{ width: '100%' }} />;
    case 'time':
      return <Input type="time" />;
    default:
      return <Input placeholder={field.placeholder} />;
  }
};

/** Convert antd form values to the API shape (dayjs -> YYYY-MM-DD, empty -> undefined). */
export const serializeValues = (values: Record<string, any>): Record<string, any> => {
  const out: Record<string, any> = {};
  Object.entries(values).forEach(([key, value]) => {
    if (value === '' || value === null || value === undefined) return;
    out[key] = dayjs.isDayjs(value) ? value.format('YYYY-MM-DD') : value;
  });
  return out;
};

const hydrateValues = (fields: FieldDef[], row: Record<string, any>): Record<string, any> => {
  const out: Record<string, any> = { ...row };
  fields.forEach((f) => {
    if (f.type === 'date' && row[f.name]) out[f.name] = dayjs(row[f.name]);
  });
  return out;
};

export const FieldsForm = ({ fields, editing }: { fields: FieldDef[]; editing?: boolean }) => (
  <>
    {fields
      .filter((f) => !(editing && f.createOnly))
      .map((f) => (
        <Form.Item
          key={f.name}
          name={f.name}
          label={f.label}
          valuePropName={f.type === 'switch' ? 'checked' : 'value'}
          rules={f.required ? [{ required: true, message: `${f.label} is required` }] : undefined}
        >
          {f.type === 'switch' ? <Switch /> : <FieldInput field={f} />}
        </Form.Item>
      ))}
  </>
);

export function ResourcePage<T extends { id: number }>({
  title,
  endpoint,
  listUrl,
  serverPaged = true,
  columns,
  fields = [],
  filters = [],
  searchable = true,
  canCreate = true,
  canEdit = () => true,
  canDelete = () => true,
  rowActions = [],
  defaults,
  toPayload,
  toFormValues,
  toolbar,
}: ResourcePageProps<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const [action, setAction] = useState<{ def: RowAction<T>; row: T } | null>(null);
  const [actionForm] = Form.useForm();

  const load = useCallback(async () => {
    if (listUrl === null) {
      setRows([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(listUrl ?? endpoint, {
        params: serverPaged
          ? { page, limit, search: search || undefined, ...filterValues }
          : undefined,
      });
      const data = res.data?.data ?? res.data;
      const items = unwrapItems(res.data) as T[];
      setRows(items);
      setTotal(serverPaged ? (data?.meta?.total ?? items.length) : items.length);
    } catch (e) {
      setError(errorMessage(e, `Failed to load ${title.toLowerCase()}`));
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [endpoint, listUrl, serverPaged, page, limit, search, filterValues, title]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue(defaults ?? {});
    setModalOpen(true);
  };

  const openEdit = (row: T) => {
    setEditing(row);
    form.resetFields();
    form.setFieldsValue(hydrateValues(fields, toFormValues ? toFormValues(row) : (row as any)));
    setModalOpen(true);
  };

  const submit = async () => {
    const values = await form.validateFields();
    let payload = serializeValues(values);
    if (toPayload) payload = toPayload(payload, editing);
    setSaving(true);
    try {
      if (editing) {
        await api.patch(`${endpoint}/${editing.id}`, payload);
        toast.success(`${title} updated`);
      } else {
        await api.post(endpoint, payload);
        toast.success(`${title} created`);
      }
      setModalOpen(false);
      load();
    } catch (e) {
      toast.error(errorMessage(e, 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: T) => {
    try {
      await api.delete(`${endpoint}/${row.id}`);
      toast.success(`${title} deleted`);
      load();
    } catch (e) {
      toast.error(errorMessage(e, 'Delete failed'));
    }
  };

  const runAction = async (def: RowAction<T>, row: T, values: Record<string, any>) => {
    try {
      await def.run(row, serializeValues(values));
      toast.success(`${def.label} done`);
      setAction(null);
      load();
    } catch (e) {
      toast.error(errorMessage(e, `${def.label} failed`));
    }
  };

  const allColumns: ColumnsType<T> = useMemo(
    () => [
      ...columns,
      {
        title: 'Actions',
        key: '__actions',
        width: 120 + rowActions.length * 70,
        render: (_: unknown, row: T) => (
          <Space size={4} wrap>
            {rowActions
              .filter((a) => !a.show || a.show(row))
              .map((a) =>
                a.fields ? (
                  <Button
                    key={a.label}
                    size="small"
                    type="link"
                    danger={a.danger}
                    onClick={() => {
                      actionForm.resetFields();
                      setAction({ def: a, row });
                    }}
                  >
                    {a.label}
                  </Button>
                ) : (
                  <Popconfirm
                    key={a.label}
                    title={`${a.label}?`}
                    onConfirm={() => runAction(a, row, {})}
                  >
                    <Button size="small" type="link" danger={a.danger}>
                      {a.label}
                    </Button>
                  </Popconfirm>
                ),
              )}
            {fields.length > 0 && canEdit(row) && (
              <Button
                size="small"
                type="text"
                icon={<EditOutlined />}
                onClick={() => openEdit(row)}
              />
            )}
            {canDelete(row) && (
              <Popconfirm
                title={`Delete this ${title.toLowerCase()}?`}
                onConfirm={() => remove(row)}
              >
                <Button size="small" type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            )}
          </Space>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columns, rowActions, fields, canEdit, canDelete],
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <Card>
          <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }} wrap>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {title}
            </Typography.Title>
            <Space wrap>
              {searchable && (
                <Input.Search
                  allowClear
                  placeholder="Search"
                  prefix={<SearchOutlined />}
                  onSearch={(v) => {
                    setPage(1);
                    setSearch(v);
                  }}
                  style={{ width: 220 }}
                />
              )}
              {filters.map((f) => (
                <Select
                  key={f.name}
                  allowClear
                  placeholder={f.label}
                  options={f.options}
                  style={{ minWidth: 150 }}
                  onChange={(v) => {
                    setPage(1);
                    setFilterValues((prev) => ({ ...prev, [f.name]: v }));
                  }}
                />
              ))}
              {toolbar}
              {canCreate && fields.length > 0 && (
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                  Add {title}
                </Button>
              )}
            </Space>
          </Space>

          {error && (
            <Typography.Text type="danger" style={{ display: 'block', marginBottom: 12 }}>
              {error}
            </Typography.Text>
          )}

          <Table<T>
            rowKey="id"
            loading={loading}
            columns={allColumns}
            dataSource={rows}
            scroll={{ x: 'max-content' }}
            pagination={{
              current: page,
              pageSize: limit,
              total,
              showSizeChanger: true,
              onChange: (p, s) => {
                setPage(p);
                setLimit(s);
              },
            }}
          />
        </Card>

        <Modal
          open={modalOpen}
          title={`${editing ? 'Edit' : 'Add'} ${title}`}
          onCancel={() => setModalOpen(false)}
          onOk={submit}
          confirmLoading={saving}
          destroyOnClose
          forceRender
        >
          <Form form={form} layout="vertical">
            <FieldsForm fields={fields} editing={!!editing} />
          </Form>
        </Modal>

        <Modal
          open={!!action}
          title={action?.def.label}
          onCancel={() => setAction(null)}
          onOk={async () => {
            if (!action) return;
            const values = await actionForm.validateFields();
            await runAction(action.def, action.row, values);
          }}
          destroyOnClose
          forceRender
        >
          <Form form={actionForm} layout="vertical">
            <FieldsForm fields={action?.def.fields ?? []} />
          </Form>
        </Modal>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default ResourcePage;
