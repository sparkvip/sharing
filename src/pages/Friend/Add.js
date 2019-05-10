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


@connect(({ downlist }) => ({
  downlist: downlist.list,
}))
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
      // 遍历去除文件名称，存放在数组集合中
      const fileNameArray = values.file.fileList.map((v) => { return v.name; });
      const fileName = fileNameArray && fileNameArray[0];
      // 将file属性制空,path接受文件名称[文件名称用分号隔开]
      const params = { ...values, file: null, name: fileName, path: fileName, userId }
      if (!err) {
        const option = {
          url: `/api/resource/insert`,
          method: 'post',
          params,
        };
        axios(option).then(() => {
          message.success('提交成功!');
          // 提交成功进行表单重置
          form.resetFields();
        }).catch(error => {
          message.error('提交失败!');
          message.error(error.message);
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
                    message: '资源名称为必输项',
                  },
                ],
              })(<Input placeholder='资源名称' />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Add;
