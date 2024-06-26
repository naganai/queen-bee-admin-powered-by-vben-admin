<template>
  <div class="p-4">
    <!-- 用户信息表格 -->
    <BasicTable
      class="border-rd-md overflow-hidden"
      :columns="tableColumns"
      :data-source="tableData"
      :showIndexColumn="false"
      :pagination="{ pageSize: 20 }"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'action'">
          <a-button color="success" @click="handleAdd">添加新用户 </a-button>
        </template>
        <template v-else>
          {{ column.title }}
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Button type="link" @click="handleEdit(record)">编辑</Button>
          <Popconfirm
            title="你确定要删除这名用户吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(record.userId)"
          >
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </template>
        <template v-else-if="column.key === 'productCount'">
          <Button type="link" @click="handleAssignProject">查看</Button>
        </template>
        <template v-else-if="column.key === 'roleId'">
          <span>{{ getRoleName(record[column.dataIndex?.toString() ?? '']) }}</span>
        </template>

        <template v-else>
          {{ record[column.dataIndex?.toString() ?? ''] }}
        </template>
      </template>
    </BasicTable>

    <!-- 编辑用户信息抽屉 -->
    <Drawer
      v-model:open="userInfoEditDrawerVisible"
      title="编辑用户信息"
      placement="right"
      destroyOnClose
    >
      <template #extra>
        <Button type="primary" @click="saveUserInfo">保存</Button>
      </template>

      <Form
        ref="userInfoEditFormRef"
        :model="userInfoEditFormData"
        layout="vertical"
        :rules="userInfoEditFormRules"
      >
        <Form.Item label="用户名" name="username">
          <Input v-model:value="userInfoEditFormData.username" placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item label="密码" name="password">
          <Input
            v-model:value="userInfoEditFormData.password"
            placeholder="如果要修改密码，请输入新密码，否则留空"
          />
        </Form.Item>
        <Form.Item label="昵称" name="nickname">
          <Input v-model:value="userInfoEditFormData.nickname" placeholder="请输入昵称" />
        </Form.Item>
        <Form.Item label="部门" name="department">
          <Input v-model:value="userInfoEditFormData.department" placeholder="请输入部门" />
        </Form.Item>
        <Form.Item label="课" name="division">
          <Input v-model:value="userInfoEditFormData.division" placeholder="请输入课" />
        </Form.Item>
        <Form.Item label="职位" name="position">
          <Input v-model:value="userInfoEditFormData.position" placeholder="请输入职位" />
        </Form.Item>
        <Form.Item label="角色" name="roleId">
          <Select v-model:value="userInfoEditFormData.roleId" placeholder="请选择角色">
            <Select.Option v-for="role in roleOptions" :key="role.id" :value="role.id">{{
              role.name
            }}</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Drawer>

    <!-- 添加新用户抽屉 -->
    <Drawer v-model:open="userInfoAddDrawerVisible" title="添加新用户" placement="right">
      <template #extra>
        <Button type="primary" @click="addNewUser">添加</Button>
      </template>
      <Form
        ref="userInfoAddFormRef"
        :model="userInfoAddFormData"
        layout="vertical"
        :rules="userInfoAddFormRules"
      >
        <Form.Item label="用户名" name="username">
          <Input v-model:value="userInfoAddFormData.username" placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item label="密码" name="password">
          <Input v-model:value="userInfoAddFormData.password" placeholder="请输入密码" />
        </Form.Item>
        <Form.Item label="昵称" name="nickname">
          <Input v-model:value="userInfoAddFormData.nickname" placeholder="请输入昵称" />
        </Form.Item>
        <Form.Item label="部门" name="department">
          <Input v-model:value="userInfoAddFormData.department" placeholder="请输入部门" />
        </Form.Item>
        <Form.Item label="课" name="division">
          <Input v-model:value="userInfoAddFormData.division" placeholder="请输入课" />
        </Form.Item>
        <Form.Item label="职位" name="position">
          <Input v-model:value="userInfoAddFormData.position" placeholder="请输入职位" />
        </Form.Item>
        <Form.Item label="角色" name="roleId">
          <Select v-model:value="userInfoAddFormData.roleId" placeholder="请选择角色">
            <Select.Option v-for="role in roleOptions" :key="role.id" :value="role.id">{{
              role.name
            }}</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Drawer>

    <Drawer v-model:open="projectAssignModal.visible" title="负责的专案" size="large">
      <template #extra>
        <Button type="primary" @click="handleAssignProjectSubmit">保存</Button>
      </template>

      <div class="h-full overflow-hidden flex gap-4">
        <div class="h-full flex-1 overflow-hidden flex flex-col">
          <div class="mb-4">
            <TypographyTitle :level="5">已分配的专案</TypographyTitle>
            <Input
              v-model:value="assignedProjectsSearchKeyword"
              placeholder="请搜索已分配的专案"
              allow-clear
            />
          </div>
          <ScrollContainer class="border-color border rounded-md">
            <List :data-source="filteredAssignedProjects" class="bg-white">
              <template #renderItem="{ item }">
                <List.Item @click="handleUnassignProjectFromUser(item)">
                  <span> {{ item }}</span>
                  <MinusSquareOutlined class="text-red-500" />
                </List.Item>
              </template>
            </List>
          </ScrollContainer>
        </div>
        <div class="h-full flex-1 overflow-hidden flex flex-col">
          <div class="mb-4">
            <TypographyTitle :level="5">未分配的专案</TypographyTitle>
            <Input
              v-model:value="unassignedProjectsSearchKeyword"
              placeholder="请搜索未分配的专案"
              allow-clear
            />
          </div>
          <ScrollContainer class="border-color border rounded-md">
            <List :data-source="filteredUnassignedProjects" class="bg-white">
              <template #renderItem="{ item }">
                <List.Item @click="handleAssignProjectToUser(item)">
                  <span>{{ item }}</span>
                  <PlusSquareOutlined class="text-green-500" />
                </List.Item>
              </template>
            </List>
          </ScrollContainer>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, nextTick, Ref, computed } from 'vue';
  import {
    Button,
    Drawer,
    Form,
    Input,
    Popconfirm,
    message,
    Select,
    List,
    TypographyTitle,
  } from 'ant-design-vue';
  import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons-vue';
  import { ScrollContainer } from '@/components/Container';
  import type { Rule } from 'ant-design-vue/es/form';
  import { BasicColumn, BasicTable } from '@/components/Table';
  import { faker } from '@faker-js/faker';

  interface Role {
    id: number;
    name: string;
  }

  interface TableRow {
    userId: number;
    /**用户名 */
    username: string;
    /**昵称 */
    nickname: string;
    /**所属部门 */
    department: string;
    /**所属课 */
    division: string;
    /**职位 */
    position: string;
    /** 角色Id */
    roleId: number;
    /** 拥有的生产产品的数量 */
    productCount: number;
  }

  const userInfoEditDrawerVisible = ref(false);
  const userInfoAddDrawerVisible = ref(false);

  const userInfoEditFormRef = ref();
  const userInfoAddFormRef = ref();

  let userInfoEditFormData = reactive({
    username: '',
    password: '',
    nickname: '',
    department: '',
    division: '',
    position: '',
    roleId: 0,
  });

  let userInfoAddFormData = reactive({
    username: '',
    password: '',
    nickname: '',
    department: '',
    division: '',
    position: '',
    roleId: 0,
  });

  const userInfoAddFormRules: Record<string, Rule[]> = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    department: [{ required: true, message: '请输入部门', trigger: 'blur' }],
    division: [{ required: true, message: '请输入课', trigger: 'blur' }],
    position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
    roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
  };

  const userInfoEditFormRules: Record<string, Rule[]> = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    department: [{ required: true, message: '请输入部门', trigger: 'blur' }],
    division: [{ required: true, message: '请输入课', trigger: 'blur' }],
    position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
    roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
  };

  const tableColumns: BasicColumn[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 100,
      fixed: 'left',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 100,
    },
    {
      title: '课',
      dataIndex: 'division',
      key: 'division',
      width: 100,
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: 100,
    },
    // 角色
    {
      title: '角色',
      dataIndex: 'roleId',
      key: 'roleId',
      width: 150,
    },
    {
      title: '负责的专案',
      dataIndex: 'productCount',
      key: 'productCount',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: 150,
      fixed: 'right',
    },
  ];

  const tableData = ref(generateRandomData());

  const projectAssignModal = reactive({
    visible: false,
    loading: false,
    formData: {
      userId: 0,
      assignedProjectIds: new Set<number>(),
    },
  });

  const roleOptions = ref<Role[]>([
    { id: 1, name: '超级管理员' },
    { id: 2, name: '账号管理员' },
    { id: 3, name: '普通用户' },
  ]);

  const assignedProjectsSearchKeyword = ref('');
  const unassignedProjectsSearchKeyword = ref('');
  const allProjects: string[] = generateRandomProjects();
  const assignedProjects: Ref<string[]> = ref([]);
  const filteredAssignedProjects = computed(() => {
    return assignedProjects.value.filter((project) => {
      const keyword = assignedProjectsSearchKeyword.value.toLowerCase();
      return project.toLowerCase().includes(keyword);
    });
  });
  const filteredUnassignedProjects = computed(() => {
    return allProjects.filter((project) => {
      const keyword = unassignedProjectsSearchKeyword.value.toLowerCase();
      return !assignedProjects.value.includes(project) && project.toLowerCase().includes(keyword);
    });
  });

  function handleAssignProjectToUser(project: string): void {
    assignedProjects.value.push(project);
  }

  function handleUnassignProjectFromUser(project: string): void {
    const index = assignedProjects.value.indexOf(project);
    if (index !== -1) {
      assignedProjects.value.splice(index, 1);
    }
  }

  function generateRandomProjects(): string[] {
    return Array.from({ length: 50 }, () => faker.location.city());
  }

  function getRoleName(roleId: number): string {
    const role = roleOptions.value.find((item) => item.id === roleId);
    return role ? role.name : '';
  }

  function generateRandomData(): TableRow[] {
    const tableData: TableRow[] = [];
    for (let i = 1; i <= 100; i++) {
      const tableRow: TableRow = {
        userId: i,
        username: `User ${i}`,
        nickname: `Nickname ${i}`,
        department: `Department ${i}`,
        division: `Division ${i}`,
        position: `Position ${i}`,
        roleId: (i % 3) + 1,
        productCount: 0,
      };
      tableData.push(tableRow);
    }
    return tableData;
  }

  async function saveUserInfo() {
    try {
      await userInfoEditFormRef.value.validate();
    } catch (error) {
      return;
    }

    // 1. 发起请求
    // 2. 重新获取用户信息
    console.log('save user info');
    userInfoEditDrawerVisible.value = false;
    message.success('保存成功');
  }

  async function addNewUser() {
    try {
      await userInfoAddFormRef.value.validate();
    } catch (error) {
      return;
    }

    console.log('add new user');
    const tableRow: TableRow = {
      userId: tableData.value.length + 1,
      username: 'John Brown',
      nickname: 'New York No. 1 Lake Park',
      department: '工程部',
      division: '测试课',
      position: '软件开发工程师',
      roleId: 1,
      productCount: 0,
    };
    tableData.value.push(tableRow);

    userInfoAddDrawerVisible.value = false;
    message.success('添加成功');
  }

  function handleAdd() {
    userInfoAddDrawerVisible.value = true;
    // waiting for drawer to open and element to be rendered
    nextTick(() => {
      // reset form data
      userInfoAddFormRef.value.resetFields();
    });
  }

  function handleEdit(record: Record<string, any>) {
    let tableRow = record as TableRow;
    userInfoEditFormData = { ...tableRow, password: '' };
    userInfoEditDrawerVisible.value = true;
  }

  function handleDelete(userId: number) {
    const index = tableData.value.findIndex((item) => item.userId === userId);
    if (index !== -1) {
      tableData.value.splice(index, 1);
    }
    message.success('删除成功');
  }

  function handleAssignProject(record: Record<string, any>) {
    const tableRow = record as TableRow;
    const userId = tableRow.userId;
    // TODO: fetch user's assigned projects
    // set form data
    projectAssignModal.formData = {
      userId,
      assignedProjectIds: new Set<number>(),
    };

    projectAssignModal.visible = true;
  }

  function handleAssignProjectSubmit() {
    // 1. 发起请求
    // 2. 重新获取用户信息
    console.log('assign project');
    projectAssignModal.visible = false;
    message.success('分配成功');
  }
</script>

<style scoped lang="less">
  .ant-list-item {
    cursor: pointer;

    &.selected {
      background-color: #ddd;
    }
  }

  .border-color {
    border-color: #d9d9d9;
  }
</style>
