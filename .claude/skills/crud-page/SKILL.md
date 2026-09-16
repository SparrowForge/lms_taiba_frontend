---
name: crud-page
description: Scaffold a complete CRUD page for one entity in this LMS admin panel — list/detail/create/edit routes, form and drawer components, Redux slice, hook, axios service, types, locale keys, and store/middleware registration. Use when adding a new managed resource to the frontend (e.g. "add a page for grade-scales", "scaffold CRUD for exam-venues", "new entity page"). Follows the existing roomTypes convention exactly.
---

# Scaffold a CRUD page

This project has ~70 CRUD pages that all follow one convention. This skill reproduces it exactly so a
new entity looks like it was always there. The canonical reference is the `roomTypes` set — the
templates in `templates/` were generated directly from those files.

## Step 1 — Collect the entity names

Ask the user for the entity if it is not obvious from the request, then derive every casing. Get
this table right before writing anything; every template substitution depends on it.

| Token | Meaning | Example |
| --- | --- | --- |
| `__PascalSingular__` | Interface / component prefix | `RoomType` |
| `__PascalPlural__` | Action and hook name part | `RoomTypes` |
| `__camelSingular__` | Service object, file names | `roomType` |
| `__camelPlural__` | Redux state key, slice name | `roomTypes` |
| `__kebabPlural__` | Route segment and API path | `room-types` |
| `__snakeSingular__` | Locale key | `room_type` |
| `__snakePlural__` | Locale key | `room_types` |
| `__TitleSingular__` | Human label | `Room Type` |
| `__TitlePlural__` | Human label | `Room Types` |
| `__lowerSingular__` | Inside error strings | `room type` |
| `__lowerPlural__` | Inside error strings | `room types` |
| `__CONST_SINGULAR__` | `LOCALE_KEYS` member | `ROOM_TYPE` |
| `__CONST_PLURAL__` | `LOCALE_KEYS` member | `ROOM_TYPES` |
| `__INITIALS__` | Avatar fallback, 2 chars | `RT` |

**The route segment must match the backend controller path.** Check
`lms_taiba_backend/src/<module>/<module>.controller.ts` for the `@Controller('api/v1/...')` value —
the frontend `api` instance already has `/api/v1` as its baseURL, so the service uses only the part
after it.

## Step 2 — Confirm the field list

The templates ship a minimal `name` + `status` entity. Ask the user what fields the entity has, or
read the backend entity at `lms_taiba_backend/src/<module>/entities/*.entity.ts` and mirror it.

Fields affect four files: `types.ts`, `Form.tsx` (inputs + validation), `config.tsx` (details rows),
and `list-page.tsx` (table columns). Leave the rest generic.

Field type → form control:

| Backend column | Form control |
| --- | --- |
| `varchar` / `text` | `<Input />` |
| `text` (long) | `<Input.TextArea />` |
| `int` / `decimal` | `<InputNumber style={{ width: '100%' }} />` |
| `boolean` | `<Switch />` with `valuePropName="checked"` |
| `date` / `timestamp` | `<DatePicker style={{ width: '100%' }} />` |
| `enum` | `<Select options={...} />` |
| FK (`xxxId`) | `<Select />` fed by that entity's `useXxx()` hook |
| status enum | `<StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />` — already in the template |

## Step 3 — Write the files

Copy each template, substituting every token from the Step 1 table. All paths are relative to `src/`.

| Template | Destination |
| --- | --- |
| `types.ts.tpl` | `types/__camelSingular__.ts` |
| `service.ts.tpl` | `services/__camelSingular__Service.ts` |
| `slice.ts.tpl` | `store/slices/__camelSingular__Slice.ts` |
| `hook.ts.tpl` | `hooks/use__PascalPlural__.ts` |
| `config.tsx.tpl` | `components/__camelPlural__/__camelSingular__Config.tsx` |
| `Form.tsx.tpl` | `components/__camelPlural__/__PascalSingular__Form.tsx` |
| `FormDrawer.tsx.tpl` | `components/__camelPlural__/__PascalSingular__FormDrawer.tsx` |
| `DetailsDrawer.tsx.tpl` | `components/__camelPlural__/__PascalSingular__DetailsDrawer.tsx` |
| `list-page.tsx.tpl` | `app/[locale]/__kebabPlural__/page.tsx` |
| `create-page.tsx.tpl` | `app/[locale]/__kebabPlural__/create/page.tsx` |
| `detail-page.tsx.tpl` | `app/[locale]/__kebabPlural__/[id]/page.tsx` |
| `edit-page.tsx.tpl` | `app/[locale]/__kebabPlural__/[id]/edit/page.tsx` |

