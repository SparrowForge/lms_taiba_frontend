import {useRouter} from 'next/navigation';
import {EntityDetailsConfig, EntityDetailsContent} from './EntityDetailsContent';

// Generic EntityDetails component (Page version with navigation)
export const EntityDetails = <T extends { id: number }>({ config }: { config: EntityDetailsConfig<T> }) => {
  const router = useRouter();

  const handleBack = () => {
    router.push(config.route);
  };

  const handleEdit = () => {
    if (config.item) {
      router.push(`${config.route}/${config.item.id}/edit`);
    }
  };

  return (
    <EntityDetailsContent
      config={{
        ...config,
        onBack: handleBack,
        onEdit: handleEdit
      }}
    />
  );
};
