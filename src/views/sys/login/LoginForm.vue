<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="account" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.account"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>

    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="rememberMe" size="small">
            {{ t('sys.login.rememberMe') }}
          </Checkbox>
        </FormItem>
      </ACol>
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <!-- TODO: 忘记密码的功能，先不实现 -->
          <!-- <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </Button> -->
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
      <Button
        size="large"
        class="mt-4 enter-x"
        block
        @click="setLoginState(LoginStateEnum.REGISTER)"
      >
        {{ t('sys.login.registerButton') }}
      </Button>
    </FormItem>
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';

  import { Checkbox, Form, Input, Row, Col, Button } from 'ant-design-vue';
  import LoginFormTitle from './LoginFormTitle.vue';

  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';

  import { useUserStore } from '@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '@/hooks/web/useDesign';
  import AuthApi from '@/api/queenBeeApi/authApi';
  import {
    QUEEN_BEE_ACCESS_TOKEN_KEY,
    QUEEN_BEE_REFRESH_TOKEN_EXPIRATION_TIME_KEY,
    QUEEN_BEE_REFRESH_TOKEN_KEY,
    QUEEN_BEE_USER_ID_KEY,
  } from '@/enums/cacheEnum';
  import UserApi from '@/api/queenBeeApi/userApi';
  //import { onKeyStroke } from '@vueuse/core';

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const rememberMe = ref(false);

  const formData = reactive({
    account: '123123',
    password: '123123',
  });

  // Pass in the login form element reference object
  // and return a method for validating it
  const { validForm } = useFormValid(formRef);

  //onKeyStroke('Enter', handleLogin);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;

      // TODO: Add your own login logic here
      queenBeeLogin(data.account, data.password);
      const userInfo = await userStore.login({
        username: 'vben',
        password: '123456',
        mode: 'none', //不要默认的错误提示
      });
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.realName}`,
          duration: 3,
        });
      }
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }

  async function queenBeeLogin(username: string, password: string) {
    try {
      let loginResultDto = await AuthApi.login(username, password);
      console.log(loginResultDto);

      // save the login information to the local storage
      localStorage.setItem(QUEEN_BEE_USER_ID_KEY, loginResultDto.userId.toString());
      localStorage.setItem(QUEEN_BEE_ACCESS_TOKEN_KEY, loginResultDto.accessToken);
      localStorage.setItem(QUEEN_BEE_REFRESH_TOKEN_KEY, loginResultDto.refreshToken);
      localStorage.setItem(
        QUEEN_BEE_REFRESH_TOKEN_EXPIRATION_TIME_KEY,
        loginResultDto.refreshTokenExpirationTime.toString(),
      );

      const userId = Number(localStorage.getItem(QUEEN_BEE_USER_ID_KEY));
      getUserInfo(userId);
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    }
  }

  async function getUserInfo(userId: number) {
    try {
      let userInfo = await UserApi.getUserInfo(userId);
      console.log(userInfo);
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    }
  }
</script>