## Step 4 — Register it in five places

New files alone do nothing. All five edits are required.

**1. `store/index.ts`** — three insertions, each in its existing alphabetical block:

```ts
import __camelSingular__Reducer from './slices/__camelSingular__Slice';   // import block
  __camelPlural__: ReturnType<typeof __camelSingular__Reducer>;           // RootState interface
    __camelPlural__: __camelSingular__Reducer,                            // configureStore reducer map
```

**2. `constants/localizationKeys.ts`** — add to `LOCALE_KEYS`:

```ts
  __CONST_SINGULAR__: '__snakeSingular__',
  __CONST_PLURAL__: '__snakePlural__',
  SELECT___CONST_SINGULAR__: 'select___snakeSingular__',
```

**3. `messages/en.json`** — flat keys, no nesting:

```json
  "__snakeSingular__": "__TitleSingular__",
  "__snakePlural__": "__TitlePlural__",
  "select___snakeSingular__": "Select __lowerSingular__",
```

**4. `messages/ar.json`** — the same three keys with Arabic values. Do not copy the English through;
this project currently has zero untranslated values and that is worth keeping. If you cannot produce
a confident translation, say so and leave it for the user rather than pasting English.

**5. `src/middleware.ts`** — add `'/__kebabPlural__'` to the `protectedRoutes` array.

> **Do not skip this.** `protectedRoutes` is an allow-list, and any route missing from it falls
> through with no authentication redirect at all. Many existing routes are already missing — that is
> a known gap, not a pattern to copy.

## Step 5 — Verify

```bash
npx prettier --write "src/**/<the files you touched>"
npx eslint --fix <the files you touched>
npx tsc --noEmit
```

`tsc` reports pre-existing errors in this repo. Compare against the count before your change and
confirm you added none — **do not** rely on `next build` passing, because `next.config.ts` sets
`typescript.ignoreBuildErrors: true` and will happily build broken code.

Then check by hand:

- List loads, paginates, and the status filter works
- Search hits the API (`onSearch` sends `search`, it does not filter client-side)
- Quick-add drawer, quick-edit drawer, and quick-view drawer each open and save
- The full-page create and edit routes save and redirect
- Delete removes the row
- Switch the locale to Arabic and confirm no raw key names appear on screen

## Conventions that matter

- **Every page is wrapped** in `<ProtectedRoute><MainLayout>…</MainLayout></ProtectedRoute>`.
- **Status lives in Redux, not local state** — `listStatus`, `detailsStatus`, `actionStatus`, each an
  `IStatusState` carrying `Status.INITIAL | LOADING | SUCCESS | FAILED` plus a message.
- **The hook is the only thing components touch.** Components never import the service or dispatch
  slice actions directly.
- **Hook methods swallow errors into `actionStatus` and re-throw** so the form can also toast. Keep
  both.
- **Create/update return the entity; the slice splices it into the list** rather than refetching.
- **List/detail/drawer share one `selected__PascalSingular__`.** Drawers pass `key={id}` to force a
  remount when the id changes — keep that or stale data shows.
- **Never hardcode UI strings.** Use `t(LOCALE_KEYS.X)`; the parameterised keys
  (`CREATE_NAME`, `EDIT_NAME`, `DETAILS_NAME`, `MANAGEMENT_NAME`, `FAILED_NAME`, `PLEASE_ENTER_NAME`)
  take `{ name: entityName }`.
- **Soft delete is the backend default** — `removeX` calls `DELETE` and the row disappears from the
  list; it is not a hard delete.

## Known rough edges in the existing pattern

These are inherited from the reference files. Reproduce the structure, but you do not have to
reproduce the mistakes:

- The list page's `useEffect` depends on `loadX` but calls `loadWithParams`; leave as-is for
  consistency unless you are fixing it deliberately.
- Several existing pages carry a commented-out `//getXById(id)` above `loadX(id)`. The templates keep
  the working call; drop the comment.
- `editX` returns the updated entity from the API. Some backend `update()` methods return a TypeORM
  `UpdateResult` (`{ affected: 1 }`) instead of the entity — if the row goes blank after an edit,
  that is the backend, not this scaffold.
