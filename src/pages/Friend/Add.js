import React, { PureComponent } from 'react';
import { connect } from 'dva';
import axios from 'axios';
import { formatMessage } from 'umi-plugin-react/locale';
import {
  Form,
  Input,
  Upload,
  message,
  Button,
  Card,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;

const userId = localStorage.getItem("userId");
const userName = localStorage.getItem("userName");

@Form.create()
class Add extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    }
  }


  // 点击提交按钮触发的事件
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const params = { ...values, id: userId }
      if(values.name === userName){
        message.error('请勿添加自己为好友!');
        return;
      }
      if (!err) {
        const option = {
          url: `/api/friend/add`,
          method: 'post',
          params,
        };
        axios(option).then((res) => {
          if(res.data === 'ok'){
            message.success('好友请求已发送!');
          }else if(res.data === 2){
            message.success('请勿重复发送好友请求！');
          }else if(res.data === 1){
            message.error('对方已是你的好友!');
          }
          // 提交成功进行表单重置
          form.resetFields();
        }).catch(() => {
          message.error('用户不存在!');
        })
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };


    return (
      <PageHeaderWrapper
        title='添加好友'
        content='根据用户名进行好友的添加'
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label='用户名'>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '用户名为必输项',
                  },
                ],
              })(<Input placeholder='用户名' />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
                添加
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Add;
