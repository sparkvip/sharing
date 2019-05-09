/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
import {
  Modal,
  Input,
  Form,
  Button,
  Select
} from 'antd';
import axios from 'axios';
import { connect } from 'dva';


// context设置页面中新增和编辑的弹窗
@Form.create()
@connect(({ chart }) => ({
  chart,
}))
class Description extends React.Component {
  constructor(props) {
    super(props);
    const { values } = props;
    this.state = {
      values,
      // 所属学院下拉框
      categoryDown: [],
      // 文件类型下拉框
      fileTypeDown: [],
    }
  }

  // 页面初次加载之前自动调用
  componentWillMount() {
    // 获取两个下拉框中的值
    let option = {
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
    option = { ...option, params: { code: 'fileType' } }
    axios(option).then(res => {
      this.setState({
        fileTypeDown: res.data,
      })
    }).catch(err => {
      console.log('err', err)
    })
  }

  // 文件下载
  downloadFile = () => {
    const { values: localValue } = this.state;
    // console.log('localValue',localValue);

    // 可以根据需求传特定的一些参数
    const downloadUrl = '/api/file/download';
    fetch(downloadUrl, {
      method: 'POST',
      body: window.JSON.stringify(localValue),
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then((response) => {
      response.blob().then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        // 不能直接创建一个<a>标签
        // const a = document.createElement('a_id');
        const a = document.getElementById('a_id');
        // 无法从返回的文件流中获取文件名
        // let filename = response.headers.get('Content-Disposition');
        const filename = localValue.path;
        a.href = blobUrl;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(blobUrl);
      });
    }).catch((error) => {
      console.log(error);
    });



  }


  render() {
    const { modalVisible, form: { getFieldDecorator }, handleCancel, title } = this.props;
    const { values, fileTypeDown, categoryDown } = this.state;
    return (
      <Modal
        destroyOnClose
        title={title}
        visible={modalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        width={700}
      >
        <Form>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='资源名称'>
            {getFieldDecorator('name', {
              initialValue: values.name
            })(
              <Input style={{ color: 'black' }} disabled='true' />
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='资源分类'>
            {getFieldDecorator('category', {
              initialValue: values.category
            })(
              <Select placeholder="请选择" style={{ width: '100%', color: 'black' }} disabled='true'>
                {categoryDown.map(item => (
                  <Select.Option key={item.id} value={item.code}>{item.name}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='资源描述'>
            {getFieldDecorator('introduction', {
              initialValue: values.introduction
            })(
              <Input.TextArea style={{ color: 'black' }} rows={4} disabled='true' />
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='文件类型'>
            {getFieldDecorator('fileType', {
              initialValue: values.fileType
            })(
              <Select placeholder="请选择" style={{ width: '100%', color: 'black' }}>
                {fileTypeDown.map(item => (
                  <Select.Option key={item.id} value={item.code}>{item.name}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='上传用户'>
            {getFieldDecorator('userName', {
              initialValue: values.userName
            })(
              <Input style={{ color: 'black' }} disabled='true' />
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label='上传时间'>
            {getFieldDecorator('uploadTime', {
              initialValue: values.uploadTime
            })(
              <Input style={{ color: 'black' }} disabled='true' />
            )}
          </Form.Item>
          <Form.Item style={{ marginLeft: '250px' }} labelCol={{ span: 12 }} wrapperCol={{ span: 15 }}>
            <Button type="primary" icon="download" onClick={this.downloadFile}>下载</Button>
          </Form.Item>
        </Form>
        <a id='a_id' />
      </Modal>
    );
  }
}
export default (Form.create()(Description));