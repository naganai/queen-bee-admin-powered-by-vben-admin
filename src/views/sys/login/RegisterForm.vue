<template>
  <div v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="username" class="enter-x">
        <Input
          class="fix-auto-fill"
          size="large"
          v-model:value="formData.username"
          :placeholder="t('sys.login.userName')"
        />
      </FormItem>
      <FormItem name="nickname" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.nickname"
          :placeholder="t('sys.login.nickname')"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem name="password" class="enter-x">
        <StrengthMeter
          size="large"
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.confirmPassword"
          :placeholder="t('sys.login.confirmPassword')"
        />
      </FormItem>

      <Button
        type="primary"
        class="enter-x"
        size="large"
        block
        @click="handleRegister"
        :loading="loading"
      >
        {{ t('sys.login.registerButton') }}
      </Button>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </Form>
  </div>
</template>
<script lang="ts" setup>
  // 成功后跳转到指定页面（从URL获取）
  import { reactive, ref, unref, computed } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button, message } from 'ant-design-vue';
  import { StrengthMeter } from '@/components/StrengthMeter';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';
  import UserApi from '@/api/queenBeeApi/userApi';

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    username: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });

  const { getFormRules } = useFormRules(formData);
  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER);

  async function handleRegister() {
    const data = await validForm();
    if (!data) return;

    // 1. 发送请求
    loading.value = true;
    try {
      await UserApi.register(data);
      // 成功后返回到登录页面
      message.success(t('sys.login.registerSuccess'));
      handleBackLogin();
    } catch (error) {
      message.error(error.message);
    } finally {
      loading.value = false;
    }
  }
</script>
