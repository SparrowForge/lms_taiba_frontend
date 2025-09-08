# 📚 **LMS Taiba Admin Panel - Entity Module Development Guide**

## 🎯 **Overview**

This document provides a comprehensive guide for creating and maintaining entity modules in the LMS Taiba Admin Panel. It serves as a reference for developers to understand the established patterns and architecture.

## 🏗️ **Architecture Overview**

### **Layered Architecture Pattern**

```
┌─────────────────────────────────────────────────────────────┐
│                    UI Layer (React Components)              │
├─────────────────────────────────────────────────────────────┤
│                Business Logic Layer (Custom Hooks)          │
├─────────────────────────────────────────────────────────────┤
│              State Management Layer (Redux Toolkit)         │
├─────────────────────────────────────────────────────────────┤
│                   Service Layer (API Calls)                 │
├─────────────────────────────────────────────────────────────┤
│                    Type Layer (TypeScript)                  │
└─────────────────────────────────────────────────────────────┘
```

## 📁 **File Structure Template**

```
src/
├── types/[entityName].ts                    # TypeScript interfaces
├── services/[entityName]Service.ts          # API communication
├── store/slices/[entityName]Slice.ts        # Redux state management
├── hooks/use[EntityName]s.ts                # Business logic
├── components/[entityName]s/
│   ├── [EntityName]Form.tsx                 # Form component
│   ├── [EntityName]FormDrawer.tsx           # Form drawer wrapper
│   ├── [EntityName]DetailsDrawer.tsx        # Details drawer
│   └── [entityName]Config.tsx               # Configuration
└── app/[locale]/[entity-name]s/
    ├── page.tsx                              # Main list page
    ├── create/page.tsx                       # Create page
    └── [id]/
        ├── page.tsx                          # Details page
        └── edit/page.tsx                     # Edit page
```

## 🔧 **Implementation Details**

### **1. Type Definitions**

```typescript
export interface I[EntityName] {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface I[EntityName]Create {
  name: string;
  status: string;
}

export interface I[EntityName]Update {
  name?: string;
  status?: string;
}
```

### **2. Service Layer**

```typescript
export const [entityName]Service = {
  get[EntityName]s: async (params = {}): Promise<IBasePaginatedResponse<I[EntityName]>>,
  get[EntityName]: async (id: number): Promise<IBaseResponse<I[EntityName]>>,
  create[EntityName]: async (data: I[EntityName]Create): Promise<I[EntityName]>,
  update[EntityName]: async (id: number, data: I[EntityName]Update): Promise<I[EntityName]>,
  delete[EntityName]: async (id: number): Promise<void>,
};
```

### **3. Redux State Management**

```typescript
interface I[EntityName]sState {
  listStatus: IStatusState;      // Loading states for list operations
  detailsStatus: IStatusState;   // Loading states for detail operations
  actionStatus: IStatusState;    // Loading states for CRUD operations
  [entityName]s: I[EntityName][]; // Data array
  selected[EntityName]: I[EntityName] | null; // Currently selected item
  pagination: IPaginationMeta;   // Pagination metadata
}
```

### **4. Custom Hooks**

```typescript
export const use[EntityName]s = () => {
  const { [entityName]s, selected[EntityName], listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.[entityName]s);

  const load[EntityName]s = useCallback(async (params = {}) => { /* ... */ }, [dispatch]);
  const create[EntityName] = useCallback(async (data: I[EntityName]Create) => { /* ... */ }, [dispatch]);
  const edit[EntityName] = useCallback(async (id: number, data: I[EntityName]Update) => { /* ... */ }, [dispatch]);
  const remove[EntityName] = useCallback(async (id: number) => { /* ... */ }, [dispatch]);

  return {
    [entityName]s, selected[EntityName], listStatus, detailsStatus, actionStatus, pagination,
    load[EntityName]s, load[EntityName], create[EntityName], edit[EntityName], remove[EntityName],
    get[EntityName]ById, clearAction, clearDetails, setSelected,
  };
};
```

### **5. Form Component Design Pattern**

