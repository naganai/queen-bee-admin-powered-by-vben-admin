<template>
  <div class="p-4">
    <BasicTable
      class="border-rd-md overflow-hidden"
      :columns="columns"
      :dataSource="dataSource"
      :showIndexColumn="false"
      :pagination="{ pageSize: 20 }"
    >
      <template #headerCell="{ column }">
        <template v-if="column.dataIndex === 'action'">
          <a-button color="success" @click="handleAddNew">添加新专案 </a-button>
        </template>
      </template>
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'action'">
          <Button type="link" @click="handleEdit(record)">编辑</Button>
          <Popconfirm
            title="你确定要删除这个专案吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(record.userId)"
          >
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </template>
      </template>
    </BasicTable>

    <!-- Project add Drawer -->
    <Drawer v-model:open="projectAddDrawer.visible" title="添加新专案" placement="right">
      <!-- extra  -->
      <template #extra>
        <Button type="primary" @click="handleAddNewSubmit" :loading="projectAddDrawer.loading">
          添加
        </Button>
      </template>
      <!-- form -->
      <Form
        layout="vertical"
        ref="projectAddFormRef"
        :model="projectAddDrawer.formData"
        :rules="projectAddDrawer.rules"
      >
        <Form.Item label="专案名称" name="name">
          <Input v-model:value="projectAddDrawer.formData.name" />
        </Form.Item>
      </Form>
    </Drawer>

    <!-- Project edit Drawer -->
    <Drawer v-model:open="projectEditDrawer.visible" title="编辑专案" placement="right">
      <!-- extra  -->
      <template #extra>
        <Button type="primary" @click="handleEditSubmit" :loading="projectEditDrawer.loading">
          保存
        </Button>
      </template>
      <!-- form -->
      <Form
        layout="vertical"
        ref="projectEditFormRef"
        :model="projectEditDrawer.formData"
        :rules="projectEditDrawer.rules"
      >
        <Form.Item label="专案名称" name="name">
          <Input v-model:value="projectEditDrawer.formData.name" />
        </Form.Item>
      </Form>
    </Drawer>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, Ref, nextTick } from 'vue';
  import { Button, Drawer, Form, Input, Popconfirm, message } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { BasicColumn, BasicTable } from '@/components/Table';
  import { faker } from '@faker-js/faker';

  interface TableRow {
    name: string;
  }

  const columns: BasicColumn[] = [
    {
      title: '专案',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 150,
      align: 'center',
    },
  ];

  const dataSource: Ref<TableRow[]> = ref(generateRandomProjects());

  const projectAddFormRef = ref();
  const projectEditFormRef = ref();

  const projectAddDrawer = reactive({
    visible: false,
    loading: false,
    formData: {
      name: '',
    },
    rules: {
      name: [{ required: true, message: '请输入专案名称', trigger: 'blur' }] as Rule[],
    },
  });

  const projectEditDrawer = reactive({
    visible: false,
    loading: false,
    formData: {
      name: '',
    },
    rules: {
      name: [{ required: true, message: '请输入专案名称', trigger: 'blur' }] as Rule[],
    },
  });

  function handleAddNew(): void {
    projectAddDrawer.visible = true;
    nextTick(() => {
      projectAddFormRef.value.resetFields();
    });
  }

  async function handleAddNewSubmit(): Promise<void> {
    // set loading
    projectAddDrawer.loading = true;
    // validate form
    try {
      await projectAddFormRef.value.validate();
    } catch (error) {
      // reset loading
      projectAddDrawer.loading = false;
      return;
    }

    // mock request
    setTimeout(() => {
      // reset loading
      projectAddDrawer.loading = false;
      // close drawer
      projectAddDrawer.visible = false;
      // show success message
      message.success('添加成功');
    }, 1000);
  }

  function handleEdit(record: Record<string, any>): void {
    // set form data
    const tableRow = record as TableRow;
    projectEditDrawer.formData = { ...tableRow };
    projectEditDrawer.visible = true;
  }

  async function handleEditSubmit(): Promise<void> {
    // set loading
    projectEditDrawer.loading = true;
    // validate form
    try {
      await projectEditFormRef.value.validate();
    } catch (error) {
      // reset loading
      projectEditDrawer.loading = false;
      return;
    }

    // mock request
    setTimeout(() => {
      // reset loading
      projectEditDrawer.loading = false;
      // close drawer
      projectEditDrawer.visible = false;
      // show success message
      message.success('编辑成功');
    }, 1000);
  }

  function handleDelete(userId: string): void {
    // mock request
    setTimeout(() => {
      // remove record
      dataSource.value = dataSource.value.filter((record) => record.name !== userId);
      // show success message
      message.success('删除成功');
    }, 1000);
  }

  function generateRandomProjects(): TableRow[] {
    return Array.from({ length: 100 }, () => {
      return {
        name: faker.vehicle.vehicle(),
      };
    });
  }
</script>

<style scoped lang="less">
  /* Your component's CSS styles go here */
</style>
