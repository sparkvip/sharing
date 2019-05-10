/* eslint-disable no-console */
import React, { Component} from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Form, Input, Select, Button ,message} from 'antd';
import { connect } from 'dva';
import axios from 'axios';
import styles from './BaseView.less';
// import { getTimeDistance } from '@/utils/utils';

const InputGroup = Input.Group;
const FormItem = Form.Item;
const { Option } = Select;
const userId = localStorage.getItem("userId");

@Form.create()
class BaseView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryDown: [],
      values: {}
    }
  }

  // 页面初次加载之前自动调用
  componentWillMount() {
    const option = {
      url: '/api/code/query',
      method: 'POST',
      params: { code: 'category' },
    }
    axios(option).then(res => {
      this.setState({
        categoryDown: res.data,
      })
    }).catch(err => {
      console.log('err', err)
    })
    const option2 = {
      url: '/api/user/query',
      method: 'POST',
      params: { id: userId },
    }
    axios(option2).then(res => {
      this.setState({
        values: res.data
      })
    }).catch(err => {
      console.log('err', err)
    })
  }

  handleUpdate = ()  => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const option2 = {
        url: '/api/user/update',
        method: 'POST',
        params: {...fieldsValue,id:userId},
      }
      axios(option2)
      message.success('更新成功')
    });

   
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { categoryDown, values } = this.state;
    return (
      <div style={{ marginLeft: '500px' }} className={styles.baseView} ref={this.getViewDom}>
        <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
          <FormItem label='用户名'>
            {getFieldDecorator('name', {
              initialValue: values.name,
              rules: [
                {
                  required: true,
                  message: '用户名',
                },
              ],
            })(
              <Input size="large" placeholder='用户名' style={{ color: 'black' }} disabled='true' />
            )}
          </FormItem>
          <FormItem label='所属学院'>
            {getFieldDecorator('insititute', {
              initialValue: values.insititute,
              rules: [
                {
                  required: true,
                  message: '学院为必选项',
                },
              ],
            })(
              <Select placeholder="请选择所属学院" style={{ width: '100%' }}>
                {categoryDown && categoryDown.map(item => (
                  <Select.Option key={item.key} value={item.code}>{item.name}</Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label='修改密码'>
            {getFieldDecorator('password', {
              rules: [
                {
                  message: formatMessage({ id: 'validation.confirm-password.required' }),
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                placeholder={formatMessage({ id: 'form.confirm-password.placeholder' })}
              />
            )}
          </FormItem>
          <FormItem label='手机号码'>
            <InputGroup compact>
              <Select
                size="large"
                value="86"
                onChange={this.changePrefix}
                style={{ width: '20%' }}
              >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
              </Select>
              {getFieldDecorator('phone', {
                initialValue: values.phone,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.phone-number.required' }),
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                  },
                ],
              })(
                <Input
                  size="large"
                  style={{ width: '80%' }}
                  placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}
                />
              )}
            </InputGroup>
          </FormItem>
          <Button type="primary" onClick={this.handleUpdate}>
            更新基本信息
          </Button>
        </Form>
      </div>
    );
  }
}

export default BaseView;
