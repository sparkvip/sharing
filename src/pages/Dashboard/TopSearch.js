import React, { memo } from 'react';
import {  Table,  Card,  } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import Trend from '@/components/Trend';
import styles from './Analysis.less';

const columns = [
  {
    title: <FormattedMessage id="app.analysis.table.rank" defaultMessage="Rank" />,
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: (
      <FormattedMessage id="app.analysis.table.search-keyword" defaultMessage="Search keyword" />
    ),
    dataIndex: 'keyword',
    key: 'keyword',
    render: text => <a href="/">{text}</a>,
  },
  {
    title: <FormattedMessage id="app.analysis.table.users" defaultMessage="Users" />,
    dataIndex: 'count',
    key: 'count',
    sorter: (a, b) => a.count - b.count,
    className: styles.alignRight,
  },
  {
    title: <FormattedMessage id="app.analysis.table.weekly-range" defaultMessage="Weekly Range" />,
    dataIndex: 'range',
    key: 'range',
    sorter: (a, b) => a.range - b.range,
    render: (text, record) => (
      <Trend flag={record.status === 1 ? 'down' : 'up'}>
        <span style={{ marginRight: 4 }}>{text}%</span>
      </Trend>
    ),
    align: 'right',
  },
];

const TopSearch = memo(({ loading, searchData, dropdownGroup }) => (
  <Card
    loading={loading}
    bordered={false}
    title={
      <FormattedMessage id="app.analysis.online-top-search" defaultMessage="Online Top Search" />
    }
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
