import React, { memo } from 'react';
import { Table, Card } from 'antd';
import styles from './Analysis.less';

const categoryConst = [
  { key: 1, code: 'COMPUTER', name: '计算机' },
  { key: 2, code: 'ENGLISH', name: '英语' },
  { key: 3, code: 'MATH', name: '数学' },
  { key: 4, code: 'PHYSICAL', name: '物理' },
  { key: 5, code: 'CHEMISTRY', name: '化学' }
]

const columns = [
  {
    title: '排名',
    dataIndex: 'resourceIndex',
    key: 'resourceIndex',
    align: 'center',

  },
  {
    title: '资源名称',
    dataIndex: 'name',
    key: 'name',
    // render: text => <a href="/">{text}</a>,
    align: 'center',

  },
  {
    title: '资源分类',
    dataIndex: 'category',
    key: 'category',
    // sorter: (a, b) => a > b,
    className: styles.alignRight,
    render: text => {
      const temp = categoryConst.filter(item => {
        return item.code === text
      })
      return temp[0] && temp[0].name
    },
    align: 'center',

  },
  {
    title: '上传用户',
    dataIndex: 'userName',
    key: 'userName',
    align: 'center',
  },
  {
    title: '下载量',
    dataIndex: 'downloadAmount',
    key: 'downloadAmount',
    align: 'center',
  },
];
const pagination = {
  showSizeChanger: true,
  showQuickJumper: true,
}

const TopSearch = memo(({ loading, searchData, changeValue }) => (
  <Card
    loading={loading}
    bordered={false}
    title='热门下载'
    style={{ marginTop: 24 }}
  >
    <Table
      rowKey={record => record.index}
      size="small"
      columns={columns}
      dataSource={searchData}
      pagination={pagination}
      onRow={(record) => { // 行点击事件
        return {
          onClick: () => changeValue(record)
        }
      }}
    />
  </Card>
));

export default TopSearch;
