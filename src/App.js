import React, {Component} from 'react';
import {Table, Button, Col, Row, Card} from 'antd'
import io from 'socket.io-client';
import {Menu} from 'element-react';
import {get} from 'lodash';
import JSONPretty from 'react-json-pretty';

const queryString = require('query-string');



class App extends Component {

    constructor() {
        super();
        this.state = {
            data: [],
            selectedKey: 0
        }
    }

    columns = [{
        title: '请求方法',
        dataIndex: 'method',
        key: 'key',
        width: 150,
        height: 54,
        onSelect: (data) =>{
            console.log(data);
        }
    }, {
        title: 'URL',
        dataIndex: 'url',
        height: 54,
        render: (data) => {
            const num = data.indexOf('?');
            if (num === -1) {
                return data
            } else {
                return data.substring(0, num);
            }
        },
        onSelect: (data) =>{
            console.log(data);
        }
    }
    ];


    componentDidMount() {
        const {data} = this.state;
        const socket = io('http://localhost:3000');
        socket.on('send data', msg => {
            data.unshift(msg);
            this.setState({data});
        });
    }

    getParameter(data) {
        const method = get(data, 'method');
        if (method === 'GET') {
            const num = data.body.indexOf('?');
            const Parameter = data.body.substring(num);
            return queryString.parse(Parameter, null, 2)
        } else {
            return queryString.parse(data, null, 2)
        }
    }

    render() {
        const {data, selectedKey} = this.state;
        const json = this.getParameter(data[selectedKey]);
        return (
            <div>
                <Menu mode="horizontal">
                    <Menu.Item
                        style={{width: '50%'}}
                        index="1">
                        <Button
                            style={{width: '50%', height: 50}}
                            onClick={() => {
                                this.setState({data: []});
                            }}>
                            清除
                        </Button>
                    </Menu.Item>
                </Menu>
                <Row>
                    <Col span={12}>
                        <Table
                            onChange={(selectedRowKeys) => {
                                console.log(selectedRowKeys);
                            }}
                            columns={this.columns}
                            scroll={{y: 640}}
                            pagination={false}
                            dataSource={this.state.data}
                            defaultExpandAllRows={true}
                        />
                    </Col>
                    <Col span={12}>
                        <div style={{borderWidth: 1, borderColor: 'red', padding: 5}}>
                            <JSONPretty style={{width: '100%'}} id="json-pretty" json={json}/>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default App;