```typescript
interface [EntityName]FormProps {
  mode: 'create' | 'edit';
  [entityName]Id?: number;
  initialValues?: Partial<I[EntityName]Create | I[EntityName]Update>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const [EntityName]Form: React.FC<[EntityName]FormProps> = ({
  mode,
  [entityName]Id,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.[ENTITY_NAME], { defaultValue: '[EntityName]' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { create[EntityName], edit[EntityName], actionStatus } = use[EntityName]s();

  // Form reset on create mode
  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  // Enhanced error handling with API response parsing
  const handleSubmit = async (values: Partial<I[EntityName]>) => {
    try {
      // ... CRUD operations
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
        name: entityName,
        defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}`,
      });

      // Try to extract error message from API response
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else {
        errorMessage = getErrorMessage(error);
      }

      toast.error(errorMessage);
    }
  };

  // Submit button text helper
  const getSubmitText = () =>
    mode === 'create'
      ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
      : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });

  // Form initial values only for edit mode
  const formContent = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={mode === 'edit' ? initialValues : undefined}
    >
      {/* Form fields */}
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel}>{t(LOCALE_KEYS.CANCEL)}</Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};
```

#### **Form Design Pattern Key Features:**

- **Mode-based Form Reset**: Forms reset fields on create mode
- **Enhanced Error Handling**: Sophisticated error handling with API response parsing
- **Submit Button Helper**: `getSubmitText()` function for consistent button text
- **Conditional Initial Values**: Only set initial values for edit mode
- **Enhanced Select Components**: Search functionality and filtering for dropdowns
- **StatusSelect Preset**: Use `preset="binary"` for consistent status handling
- **Improved Placeholders**: Field-specific localization keys instead of generic messages

#### **Select Component Pattern:**

```typescript
<Select
  placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.[FIELD_NAME]) })}
  loading={[options].length === 0}
  showSearch
  filterOption={(input, option) =>
    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
  }
>
  {[options].map((item) => (
    <Select.Option key={item.id} value={item.id}>
      {item.name}
    </Select.Option>
  ))}
</Select>
```

#### **StatusSelect Pattern:**

```typescript
<Form.Item
  name="status"
  label={t(LOCALE_KEYS.STATUS)}
  rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.STATUS) }) }]}
>
  <StatusSelect preset="binary" />
</Form.Item>
```

````

## 📋 **Checklist for New Entity Module**

### **Core Files**
- [ ] `src/types/[entityName].ts` - TypeScript interfaces
- [ ] `src/services/[entityName]Service.ts` - API service
- [ ] `src/store/slices/[entityName]Slice.ts` - Redux slice
- [ ] `src/hooks/use[EntityName]s.ts` - Custom hook

### **Components**
- [ ] `src/components/[entityName]s/[EntityName]Form.tsx` - Form component
- [ ] `src/components/[entityName]s/[EntityName]FormDrawer.tsx` - Form drawer
- [ ] `src/components/[entityName]s/[EntityName]DetailsDrawer.tsx` - Details drawer
- [ ] `src/components/[entityName]s/[entityName]Config.tsx` - Configuration

### **Form Component Requirements**
- [ ] Mode-based form reset (`create` vs `edit`)
- [ ] Enhanced error handling with API response parsing
- [ ] `getSubmitText()` helper function
- [ ] Conditional initial values (edit mode only)
- [ ] Enhanced Select components with search and filtering
- [ ] StatusSelect with `preset="binary"`
- [ ] Field-specific placeholders using localization keys
- [ ] Proper form validation rules
- [ ] Loading states for submit buttons
- [ ] Embedded mode support for drawers

### **Form Validation Patterns**
```typescript
// Required field validation
rules={[
  {
    required: true,
    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.[FIELD_NAME]) }),
  },
]}

// Number field validation with min value
rules={[
  {
    required: true,
    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.[FIELD_NAME]) }),
  },
  {
    type: 'number',
    min: 1,
    message: '[Field] must be at least 1',
  },
]}

// Email validation
rules={[
  {
    required: true,
    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.EMAIL) }),
  },
  {
    type: 'email',
    message: t(LOCALE_KEYS.INVALID_EMAIL),
  },
]}
````

### **Pages**

- [ ] `src/app/[locale]/[entity-name]s/page.tsx` - Main list page
- [ ] `src/app/[locale]/[entity-name]s/create/page.tsx` - Create page
- [ ] `src/app/[locale]/[entity-name]s/[id]/page.tsx` - Details page
- [ ] `src/app/[locale]/[entity-name]s/[id]/edit/page.tsx` - Edit page

### **Integration**

- [ ] Add to store (`src/store/index.ts`)
- [ ] Add localization keys (`src/constants/localizationKeys.ts`)
- [ ] Add translations to message files
- [ ] Test CRUD operations
- [ ] Verify routing works correctly

## 🚀 **Quick Start Template**

### **1. Copy Existing Entity**

```bash
# Copy RoomTypes structure
cp -r src/components/roomTypes src/components/[entityName]s
cp -r src/app/[locale]/room-types src/app/[locale]/[entity-name]s
```

### **2. Replace All Occurrences**

```bash
# Replace in all files
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/RoomType/[EntityName]/g'
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/roomType/[entityName]/g'
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/room-type/[entity-name]/g'
```

### **3. Update API Endpoint**

