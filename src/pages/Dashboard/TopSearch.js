import React, { memo } from 'react';
import {  Table,  Card,  } from 'antd';
import styles from './Analysis.less';

const columns = [
  {
    title: '排名',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '资源名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="/">{text}</a>,
  },
  {
    title: '资源分类',
    dataIndex: 'category',
    key: 'category',
    // sorter: (a, b) => a.count - b.count,
    className: styles.alignRight,
  },
  {
    title: '上传用户',
    dataIndex: 'username',
    key: 'username',
    // sorter: (a, b) => a.range - b.range,
    // render: (text, record) => (
    //   <Trend flag={record.status === 1 ? 'down' : 'up'}>
    //     <span style={{ marginRight: 4 }}>{text}%</span>
    //   </Trend>
    // ),
    align: 'right',
  },
];

const TopSearch = memo(({ loading, searchData, dropdownGroup }) => (
  <Card
    loading={loading}
    bordered={false}
    title='热门下载'
    extra={dropdownGroup}
    style={{ marginTop: 24 }}
  >
    <Table
      rowKey={record => record.index}
      size="small"
      columns={columns}
      dataSource={searchData}
      pagination={{
        style: { marginBottom: 0 },
        pageSize: 5,
      }}
    />
  </Card>
));

export default TopSearch;
