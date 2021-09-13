import React from 'react';
import { Table, Descriptions } from 'antd';
import PropTypes from 'prop-types';
import Utils from '../../common/utils/Utils'
import { deploymentsTableEnvFilterOptions } from '../constants'


export class DeploymentsTable extends React.Component {
    static propTypes = {
        deployment_data: PropTypes.arrayOf(PropTypes.object).isRequired,
        intl: PropTypes.any,
    };

    getExpandRender = (record) => {
        let items = []
        descritpion_items_.forEach(
            (item) => {
                items.push(<Descriptions.Item
                    label={item.defaultMessage}
                >
                    {item.render(record[item.fieldName])}
                </Descriptions.Item>)
            }
        );
        return <Descriptions className='metadata-list'>{items}</Descriptions>
    };

    onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
      }

    render(){
        const { deployment_data } = this.props;

        return <Table columns={columns} rowKey='id' dataSource={deployment_data} expandedRowRender={this.getExpandRender} onChange={this.onChange} pagination={{ showSizeChanger: true, defaultPageSize: 5, pageSizeOptions: ['5', '10', '20']}}/>

    }


}


const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        sorter: (a,b) => parseInt(a.id) - parseInt(b.id),
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
    },
    {
        title: 'Environment',
        dataIndex: 'environment',
        filters: deploymentsTableEnvFilterOptions[process.env.REACT_APP_DEPLOY_ENV],
        filterMultiple: false,
        onFilter: (value, record) => record.environemtn === value,
    },
    {
        title: 'Service Name',
        dataIndex: 'service_name',
    },
    {
        title: 'Status',
        dataIndex: 'status',
    },
    {
        title: 'Jira ID',
        dataIndex: 'jira_id',
    },
    {
        title: 'Last Updated',
        dataIndex: 'last_updated_timestamp',
        render: (timestamp) => Utils.formatTimestamp(timestamp),
        sorter: (a,b) => parseInt(a.last_updated_timestamp) - parseInt(b.last_updated_timestamp),
        sortDirections: ['descend', 'ascend'],
    },
]

const stringRender = (val) => (val == null || val === '') ? '<UNFILLED>' : val;
const boolRender = (val) => (val == null || !val) ? 'False' : 'True';
const urlRender = (val) => (val == null || val === '') ? '<UNFILLED>' : <a href={val} target="_blank" rel="noopener noreferrer">Link</a>

const descritpion_items_ = [
    {
        defaultMessage:'Message',
        description: 'Label for the message in expanded row of deploymnet section in model version page',
        fieldName: 'message',
        render: stringRender,

    },
    {
        defaultMessage:'Created',
        description: 'Label for the   in expanded row of deploymnet section in model version page',
        fieldName: 'creation_timestamp',
        render: Utils.formatTimestamp,

    },
    {
        defaultMessage:'Updated',
        description: 'Label for the updation time in expanded row of deploymnet section in model version page',
        fieldName: 'last_updated_timestamp',
        render: Utils.formatTimestamp,

    },
    {
        defaultMessage:'Build Job',
        description: 'Label for the deploument job ur in expanded row of deploymnet section in model version page',
        fieldName: 'job_url',
        render: urlRender,
    },
    {
        defaultMessage:'Deployed helm',
        description: 'Label for the deployment helm ur in expanded row of deploymnet section in model version page',
        fieldName: 'helm_url',
        render: urlRender,
    },
    {
        defaultMessage:'OverWrite',
        description: 'Label for the overwrite in expanded row of deploymnet section in model version page',
        fieldName: 'overwrite',
        render: boolRender,

    },
    {
        defaultMessage:'CPU',
        description: 'Label for the CPU  in expanded row of deploymnet section in model version page',
        fieldName: 'cpu',
        render: stringRender,

    },
    {
        defaultMessage:'Memory',
        description: 'Label for the  memory in expanded row of deploymnet section in model version page',
        fieldName: 'memory',
        render: stringRender,

    },
    {
        defaultMessage:'Initial Delay Seconds',
        description: 'Label for the   in expanded row of deploymnet section in model version page',
        fieldName: 'initial_delay',
        render: stringRender,

    },
    
]