```typescript
// In service file
const response = await api.get<IBasePaginatedResponse<I[EntityName]>>('/[entity-name]s', {
  params,
});
```

## ⚠️ **Common Pitfalls to Avoid**

### **1. Component Naming**

- ❌ **Wrong**: `RoomTypeForm` (should be `[EntityName]Form`)
- ✅ **Correct**: `[EntityName]Form`

### **2. File Naming**

- ❌ **Wrong**: `roomTypeService.ts` (should be `[entityName]Service.ts`)
- ✅ **Correct**: `[entityName]Service.ts`

### **3. Route Paths**

- ❌ **Wrong**: `/room-types` (should be `/[entity-name]s`)
- ✅ **Correct**: `/[entity-name]s`

### **4. Import Paths**

- ❌ **Wrong**: `import { RoomTypeForm } from '@/components/roomTypes'`
- ✅ **Correct**: `import RoomTypeForm from '@/components/roomTypes/RoomTypeForm'`

### **5. Component Usage**

- ❌ **Wrong**: Using `EntityDetails` in drawer (should be `EntityDetailsContent`)
- ✅ **Correct**: Use `EntityDetailsContent` in drawer, `EntityDetails` in page

## 🔍 **Testing Checklist**

### **Functionality Tests**

- [ ] Create new entity
- [ ] Edit existing entity
- [ ] Delete entity
- [ ] View entity details
- [ ] Search functionality
- [ ] Pagination
- [ ] Sorting
- [ ] Filtering

### **UI Tests**

- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Success messages show
- [ ] Form validation works
- [ ] Drawers open/close properly
- [ ] Navigation works correctly

### **Form-Specific Tests**

- [ ] Form resets correctly on create mode
- [ ] Initial values load correctly on edit mode
- [ ] Select components show search and filtering
- [ ] Validation messages display correctly
- [ ] Submit button text changes based on mode
- [ ] Error handling shows appropriate messages
- [ ] Loading states work during form submission
- [ ] Form works in both embedded and standalone modes

## 📚 **Reference Examples**

### **Working Entity Modules**

- **RoomTypes** - Basic entity with name and status
- **ScheduleTypes** - Similar to RoomTypes
- **Addresses** - Complex entity with multiple fields
- **Users** - User management with roles
- **Courses** - Academic entity with relationships

### **Key UI Components**

- `EntityList` - Main list display
- `EntityActions` - Action buttons
- `StatusTag` - Status display
- `PageHeader` - Page title with back button
- `FormLayout` - Form wrapper
- `AsyncErrorBoundary` - Error handling

### **Common Form Field Types**

```typescript
// Text Input
<Form.Item name="name" label={t(LOCALE_KEYS.NAME)}>
  <Input placeholder={t(LOCALE_KEYS.NAME)} />
</Form.Item>

// Number Input
<Form.Item name="capacity" label={t(LOCALE_KEYS.CAPACITY)}>
  <InputNumber
    min={1}
    style={{ width: '100%' }}
    placeholder={t(LOCALE_KEYS.CAPACITY)}
  />
</Form.Item>

// Select with Search
<Form.Item name="typeId" label={t(LOCALE_KEYS.TYPE)}>
  <Select
    placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.TYPE) })}
    loading={types.length === 0}
    showSearch
    filterOption={(input, option) =>
      (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
    }
  >
    {types.map((type) => (
      <Select.Option key={type.id} value={type.id}>
        {type.name}
      </Select.Option>
    ))}
  </Select>
</Form.Item>

// Status Select
<Form.Item name="status" label={t(LOCALE_KEYS.STATUS)}>
  <StatusSelect preset="binary" />
</Form.Item>
```

## 🔄 **Store Integration**

### **Add to Store Index**

```typescript
// src/store/index.ts

// Add import
import [entityName]Reducer from './slices/[entityName]Slice';

// Add to RootState interface
export interface RootState {
  // ... existing state
  [entityName]s: ReturnType<typeof [entityName]Reducer>;
}

// Add to store reducer
export const store = configureStore({
  reducer: {
    // ... existing reducers
    [entityName]s: [entityName]Reducer,
  },
});
```

## 🌐 **Localization Integration**

### **Add Localization Keys**

```typescript
// src/constants/localizationKeys.ts

export const LOCALE_KEYS = {
  // ... existing keys
  [ENTITY_NAME]: '[entity_name]',
  [ENTITY_NAME]S: '[entity_name]s',
  SELECT_[ENTITY_NAME]: 'select_[entity_name]',
} as const;
```

---

**Last Updated**: 16, August, 2025
**Version**: 1.0
**Maintainer**: Development Team

This guide should be updated whenever new patterns or best practices are established in the codebase.
