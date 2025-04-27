import { useNoitaDataWakStore } from '../../stores/NoitaDataWak.ts';
import { useEffect, useMemo, useState } from 'react';
import {
  arrayHelpers,
  colorHelpers,
  imageHelpers,
} from '@noita-explorer/tools';
import { NoitaMaterial } from '@noita-explorer/model-noita';
import { StringKeyDictionary } from '@noita-explorer/model';

interface MaterialTreeNode extends NoitaMaterial {
  children: MaterialTreeNode[];
}

export const WikiMaterialsTree = () => {
  const { data } = useNoitaDataWakStore();

  const materialsUnique = useMemo(() => {
    if (!data?.materials) {
      return [];
    }

    return arrayHelpers.uniqueBy(data.materials, (m) => m.id);
  }, [data?.materials]);

  const materialHierarchy = useMemo(() => {
    const materialMap: StringKeyDictionary<MaterialTreeNode> = {};

    materialsUnique.forEach((material) => {
      materialMap[material.id] = { ...material, children: [] };
    });

    const rootNodes: MaterialTreeNode[] = [];

    materialsUnique.forEach((material) => {
      const materialNode = materialMap[material.id];

      if (material.parent === undefined) {
        rootNodes.push(materialNode);
      } else {
        const parent = materialMap[material.parent.id];
        parent.children.push(materialNode);
      }
    });

    return rootNodes;
  }, [materialsUnique]);

  if (!data?.materials) {
    return <div>Noita Data Wak is not loaded.</div>;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '6fr 6fr',
        gap: 20,
        maxWidth: '1220px', // 500px left panel + 20px gap + 500px right panel
        margin: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '700px',
          minWidth: '200px',
          position: 'relative',
        }}
      >
        <MaterialTreeView data={materialHierarchy} />
      </div>
      {/*<div>
        <Card style={{ position: 'sticky', top: 0 }}>
          {!selectedEnemy && <span>Select an enemy</span>}
          {selectedEnemy && <EnemyOverview enemy={selectedEnemy} />}
        </Card>
      </div>*/}
    </div>
  );
};

interface MaterialTreeNodeComponentProps {
  node: MaterialTreeNode;
}
const MaterialTreeNodeComponent = ({
  node,
}: MaterialTreeNodeComponentProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [textColor, setTextColor] = useState<'black' | 'white'>();
  const [textBackgroundColor, setTextBackgroundColor] = useState<string>();

  useEffect(() => {
    if (node.graphicsImageBase64) {
      imageHelpers
        .getAverageColorBase64(node.graphicsImageBase64)
        .then((color) => {
          setTextBackgroundColor(color);
          const contrast = colorHelpers.getRgbaContractsColor(color);
          setTextColor(contrast);
        });
    } else {
      const color = node.graphicsColor ?? node.wangColorHtml;
      const contrast = colorHelpers.getRgbaContractsColor(color);
      setTextColor(contrast);
    }
  }, [node]);

  return (
    <div style={{ marginLeft: '16px' }}>
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '4px',
          borderRadius: '4px',
          marginBottom: '2px',
          maxWidth: 'fit-content',
        }}
      >
        {node.children.length > 0 && (
          <span style={{ fontWeight: 'bold', marginRight: '6px' }}>
            {collapsed ? '▶' : '▼'}
          </span>
        )}

        <div
          style={{
            padding: 10,
            backgroundImage: `url(${node.graphicsImageBase64})`,
            backgroundColor: node.graphicsColor ?? node.wangColorHtml,
          }}
        >
          <div
            style={{ backgroundColor: textBackgroundColor, color: textColor }}
          >
            <span style={{ fontSize: 18 }}>{node.name}</span>
            <br />
            <i>{node.id}</i>
            <br />
            <i>{node.graphicsColor}</i>
            <br />
            <i>{node.wangColorHtml}</i>
          </div>
        </div>
      </div>
      {!collapsed && (
        <div
          style={{
            marginLeft: '16px',
            paddingLeft: '8px',
            borderLeft: '2px solid #ddd',
          }}
        >
          {node.children.map((child) => (
            <MaterialTreeNodeComponent key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

interface MaterialTreeViewProps {
  data: MaterialTreeNode[];
}
const MaterialTreeView = ({ data }: MaterialTreeViewProps) => {
  return (
    <div style={{ padding: '16px', fontFamily: 'Arial, sans-serif' }}>
      {data.map((node) => (
        <MaterialTreeNodeComponent key={node.id} node={node} />
      ))}
    </div>
  );
};
