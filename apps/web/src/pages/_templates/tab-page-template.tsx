import { TabView } from '@noita-explorer/noita-component-library';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { constants } from '../../constants.ts';
import { useTemplatePageLogic } from '../../hooks/use-template-page-logic.tsx';
import { useEffect, useState } from 'react';
import { stringHelpers } from '@noita-explorer/tools';

interface TabLink {
  title: string;
  href: string;
}

interface TabPageTemplateProps {
  tabs: TabLink[];
  returnPath?: string;
}

export const TabPageTemplate = ({ tabs, returnPath }: TabPageTemplateProps) => {
  const templatePageLogic = useTemplatePageLogic(returnPath);
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<TabLink | undefined>(
    tabs.length > 0 ? tabs[0] : undefined,
  );

  useEffect(() => {
    const tab = tabs.find(
      (t) =>
        stringHelpers.trim({
          text: t.href,
          fromEnd: '/',
        }) ===
        stringHelpers.trim({
          text: location.pathname,
          fromEnd: '/',
        }),
    );
    setActiveTab(tab);
  }, [tabs, location.pathname]);

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
        {activeTab && (
          <TabView
            styleCard={{
              maxHeight: constants.pageHeight,
            }}
            activeTabId={activeTab.title}
          >
            {tabs.map((t, index) => (
              <TabView.Item
                key={t.title}
                id={t.title}
                text={t.title}
                index={index}
                onClick={() => navigate(t.href)}
              >
                <Outlet />
              </TabView.Item>
            ))}
          </TabView>
        )}

        <div
          style={{
            marginTop: 10,
          }}
        >
          {templatePageLogic.buttons.map((b) => (
            <div key={b.id} style={{ display: 'contents' }}>
              {b.element}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
