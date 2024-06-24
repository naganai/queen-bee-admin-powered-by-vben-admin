<template>
  <div class="p-4 h-full flex flex-col">
    <div class="bg-white border-rd-md border-gray p-4 mb-4">
      ℹ️ 提示：选择一个用户。点击
      <MinusSquareOutlined class="text-red-500" /> 按钮，取消分配一个机型。 点击
      <PlusSquareOutlined class="text-green-500" /> 按钮，分配一个机型。
    </div>
    <Row :gutter="12" class="flex-1 overflow-hidden">
      <Col span="8" class="h-full">
        <div class="h-full bg-white border-rd-md border-gray overflow-hidden flex flex-col">
          <div class="ml-6 mr-6 mb-3 mt-3">
            <TypographyTitle :level="4">用户</TypographyTitle>
            <Input
              v-model:value="usersSearchKeyword"
              placeholder="请搜索要准备分配机型的用户"
              allow-clear
            />
          </div>
          <ScrollContainer>
            <List :data-source="users" class="bg-white">
              <template #renderItem="{ item }">
                <List.Item
                  @click="handleSelectUser(item)"
                  :class="{ selected: selectedUser === item }"
                >
                  {{ item }}
                </List.Item>
              </template>
            </List>
          </ScrollContainer>
        </div>
      </Col>

      <Col span="16" class="h-full">
        <div class="h-full flex bg-white border-rd-md border-gray">
          <div class="h-full flex-1 overflow-hidden flex flex-col">
            <div class="ml-6 mr-6 mb-3 mt-3">
              <TypographyTitle :level="4">已分配的机型</TypographyTitle>
              <Input
                v-model:value="assignedProjectsSearchKeyword"
                placeholder="请搜索已分配的机型"
                allow-clear
              />
            </div>
            <ScrollContainer>
              <List :data-source="filteredAssignedProjects" class="bg-white">
                <template #renderItem="{ item }">
                  <List.Item @click="handleUnassignProject(item)">
                    <span> {{ item }}</span>
                    <MinusSquareOutlined class="text-red-500" />
                  </List.Item>
                </template>
              </List>
            </ScrollContainer>
          </div>
          <Divider type="vertical" class="h-full" />
          <div class="h-full flex-1 overflow-hidden flex flex-col">
            <div class="ml-6 mr-6 mb-3 mt-3">
              <TypographyTitle :level="4">未分配的机型</TypographyTitle>
              <Input
                v-model:value="unassignedProjectsSearchKeyword"
                placeholder="请搜索未分配的机型"
                allow-clear
              />
            </div>
            <ScrollContainer>
              <List :data-source="filteredUnassignedProjects" class="bg-white">
                <template #renderItem="{ item }">
                  <List.Item @click="handleAssignProject(item)">
                    <span>{{ item }}</span>
                    <PlusSquareOutlined class="text-green-500" />
                  </List.Item>
                </template>
              </List>
            </ScrollContainer>
          </div>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts" setup>
  import { faker } from '@faker-js/faker';
  import { Col, Row, List, TypographyTitle, Input, Divider } from 'ant-design-vue';
  import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons-vue';
  import { ScrollContainer } from '@/components/Container';
  import { computed, Ref, ref } from 'vue';

  const users: string[] = generateRandomNames();
  const allProjects: string[] = generateRandomProjects();
  const selectedUser = ref('');

  const usersSearchKeyword = ref('');
  const assignedProjectsSearchKeyword = ref('');
  const unassignedProjectsSearchKeyword = ref('');

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

  function handleSelectUser(user: string): void {
    selectedUser.value = user;
  }

  function handleAssignProject(project: string): void {
    assignedProjects.value.push(project);
  }

  function handleUnassignProject(project: string): void {
    const index = assignedProjects.value.indexOf(project);
    if (index !== -1) {
      assignedProjects.value.splice(index, 1);
    }
  }

  function generateRandomProjects(): string[] {
    return Array.from({ length: 50 }, () => faker.location.city());
  }

  function generateRandomNames(): string[] {
    return Array.from({ length: 50 }, () => faker.commerce.productName());
  }
</script>

<style scoped lang="less">
  .ant-list-item {
    cursor: pointer;

    &.selected {
      background-color: #ddd;
    }
  }
</style>
