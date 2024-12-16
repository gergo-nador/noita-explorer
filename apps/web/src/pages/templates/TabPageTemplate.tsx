import { Button, TabView } from '@noita-explorer/noita-component-library';
import { Outlet, useNavigate } from 'react-router-dom';

interface TabLink {
  title: string;
  href: string;
}

interface TabPageTemplateProps {
  tabs: TabLink[];
}

export const TabPageTemplate = ({ tabs }: TabPageTemplateProps) => {
  const navigate = useNavigate();

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
            maxHeight: '80vh',
          }}
          tabs={tabs.map((t) => ({
            title: t.title,
            content: <Outlet />,
            onClick: () => navigate(t.href),
          }))}
        />

        <div
          style={{
            marginTop: 10,
          }}
        >
          <Button onClick={() => navigate('/')}>Return</Button>
        </div>
      </div>
    </div>
  );
};
