import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const system: AppRouteModule = {
  path: '/queen-bee',
  name: 'QueenBee',
  component: LAYOUT,
  redirect: '/queen-bee/account',
  meta: {
    icon: 'ion:id-card-outline',
    orderNo: 10,
    title: t('routes.demo.system.queenBee'),
  },
  children: [
    {
      path: 'account',
      name: 'QueenBeeAccountManagement',
      meta: {
        title: t('routes.demo.system.account'),
        ignoreKeepAlive: false,
      },
      component: () => import('@/views/queen-bee/account/index.vue'),
    },
    {
      path: 'project-assignment',
      name: 'QueenBeeProjectAssignment',
      meta: {
        title: t('routes.demo.system.project_assignment'),
        ignoreKeepAlive: false,
      },
      component: () => import('@/views/queen-bee/project-assignment/index.vue'),
    },
  ],
};

export default system;
