import { inject } from 'mobx-react/native';
import React, { Component } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Button, ButtonTypes } from '../../components/Button';
import Header from '../../components/Common/Header';
import Image from '../../components/Common/Image';
import ViewContainer from '../../components/Common/ViewContainer';
import ViewContent from '../../components/Common/ViewContent';
import { CellContent, FormCell, FormControl } from '../../components/Form';
import i18n from '../../i18n';
import { AuthStoreInjectedProps, CommonStoreInjectedProps, UserStoreInjectedProps } from '../../stores';
import { IMAGES, S } from '../../themes';
import showToast from '../../utils/Toast';
import { Navigation } from 'react-native-navigation';
import { startHomeTab } from '../index';

interface Props
  extends AuthStoreInjectedProps,
    UserStoreInjectedProps,
    CommonStoreInjectedProps {}

interface State {
  username: string;
  password: string;
  repeatPassword: string;
  showPassword: boolean;
}

@inject('auth', 'user', 'common')
export default class Register extends Component<Props, State> {
  state = {
    username: '',
    password: '',
    repeatPassword: '',
    showPassword: true,
  };

  constructor(props: Props) {
    super(props);
  }

  register = () => {
    if (!this.passVerification()) {
      return;
    }
    const { auth, user, common } = this.props;
    const { username, password } = this.state;
    const params = {
      username,
      password,
    };

    common.showLoading();

    auth
      .register(params)
      .then(() => user.getUser())
      .then(() => {
        startHomeTab();
        common.hideLoading();
      })
      .catch(error => {
        showToast(error);
        common.hideLoading();
      });
  };

  setUsername = (text: string) => {
    this.setState({ username: text });
  };

  checkUsername = () => {
    const { username } = this.state;
    const reg = /^[a-zA-Z0-9_]{1,20}$/g;

    if (!reg.test(username)) {
      return showToast(i18n.t('register_invalid_name'));
    }
    return true;
  };

  checkPassword = () => {
    const { password } = this.state;
    const reg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&])[0-9a-zA-Z!@#$%^&]{8,16}$/;

    if (!reg.test(password)) {
      return showToast(i18n.t('register_invalid_password'));
    }
    return true;
  };

  setPassword = (text: string) => {
    this.setState({ password: text });
  };

  checkRepeatPassword = () => {
    const { password, repeatPassword } = this.state;
    if (password !== repeatPassword) {
      return showToast(i18n.t('register_repeat_password_error'));
    }
    return true;
  };

  setRepeatPassword = (text: string) => {
    this.setState({ repeatPassword: text });
  };

  toggleShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };

  passVerification = () => {
    return (
      this.checkUsername() && this.checkPassword() && this.checkRepeatPassword()
    );
  };

  toggleLogin = () => {
    Navigation.pop(this.props.componentId);
  };

  render() {
    const pwdImage = this.state.showPassword
      ? IMAGES.icon_password_unvisible
      : IMAGES.icon_password_visible;

    return (
      <ViewContainer>
        <Header title={i18n.t('register_title')} hideBackButton />
        <ViewContent scrollable keyboardAvoidingView>
          <FormControl>
            <FormCell>
              <CellContent>{i18n.t('register_label_username')}</CellContent>
              <CellContent>
                <TextInput
                  underlineColorAndroid="transparent"
                  onBlur={this.checkUsername}
                  onChangeText={this.setUsername}
                />
              </CellContent>
            </FormCell>
            <View style={S.padding}>
              <Text style={S.textSecondary}>
                {i18n.t('register_rule_username')}
              </Text>
            </View>
            <FormCell>
              <CellContent>{i18n.t('register_label_password')}</CellContent>
              <CellContent>
                <TextInput
                  underlineColorAndroid="transparent"
                  secureTextEntry={this.state.showPassword}
                  onBlur={this.checkPassword}
                  onChangeText={this.setPassword}
                />
              </CellContent>
              <CellContent>
                <TouchableOpacity onPress={this.toggleShowPassword}>
                  <Image source={pwdImage} size={15} />
                </TouchableOpacity>
              </CellContent>
            </FormCell>
            <View style={S.padding}>
              <Text style={S.textSecondary}>
                {i18n.t('register_rule_password')}
              </Text>
            </View>
            <FormCell>
              <CellContent>
                {i18n.t('register_label_repeat_password')}
              </CellContent>
              <CellContent>
                <TextInput
                  onBlur={this.checkRepeatPassword}
                  onChangeText={this.setRepeatPassword}
                  secureTextEntry={this.state.showPassword}
                />
              </CellContent>
            </FormCell>
          </FormControl>
          <View style={[S.flexRow, S.padding]}>
            <Text style={S.textDefaultLight}>
              {i18n.t('register_label_signin')}
            </Text>
            <Text
              style={[S.textDefaultLight, S.textUnderline, S.marginLeft5]}
              onPress={this.toggleLogin}
            >
              {i18n.t('register_btn_signin')}
            </Text>
          </View>
          <Button
            type={ButtonTypes.primary}
            marginTop={30}
            onPress={this.register}
          >
            {i18n.t('register_btn_signup')}
          </Button>
        </ViewContent>
      </ViewContainer>
    );
  }
}
