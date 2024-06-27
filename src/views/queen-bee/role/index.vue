<template>
  <div class="p-4">
    <!-- 角色表格 -->
    <BasicTable
      class="border-rd-md overflow-hidden"
      :columns="tableColumns"
      :data-source="tableData"
      :showIndexColumn="false"
      :pagination="{ pageSize: 20 }"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'action'">
          <a-button color="success" @click="handleAdd">添加新角色 </a-button>
        </template>
        <template v-else>
          {{ column.title }}
        </template>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Button type="link" @click="handleEdit(record)">编辑</Button>
          <Popconfirm
            title="你确定要删除这名角色吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(record.roleId)"
          >
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </template>
        <template v-else-if="column.key === 'permissionTag'">
          <Button type="link" @click="handleShowRolePermission(record)">查看</Button>
        </template>
        <template v-else>
          {{ record[column.dataIndex?.toString() ?? ''] }}
        </template>
      </template>
    </BasicTable>

    <!-- 编辑角色信息抽屉 -->
    <Drawer
      v-model:open="roleInfoEditDrawerVisible"
      title="编辑角色信息"
      placement="right"
      destroyOnClose
    >
      <template #extra>
        <Button type="primary" @click="saveRole">保存</Button>
      </template>

      <Form
        ref="roleInfoEditFormRef"
        :model="roleInfoEditFormData"
        layout="vertical"
        :rules="roleInfoEditFormRules"
      >
        <Form.Item label="角色名" name="name">
          <Input v-model:value="roleInfoEditFormData.name" placeholder="请输入角色名" />
        </Form.Item>
        <Form.Item label="角色值" name="roleValue">
          <Input v-model:value="roleInfoEditFormData.roleValue" placeholder="请输入角色值" />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea
            v-model:value="roleInfoEditFormData.description"
            placeholder="请输入描述"
            auto-size
          />
        </Form.Item>
      </Form>
    </Drawer>

    <!-- 添加新角色抽屉 -->
    <Drawer v-model:open="roleInfoAddDrawerVisible" title="添加新角色" placement="right">
      <template #extra>
        <Button type="primary" @click="addNewRole">添加</Button>
      </template>
      <Form
        ref="roleInfoAddFormRef"
        :model="roleInfoAddFormData"
        layout="vertical"
        :rules="roleInfoAddFormRules"
      >
        <Form.Item label="角色名" name="name">
          <Input v-model:value="roleInfoAddFormData.name" placeholder="请输入角色名" />
        </Form.Item>
        <Form.Item label="角色值" name="roleValue">
          <Input v-model:value="roleInfoAddFormData.roleValue" placeholder="请输入角色值" />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea
            v-model:value="roleInfoAddFormData.description"
            placeholder="请输入描述"
            auto-size
          />
        </Form.Item>
      </Form>
    </Drawer>

    <!-- 查看权限抽屉 -->
    <Drawer
      v-model:open="permissionAssignDrawer.visible"
      title="查看权限"
      placement="right"
      :bodyStyle="{ paddingLeft: 0, paddingRight: 0 }"
    >
      <template #extra>
        <Button
          type="primary"
          @click="savePermissionAssign"
          :loading="permissionAssignDrawer.loading"
        >
          保存
        </Button>
      </template>
      <!-- search input -->
      <div class="h-full flex flex-col gap-4">
        <div class="pl-6 pr-6">
          <Input v-model:value="permissionTagSearchKeyword" placeholder="请搜索要进行操作的权限" />
        </div>
        <ScrollContainer class="h-full">
          <List
            class="permission-tag-list"
            item-layout="horizontal"
            :data-source="allPermissionTags"
          >
            <template #renderItem="{ item }">
              <List.Item @click="handleSelectePermissionTags(item.id)">
                <List.Item.Meta :title="item.name" />
                <CheckSquareFilled
                  v-show="permissionAssignDrawer.formData.permissionIds.includes(item.id)"
                />
              </List.Item>
            </template>
          </List>
        </ScrollContainer>
      </div>
    </Drawer>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, nextTick } from 'vue';
  import { Button, Drawer, Form, Input, Popconfirm, message, List } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { BasicColumn, BasicTable } from '@/components/Table';
  import { faker } from '@faker-js/faker';
  import ScrollContainer from '@/components/Container/src/ScrollContainer.vue';
  import { CheckSquareFilled } from '@ant-design/icons-vue';

  interface PermissionTag {
    id: number;
    name: string;
  }

  interface TableRow {
    id: number;
    name: string;
    roleValue: string;
    description: string;
    permissionTags?: PermissionTag[];
  }

  const roleInfoEditDrawerVisible = ref(false);
  const roleInfoAddDrawerVisible = ref(false);

  const roleInfoEditFormRef = ref();
  const roleInfoAddFormRef = ref();

  let roleInfoEditFormData = reactive({
    name: '',
    roleValue: '',
    description: '',
  });

  let roleInfoAddFormData = reactive({
    name: '',
    roleValue: '',
    description: '',
  });

  const permissionTagSearchKeyword = ref('');

  const allPermissionTags = ref<PermissionTag[]>(generateRandomPermissionTags());

  const permissionAssignDrawer = reactive({
    visible: false,
    loading: false,
    formData: {
      roleId: 0,
      permissionIds: [] as number[],
    },
  });

  const roleInfoAddFormRules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
    roleValue: [{ required: true, message: '请输入角色值', trigger: 'blur' }],
  };

  const roleInfoEditFormRules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
    roleValue: [{ required: true, message: '请输入角色值', trigger: 'blur' }],
  };

  const tableColumns: BasicColumn[] = [
    {
      title: '角色',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      width: 150,
    },
    // 角色值
    {
      title: '角色值',
      dataIndex: 'roleValue',
      key: 'roleValue',
      align: 'left',
      width: 150,
    },
    // 描述
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      align: 'left',
    },
    // 权限
    {
      title: '权限',
      dataIndex: 'permissionTag',
      key: 'permissionTag',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: 150,
    },
  ];

  const tableData = ref(generateRandomTableData());

  function handleSelectePermissionTags(permissionId: number) {
    const index = permissionAssignDrawer.formData.permissionIds.indexOf(permissionId);
    // if permissionId is in the array, remove it
    if (index !== -1) {
      permissionAssignDrawer.formData.permissionIds.splice(index, 1);
    } else {
      permissionAssignDrawer.formData.permissionIds.push(permissionId);
    }
    console.log('selected permission ids', permissionAssignDrawer.formData.permissionIds);
  }

  function handleShowRolePermission(record: Record<string, any>) {
    let tableRow = record as TableRow;
    console.log('show role permission', tableRow);
    permissionAssignDrawer.visible = true;
  }

  function savePermissionAssign() {
    // mock request
    permissionAssignDrawer.loading = true;
    setTimeout(() => {
      permissionAssignDrawer.loading = false;
      permissionAssignDrawer.visible = false;
      message.success('保存成功');
    }, 1000);
  }

  function generateRandomTableData(): TableRow[] {
    const tableData: TableRow[] = [];
    for (let i = 1; i <= 100; i++) {
      const tableRow: TableRow = {
        id: i,
        name: faker.person.fullName(),
        roleValue: faker.hacker.noun(),
        description: faker.lorem.sentence(),
      };
      tableData.push(tableRow);
    }
    return tableData;
  }

  function generateRandomPermissionTags(): PermissionTag[] {
    const permissionTags: PermissionTag[] = [];
    for (let i = 1; i <= 100; i++) {
      const permissionTag: PermissionTag = {
        id: i,
        name: faker.database.column(),
      };
      permissionTags.push(permissionTag);
    }
    return permissionTags;
  }

  async function saveRole() {
    try {
      await roleInfoEditFormRef.value.validate();
    } catch (error) {
      return;
    }

    roleInfoEditDrawerVisible.value = false;
    message.success('保存成功');
  }

  async function addNewRole() {
    try {
      await roleInfoAddFormRef.value.validate();
    } catch (error) {
      return;
    }

    console.log('add new role');
    const tableRow: TableRow = {
      id: tableData.value.length + 1,
      name: 'John Brown',
      roleValue: 'role_1',
      description: 'Description 1',
    };
    tableData.value.push(tableRow);

    roleInfoAddDrawerVisible.value = false;
    message.success('添加成功');
  }

  function handleAdd() {
    roleInfoAddDrawerVisible.value = true;
    // waiting for drawer to open and element to be rendered
    nextTick(() => {
      // reset form data
      roleInfoAddFormRef.value.resetFields();
    });
  }

  function handleEdit(record: Record<string, any>) {
    let tableRow = record as TableRow;
    roleInfoEditFormData = { ...tableRow };
    roleInfoEditDrawerVisible.value = true;
  }

  function handleDelete(roleId: number) {
    const index = tableData.value.findIndex((item) => item.id === roleId);
    if (index !== -1) {
      tableData.value.splice(index, 1);
    }
    message.success('删除成功');
  }
</script>

<style scoped lang="less">
  .permission-tag-list {
    .ant-list-item {
      .anticon-check-square {
        color: @primary-color;
      }
    }
  }
</style>
