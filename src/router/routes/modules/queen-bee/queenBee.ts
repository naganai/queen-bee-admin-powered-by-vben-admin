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
      path: 'project',
      name: 'QueenBeeProject',
      meta: {
        title: t('routes.demo.system.project'),
        ignoreKeepAlive: false,
      },
      component: () => import('@/views/queen-bee/project/index.vue'),
    },
    {
      path: 'role',
      name: 'QueenBeeRole',
      meta: {
        title: t('routes.demo.system.role'),
        ignoreKeepAlive: false,
      },
      component: () => import('@/views/queen-bee/role/index.vue'),
    },
    {
      path: 'permission-tag',
      name: 'QueenBeePermissionTag',
      meta: {
        title: t('routes.demo.system.permissionTag'),
        ignoreKeepAlive: false,
      },
      component: () => import('@/views/queen-bee/permission-tag/index.vue'),
    },
  ],
};

export default system;
