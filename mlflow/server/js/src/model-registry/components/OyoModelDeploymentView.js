import React from 'react'
import PropTypes from 'prop-types';
import { Form, Input, Button, Radio, Switch } from 'antd/lib/index';
import { Spacer } from '../../shared/building_blocks/Spacer';
import { FormattedMessage, injectIntl } from 'react-intl';
import { DeploymentsTable } from './DeploymentFormTable'
import { deploymentOptions } from '../constants'


export class OyoModelDeploymentViewImpl extends React.Component {
  static propTypes = {
    deployments: PropTypes.arrayOf(PropTypes.object),
    form: PropTypes.object.isRequired,
    handleTriggerDeployment: PropTypes.func.isRequired,
    isRequestPending: PropTypes.bool.isRequired,
    intl: PropTypes.any
  };

  state = {
    overwrite_toggle: false,
  }

  resetStates = () => this.setState({overwrite_toggle: false});

  handleOverwriteChange = (checked, event) => this.setState({overwrite_toggle: checked})


  serviceNameValidator = (rule, value, callback) => {
    const serviceNameRegExp = new RegExp("^[a-z]+(-[a-z]+)*(-[0-9])?$");
    callback(
      serviceNameRegExp.test(value)
      ? undefined
      : this.props.intl.formatMessage(
        {
          defaultMessage: 'Service name must contain hyphenated lower case letters,optionally followed by stack label',
          description: 'Validation message for service name check with regular expression'
        },
        {
          value: value
        }
      ),
    );
  };

  numericalValidator = (rule, value, callback) => {
    const serviceNameRegExp = new RegExp("^[0-9]*$");
    callback(
      serviceNameRegExp.test(value)
      ? undefined
      : this.props.intl.formatMessage(
        {
          defaultMessage: 'Must be only numbers',
          description: 'Validation message for numerical check with regular expression'
        },
        {
          value: value
        }
      ),
    );
  };

  render() {
    const { form, isRequestPending, handleTriggerDeployment, deployments, intl } = this.props;
    const { getFieldDecorator } = form;

    const _deployments = ( Array.isArray(deployments) && (deployments.length) > 0 ) ? deployments : []

    const radioConfig = deploymentOptions[process.env.REACT_APP_DEPLOY_ENV];

    return (
      <Spacer direction='vertical' size='small'>
        <DeploymentsTable intl={intl} deployment_data={_deployments} />
        <div style={styles.deploymentForm.wrapper}>
          <Form {...styles.formItemLayout} onSubmit={handleTriggerDeployment}>
            <Form.Item
              label={this.props.intl.formatMessage({
              defaultMessage: 'Environment of deployment',
              description: 'Label Text for environment for model deployment',
              })}
            >
              {getFieldDecorator('environment',{
                initialValue: radioConfig.defaultRadio,
                rules: [
                  {
                    required: true,
                    message: this.props.intl.formatMessage({
                      defaultMessage: 'Environment must be selected.',
                      description:
                        'Error message for environemnt selection requirement in oyo Model Deployment view in MLflow',
                    }),
                  },
                ],
              })(
                <Radio.Group  buttonStyle="solid">
                  {radioConfig.radios}
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item 
              label={this.props.intl.formatMessage({
                defaultMessage: 'Service Name',
                description: 'Label Text for service name for model deployment',
              })}
            >
              {getFieldDecorator('service-name',{
                rules: [
                  {
                    required: true,
                    message: this.props.intl.formatMessage({
                      defaultMessage: 'Service name is required.',
                      description:
                        'Error message for service name requirement in oyo Model Deployment view in MLflow',
                    }),
                  },
                  {validator: this.serviceNameValidator}
                ]
              })(
                <Input
                  aria-label='service name'
                  placeholder={this.props.intl.formatMessage({
                    defaultMessage: 'Service Name',
                    description:
                      'Default text for service name placeholder in model deployment form in MLflow',
                  })}
                  style={styles.deploymentForm.nameInput}
                />,
              )}
            </Form.Item>

            <Form.Item 
              label={this.props.intl.formatMessage({
                defaultMessage: 'Specify CPU, Memory, and Delay',
                description: 'Label Text for service name for model deployment',
              })}
            >
              {getFieldDecorator('overwrite',{
                valuePropName: 'checked',
                initialValue: false,
                rules: [
                  {
                    required: true,
                    message: this.props.intl.formatMessage({
                      defaultMessage: 'Overwrite is required.',
                      description:
                        'Error message for overwrite requirement in oyo Model Deployment view in MLflow',
                    }),
                  }
                ]
              })(
                <Switch checkedChildren="Yes" unCheckedChildren="No" onChange={this.handleOverwriteChange}/>,
              )}
            </Form.Item>

            {
              this.state.overwrite_toggle &&
              <div>
              <Form.Item 
                label={this.props.intl.formatMessage({
                  defaultMessage: 'CPU (in millis)',
                  description: 'Label Text for CPU for model deployment',
                })}
              >
                {getFieldDecorator('cpu',{
                  rules: [ 
                    {validator: this.numericalValidator}
                  ]
                })(
                  <Input
                    aria-label='cpu'
                    placeholder={this.props.intl.formatMessage({
                      defaultMessage: '500',
                      description:
                        'Default text for cpu placeholder in model deployment form in MLflow',
                    })}
                    style={styles.deploymentForm.nameInput}
                  />,
                )}
              </Form.Item>
              <Form.Item 
                label={this.props.intl.formatMessage({
                  defaultMessage: 'Memory (in Mi)',
                  description: 'Label Text for memory for model deployment',
                })}
              >
                {getFieldDecorator('memory',{
                  rules: [
                    {validator: this.numericalValidator}
                  ]
                })(
                  <Input
                    aria-label='memory'
                    placeholder={this.props.intl.formatMessage({
                      defaultMessage: '500',
                      description:
                        'Default text for memory placeholder in model deployment form in MLflow',
                    })}
                    style={styles.deploymentForm.nameInput}
                  />,
                )}
              </Form.Item>
              <Form.Item 
                label={this.props.intl.formatMessage({
                  defaultMessage: 'Initial Delay (seconds)',
                  description: 'Label Text for initial delay seconds for model deployment',
                })}
              >
                {getFieldDecorator('initial-delay',{
                  rules: [
                    {validator: this.numericalValidator}
                  ]
                })(
                  <Input
                    aria-label='initial dealy'
                    placeholder={this.props.intl.formatMessage({
                      defaultMessage: '60',
                      description:
                        'Default text for initial delay seconds placeholder in model deployment form in MLflow',
                    })}
                    style={styles.deploymentForm.nameInput}
                  />,
                )}
              </Form.Item>
              
            </div>
            }
            <Form.Item {...styles.tailFormItemLayout} >
              <Button type="primary" loading={isRequestPending} htmlType='submit' >
                <FormattedMessage
                  defaultMessage='Deploy'
                  description='Add button text in editable oyo model deployment form table view in MLflow'
                />
              </Button>
            </Form.Item>
          </Form> 

        </div>
      </Spacer>
    );

  }
}


const styles = {
  deploymentForm: {
    wrapper: { marginLeft: 7 },
    label: {
      marginTop: 20,
    },
    nameInput: { width: 186 },
    valueInput: { width: 186 },
  },

  formItemLayout: {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  },
  tailFormItemLayout: {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  },
};

export const OyoModelDeploymentView = injectIntl(Form.create()(OyoModelDeploymentViewImpl));