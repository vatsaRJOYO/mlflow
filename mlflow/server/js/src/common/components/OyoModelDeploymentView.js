import React from 'react'
import PropTypes from 'prop-types';
import { Form, Input, Button, Radio } from 'antd/lib/index';
import { Spacer } from '../../shared/building_blocks/Spacer';
import { FormattedMessage, injectIntl } from 'react-intl';


export class OyoModelDeploymentViewImpl extends React.Component {
  static propTypes = {
    deploymentHistory: PropTypes.arrayOf(PropTypes.string),
    form: PropTypes.object.isRequired,
    handleTriggerDeployment: PropTypes.func.isRequired,
    isRequestPending: PropTypes.bool.isRequired,
    intl: PropTypes.any
  };

  serviceNameValidator = (rule, value, callback) => {
    const serviceNameRegExp = new RegExp("^[a-z]+(-[a-z]+)*$");
    callback(
      serviceNameRegExp.test(value)
      ? undefined
      : this.props.intl.formatMessage(
        {
          defaultMessage: 'Service name must contain hyphenated lower case letters',
          description: 'Validation message for service name check with regular expression'
        },
        {
          value: value
        }
      ),
    );
  };
  render() {
    const { form, isRequestPending, handleTriggerDeployment } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Spacer direction='vertical' size='small'>
        <div style={styles.deploymentForm.wrapper}>
          <Form {...styles.formItemLayout} onSubmit={handleTriggerDeployment}>
            <Form.Item
              label={this.props.intl.formatMessage({
              defaultMessage: 'Environment of deployment',
              description: 'Label Text for environment for model deployment',
              })}
            >
              {getFieldDecorator('environment',{
                initialValue: "staging",
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
                  <Radio.Button value="staging">Staging</Radio.Button>
                  <Radio.Button value="production">Production</Radio.Button>
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