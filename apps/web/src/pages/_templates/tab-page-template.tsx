import { Outlet, useLocation } from 'react-router-dom';
import { useTemplatePageLogic } from '../../hooks/use-template-page-logic.tsx';
import { stringHelpers } from '@noita-explorer/tools';
import { Flex } from '@noita-explorer/react-utils';
import { TabView } from '../../components/tabs/tab-view.tsx';

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
  const location = useLocation();

  const getActiveTab = () => {
    const path = stringHelpers.trim({
      text: location.pathname,
      fromEnd: '/',
    });

    return tabs.find((t) => {
      const tabPath = stringHelpers.trim({
        text: t.href,
        fromEnd: '/',
      });

      return tabPath === path;
    });
  };

  const activeTab = getActiveTab() ?? tabs[0];

  return (
    <Flex width='100%' height='100%' center column>
      <div
        style={{
          maxHeight: '100%',
          width: '90%',
        }}
      >
        {activeTab && (
          <TabView activeTabId={activeTab.title} numberOfTabs={tabs.length}>
            <TabView.HeaderGroup>
              {tabs.map((t, index) => (
                <TabView.LinkHeaderItem
                  key={t.title}
                  id={t.title}
                  index={index}
                  to={t.href}
                >
                  {t.title}
                </TabView.LinkHeaderItem>
              ))}
            </TabView.HeaderGroup>
            <TabView.Body
              style={{
                maxHeight: '85vh',
              }}
            >
              <Outlet />
            </TabView.Body>
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
    </Flex>
  );
};
