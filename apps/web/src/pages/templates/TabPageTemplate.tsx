import { TabView } from '@noita-explorer/noita-component-library';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { constants } from '../../constants.ts';
import { useTemplatePageLogic } from '../../hooks/useTemplatePageLogic';

interface TabLink {
  title: string;
  href: string;
}

interface TabPageTemplateProps {
  tabs: TabLink[];
}

export const TabPageTemplate = ({ tabs }: TabPageTemplateProps) => {
  const templatePageLogic = useTemplatePageLogic();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          maxHeight: '100%',
          width: '90%',
        }}
      >
        <TabView
          styleCard={{
            maxHeight: constants.pageHeight,
          }}
          tabs={tabs.map((t) => ({
            id: t.title,
            title: t.title,
            content: <Outlet />,
            onClick: () => navigate(t.href),
          }))}
          initialActiveTabId={
            tabs.find((t) => t.href === location.pathname)?.title
          }
        />

        <div
          style={{
            marginTop: 10,
          }}
        >
          {templatePageLogic.buttons.map((b) => b.element)}
        </div>
      </div>
    </div>
  );
};
