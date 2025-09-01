import { IconChartBar, IconTable } from '@tabler/icons-react';

import { PATH_DASHBOARD } from '@/routes';

// Sidebar will only show the dashboard.
export const SIDEBAR_LINKS = [
  {
    title: 'Calculadoras',
    links: [
      { label: 'PGBL X VGBL', icon: IconChartBar, link: PATH_DASHBOARD.default },
    ],
  },
];
