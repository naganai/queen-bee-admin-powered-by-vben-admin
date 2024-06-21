<template>
  <div class="p-4">
    <!-- 用户信息表格 -->
    <BasicTable
      :columns="tableColumns"
      :data-source="tableData"
      :showIndexColumn="false"
      :pagination="{ pageSize: 20 }"
    >
      <!-- 添加headercell，居中操作栏的表头 -->
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
        <!-- else if -->
        <template v-else-if="column.key === 'productCount'">
          <span>{{ record[column.dataIndex?.toString() ?? ''] }}个</span>
          <Button type="link">查看</Button>
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
      </Form>
    </Drawer>

    <!-- 添加新用户抽屉 -->
    <Drawer
      v-model:open="userInfoAddDrawerVisible"
      title="添加新用户"
      placement="right"
      destroyOnClose
    >
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
      </Form>
    </Drawer>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { Button, Drawer, Form, Input, Popconfirm, message } from 'ant-design-vue';
  import TableRow from './tableRow';
  import type { Rule } from 'ant-design-vue/es/form';
  import { BasicColumn, BasicTable } from '@/components/Table';

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
  });

  let userInfoAddFormData = reactive({
    username: '',
    password: '',
    nickname: '',
    department: '',
    division: '',
    position: '',
  });

  const userInfoAddFormRules: Record<string, Rule[]> = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    department: [{ required: true, message: '请输入部门', trigger: 'blur' }],
    division: [{ required: true, message: '请输入课', trigger: 'blur' }],
    position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
  };

  const userInfoEditFormRules: Record<string, Rule[]> = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    department: [{ required: true, message: '请输入部门', trigger: 'blur' }],
    division: [{ required: true, message: '请输入课', trigger: 'blur' }],
    position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
  };

  const tableColumns: BasicColumn[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 150,
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
      width: 150,
    },
    {
      title: '负责的机型',
      dataIndex: 'productCount',
      key: 'productCount',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: 200,
    },
  ];

  const tableData = ref(generateRandomData());

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
      productCount: 0,
    };
    tableData.value.push(tableRow);

    userInfoAddDrawerVisible.value = false;
    message.success('添加成功');
  }

  function handleAdd() {
    userInfoAddDrawerVisible.value = true;
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
</script>

<style scoped lang="less"></style>
