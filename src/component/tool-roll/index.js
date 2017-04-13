/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { Row, Form, Table, Button, Input, Modal, message } from 'antd';
import RollUp from '@axetroy/roll';

import { add, remove } from '../../redux/rollList';

const { Column } = Table;
const FormItem = Form.Item;

class Roll extends Component {
  state = {
    visible: false,
    result: ''
  };

  hideModel() {
    this.setState({ visible: false });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { name, rank } = this.state;
    if (!name) return message.error('Name must be required');
    if (isNaN(+rank) || +rank <= 0)
      return message.error('Invalid Rank. Rank > 0');

    if (this.props.rollList.findIndex(v => v.name === name) >= 0)
      return message.error('Duplicate name');

    this.props.addRollList({
      name: name,
      rank: rank,
      key: name
    });
  }

  onchangeRank(e) {
    const value = e.target.value;
    this.setState({ rank: value });
  }

  onchangeName(e) {
    const value = e.target.value;
    this.setState({ name: value });
  }

  roll() {
    const roller = new RollUp();
    const list = this.props.rollList;
    list.forEach(v => roller.add(v.name, +v.rank));
    const result = roller.roll();
    console.info(result);
    this.setState({ result, visible: true });
  }

  render() {
    return (
      <Row>
        <Row>
          <h3>从预定的列表中, 随机Roll取</h3>
          <p>
            使用的库: <Link to="/repo/axetroy/roll">Roll</Link>
          </p>
          <p>权重越大, Roll到的概率就越高</p>
          <p>概率 = 当前权重/总权重</p>
        </Row>
        <Row>
          <Modal
            title="ROLL RESULT"
            visible={this.state.visible}
            onOk={() => this.hideModel()}
            onCancel={() => this.hideModel()}
          >
            {this.state.result}
          </Modal>

          <Form layout="inline" onSubmit={e => this.handleSubmit(e)}>
            <FormItem required>
              <Input
                onChange={e => this.onchangeName(e)}
                type="text"
                placeholder="名称"
              />
            </FormItem>
            <FormItem required>
              <Input
                onChange={e => this.onchangeRank(e)}
                type="text"
                placeholder="权重"
              />
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit">
                添加
              </Button>
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={() => this.roll()}>
                ROLL
              </Button>
            </FormItem>
          </Form>
          <Table dataSource={this.props.rollList} pagination={false}>
            <Column title="名称" dataIndex="name" key="name" />
            <Column title="权重" dataIndex="rank" key="rank" />
            <Column
              title="操作"
              key="Action"
              render={(data, record) => (
                <span>
                  <Button onClick={() => this.props.removeRollList(data.name)}>
                    Delete
                  </Button>
                </span>
              )}
            />
          </Table>
        </Row>
      </Row>
    );
  }
}

export default connect(
  function mapStateToProps(state) {
    return { rollList: state.rollList };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        addRollList: add,
        removeRollList: remove
      },
      dispatch
    );
  }
)(Roll);
