import { FileExcelOutlined, UserAddOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Typography } from "antd";
import { useRouter } from "next/navigation";

import { LOCALE_KEYS } from "@/constants/localizationKeys";

import { useLocalization } from "@/hooks/useLocalization";

import { EntityConfig } from "./EntityList";


const { Title } = Typography;

const EntityListSmall = <T extends { id: number }>({ config }: { config: EntityConfig<T> }) => {
  const { t } = useLocalization();
  const router = useRouter();

  const handleAddItem = () => {
    router.push(`${config.route}/create`);
  };

  const handleExport = () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${config.exportUrl}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.name}.xlsx`;
    a.click();
  };

  // Build menu items dynamically




const menuItems: MenuProps["items"] = [
  ...((config.extraActions ?? []).map((action, index) => ({
    key: `extra-${index}`,
    label: action,
  })) as MenuProps["items"][number][]), // 👈 fix: cast to array of items

  !config.disableAddNew && {
    key: "add",
    label: (
      <Button
        type="text"
        icon={<UserAddOutlined />}
        onClick={handleAddItem}
       
      >
        {t(LOCALE_KEYS.ADD_NAME, { name: config.name })}
      </Button>
    ),
  },

  config.onQuickAdd && {
    key: "quickAdd",
    label: (
      <Button
        type="text"
        icon={<UserAddOutlined />}
        onClick={config.onQuickAdd}
       
      >
        {t(LOCALE_KEYS.QUICK_ADD_NAME, { name: config.name })}
      </Button>
    ),
  },

  config.exportUrl && {
    key: "export",
    label: (
      <Button
        type="text"
        icon={<FileExcelOutlined />}
        onClick={handleExport}
      
      >
        {t(LOCALE_KEYS.EXPORT)}
      </Button>
    ),
  },
].filter(Boolean) as MenuProps["items"]; // 👈 ensure final type



  return (
    <div className="flex justify-between items-center gap-10 pb-4">
      {/* Title */}
      <Title level={3} className="!mb-0 text-xl">
        {config.title}
      </Title>

      {/* More button */}
      <div className="mt-2">
        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          <Button icon={<MoreOutlined />}  />
        </Dropdown>
      </div>
    </div>
  );
};

export default EntityListSmall;
