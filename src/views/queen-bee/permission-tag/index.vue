<template>
  <div class="p-4">
    <!-- 权限标签表格 -->
    <BasicTable
      class="border-rd-md overflow-hidden"
      :columns="tableColumns"
      :data-source="tableData"
      :showIndexColumn="false"
      :pagination="{ pageSize: 20 }"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'action'">
          <a-button color="success" @click="handleAdd">添加新权限标签 </a-button>
        </template>
        <template v-else>
          {{ column.title }}
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Button type="link" @click="handleEdit(record)">编辑</Button>
          <Popconfirm
            title="你确定要删除这名权限标签吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(record.permissionTagId)"
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

    <!-- 编辑权限标签抽屉 -->
    <Drawer
      v-model:open="permissionTagEditDrawerVisible"
      title="编辑权限标签信息"
      placement="right"
      destroyOnClose
    >
      <template #extra>
        <Button type="primary" @click="savePermissionTag">保存</Button>
      </template>

      <Form
        ref="permissionTagInfoEditFormRef"
        :model="permissionTagEditFormData"
        layout="vertical"
        :rules="permissionTagInfoEditFormRules"
      >
        <Form.Item label="权限标签名" name="name">
          <Input v-model:value="permissionTagEditFormData.name" placeholder="请输入权限标签名" />
        </Form.Item>
      </Form>
    </Drawer>

    <!-- 添加新权限标签抽屉 -->
    <Drawer
      v-model:open="permissionTagInfoAddDrawerVisible"
      title="添加新权限标签"
      placement="right"
    >
      <template #extra>
        <Button type="primary" @click="addNewPermissionTag">添加</Button>
      </template>
      <Form
        ref="permissionTagInfoAddFormRef"
        :model="permissionTagAddFormData"
        layout="vertical"
        :rules="permissionTagInfoAddFormRules"
      >
        <Form.Item label="权限标签名" name="name">
          <Input v-model:value="permissionTagAddFormData.name" placeholder="请输入权限标签名" />
        </Form.Item>
      </Form>
    </Drawer>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, nextTick } from 'vue';
  import { Button, Drawer, Form, Input, Popconfirm, message } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { BasicColumn, BasicTable } from '@/components/Table';
  import { faker } from '@faker-js/faker';

  interface TableRow {
    id: number;
    name: string;
  }

  const permissionTagEditDrawerVisible = ref(false);
  const permissionTagInfoAddDrawerVisible = ref(false);

  const permissionTagInfoEditFormRef = ref();
  const permissionTagInfoAddFormRef = ref();

  let permissionTagEditFormData = reactive({
    name: '',
  });

  let permissionTagAddFormData = reactive({
    name: '',
  });

  const permissionTagInfoAddFormRules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请输入权限标签名', trigger: 'blur' }],
  };

  const permissionTagInfoEditFormRules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请输入权限标签名', trigger: 'blur' }],
  };

  const tableColumns: BasicColumn[] = [
    {
      title: '权限标签',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: 150,
    },
  ];

  const tableData = ref(generateRandomData());

  function generateRandomData(): TableRow[] {
    const tableData: TableRow[] = [];
    for (let i = 1; i <= 100; i++) {
      const tableRow: TableRow = {
        id: i,
        name: faker.person.fullName(),
      };
      tableData.push(tableRow);
    }
    return tableData;
  }

  async function savePermissionTag() {
    try {
      await permissionTagInfoEditFormRef.value.validate();
    } catch (error) {
      return;
    }

    // 1. 发起请求
    // 2. 重新获取权限标签信息
    permissionTagEditDrawerVisible.value = false;
    message.success('保存成功');
  }

  async function addNewPermissionTag() {
    try {
      await permissionTagInfoAddFormRef.value.validate();
    } catch (error) {
      return;
    }

    console.log('add new permissionTag');
    const tableRow: TableRow = {
      id: tableData.value.length + 1,
      name: 'John Brown',
    };
    tableData.value.push(tableRow);

    permissionTagInfoAddDrawerVisible.value = false;
    message.success('添加成功');
  }

  function handleAdd() {
    permissionTagInfoAddDrawerVisible.value = true;
    // waiting for drawer to open and element to be rendered
    nextTick(() => {
      // reset form data
      permissionTagInfoAddFormRef.value.resetFields();
    });
  }

  function handleEdit(record: Record<string, any>) {
    let tableRow = record as TableRow;
    permissionTagEditFormData = { ...tableRow };
    permissionTagEditDrawerVisible.value = true;
  }

  function handleDelete(permissionTagId: number) {
    const index = tableData.value.findIndex((item) => item.id === permissionTagId);
    if (index !== -1) {
      tableData.value.splice(index, 1);
    }
    message.success('删除成功');
  }
</script>

<style scoped lang="less"></style>
